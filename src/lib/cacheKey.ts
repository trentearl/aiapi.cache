import { resolve } from "bluebird";

import * as types from "../types";

export async function hash(parts: (string | number)[]): Promise<string> {
  const s = parts.join(":");
  return crypto.subtle
    .digest("SHA-1", new TextEncoder().encode(s))
    .then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    });
}

export const getCacheKeys = async (
  params: types.OAiChatParams,
): Promise<string[]> => {
  const keys = await resolve([
    [
      stringify(clean(params.messages)),
      params.model,
      params.n,
      params.temperature,
      params.top_p,
    ],
    [
      stringify(clean(lowerCase(params.messages))),
      params.model,
      params.n,
      params.temperature,
      params.top_p,
    ],
  ]).map(hash);

  return keys;
};

function clean(messages: types.OAiChatMessage[]): types.OAiChatMessage[] {
  return messages.map((message) => {
    return {
      ...message,
      content: message.content.trim(),
    };
  });
}
function stringify(messages: types.OAiChatMessage[]): string {
  return JSON.stringify(messages);
}

function lowerCase(messages: types.OAiChatMessage[]): types.OAiChatMessage[] {
  return messages.map((message) => {
    return {
      ...message,
      content: message.content.toLowerCase(),
    };
  });
}
