import { any, resolve } from "bluebird";

import * as types from "./types";
import * as html from "./html";
import * as lib from "./lib";

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export interface Env {
  OPENAI_API_KEY: string;
  airesponses: R2Bucket;
  aikv: KVNamespace;
}

export const shouldCache = (request: Request): boolean => {
  const url = new URL(request.url);

  if (url.searchParams.has("no-cache")) {
    return false;
  }
  const cacheControl = request.headers.get("cache-control");
  if (cacheControl && cacheControl.includes("no-cache")) {
    return false;
  }

  return true;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cache = shouldCache(request);
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(html.landingHtml, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    if (request.method === "GET") {
      return handleGetRequest(request, env, cache);
    }

    try {
      const body = await request.json();
      const parsed = types.OAiChatParamsZ.safeParse(body);
      if (!parsed.success) {
        throw new Error(parsed.error.message);
      }

      const params = parsed.data;

      let key = request.headers.get("Authorization")?.replace("Bearer ", "");

      if (!key && env.OPENAI_API_KEY && params.model === "gpt-3.5-turbo") {
        key = env.OPENAI_API_KEY;
      }

      if (!key) {
        throw new Error("No API key");
      }
      const data = await handleChat({ params, env, cache, key });

      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        return new Response(e.message, {
          status: 500,
        });
      }
      return new Response("unkown error", {
        status: 500,
      });
    }
  },
};

const handleGetRequest = async (
  request: Request,
  env: Env,
  cache: boolean,
): Promise<Response> => {
  const url = new URL(request.url);

  let pathParts = decodeURIComponent(url.pathname.slice(1)).split(".");

  let extension: lib.Extension;
  let maybeExtension = pathParts[pathParts.length - 1];

  if (lib.isExtension(maybeExtension)) {
    pathParts.pop();
    extension = maybeExtension;
  } else {
    extension = "txt";
  }

  let innerPrompt = pathParts.join(".");
  let prompt = ``;
  if (extension) {
    prompt += `you are an AI that generates text to be in embeded in files like: .${extension}`;
    prompt += `\n`;

    if (extension == "txt" || extension == "md") {
      prompt += `generate simple text`;
    } else if (
      extension == "json" ||
      extension == "xml" ||
      extension == "yml" ||
      extension == "yaml"
    ) {
      prompt += `generate parseble ${lib.EXTENSION_MIME_MAP[extension].mime}`;
    } else if (lib.isCode(extension)) {
      prompt += `you generate exclusively uncommented runnable ${extension} code`;
    }
    prompt += `dont include examples, without logging`;
    prompt += `\n`;
    prompt += `you only output what the instruction asks`;
    prompt += `\n`;
    prompt += `---
instruction:

${innerPrompt}

end of instruction

`;
  }

  const params: types.OAiChatParams = {
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
    temperature: 1.2,
    top_p: 1,
    n: extension == "txt" ? 1 : 3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const res = await runChat({
    params,
    env,
    cache,
    key: env.OPENAI_API_KEY,
  });

  const choices = res.choices.filter((c) =>
    lib.EXTENSION_MIME_MAP[extension].validate(c.message.content),
  );

  if (choices.length === 0) {
    return new Response(html.noChoices(new URL(request.url), res), {
      status: 420,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const { content } = res.choices[0].message;

  if (cache) {
    await cacheResponse(params, res, env);
  }

  let mimeType = lib.EXTENSION_MIME_MAP[extension].mime;
  if (
    request.headers.get("Sec-Fetch-Dest") == "iframe" &&
    lib.isCode(extension)
  ) {
    mimeType = "text/plain";
  }

  return new Response(content, {
    headers: {
      "Content-Type": mimeType,
      "X-AI-API-Cached": res.usage.total_tokens == 0 ? "true" : "false",
    },
  });
};

type ChatProps = {
  params: types.OAiChatParams;
  env: Env;
  key: string;
  cache: boolean;
};

const handleChat = async ({
  params,
  env,
  key,
  cache,
}: ChatProps): Promise<types.OAiChatResponse> => {
  const response = await runChat({
    params,
    env,
    cache,
    key,
  });

  if (cache) {
    await cacheResponse(params, response, env);
  }

  return response;
};

const runChat = async ({
  params,
  env,
  key,
  cache,
}: ChatProps): Promise<types.OAiChatResponse> => {
  if (cache) {
    const cached = await getCached(params, env);
    if (cached) {
      return cached;
    }
  }

  const httpResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key} `,
      },
      body: JSON.stringify(params),
    },
  );

  const rawJson = await httpResponse.json();
  if (httpResponse.status !== 200) {
    throw new Error(
      // @ts-ignore
      rawJson.error.message,
      // @ts-ignore
      rawJson.error,
      httpResponse.status,
    );
  }

  const response = types.OAiChatResponseZ.parse(rawJson);

  return response;
};

const cacheResponse = async (
  params: types.OAiChatParams,
  response: types.OAiChatResponse,
  env: Env,
): Promise<void> => {
  const responseString = JSON.stringify(response, null, 2);
  const keys = await lib.getCacheKeys(params);
  const cacheWrites: Promise<any>[] = [
    ...keys.map((key) =>
      env.aikv.put(key, response.id, { expirationTtl: WEEK_IN_SECONDS }),
    ),
    env.aikv.put(response.id, responseString, {
      expirationTtl: WEEK_IN_SECONDS,
    }),
    env.airesponses.put(response.id, responseString),
  ];
  await Promise.all(cacheWrites);
};

const getCached = async (
  params: types.OAiChatParams,
  env: Env,
): Promise<types.OAiChatResponse | null> => {
  const keys = await lib.getCacheKeys(params);
  try {
    const cachedChat = await any(
      keys.map(async (key) => {
        const objectId = await env.aikv.get(key);
        if (!objectId) throw new Error("no object " + objectId);
        const cachedString = await any([
          env.aikv.get(objectId),
          env.airesponses.get(objectId).then((res) => res?.text()),
        ]);
        if (!cachedString) throw new Error("no cache found");
        let cached = types.OAiChatResponseZ.parse(JSON.parse(cachedString));
        return cached;
      }),
    );

    cachedChat.usage.total_tokens = 0;
    cachedChat.usage.prompt_tokens = 0;
    cachedChat.usage.completion_tokens = 0;

    return cachedChat;
  } catch (e) {
    console.warn("getCache error", e);
  }

  return null;
};
