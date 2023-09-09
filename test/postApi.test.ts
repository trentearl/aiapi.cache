import { expect, test } from "vitest";

import { handle, env, PREFIX } from "./shared";
import { openAiTextResponse } from "./fixtures";
const describe = setupMiniflareIsolatedStorage();

describe("POST /", () => {
  test("uncached success", async () => {
    const req = new Request(`${PREFIX}/`, {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "who is the leader of Cambodia. just output the name",
          },
        ],
      }),
    });

    const fetchMock = getMiniflareFetchMock();
    fetchMock.disableNetConnect();
    const origin = fetchMock.get("https://api.openai.com");

    origin
      .intercept({ method: "POST", path: "/v1/chat/completions" })
      .reply(200, openAiTextResponse);

    const res = await handle(req, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(openAiTextResponse);
  });
});
