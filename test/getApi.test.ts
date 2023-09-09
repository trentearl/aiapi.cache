import { expect, test } from "vitest";

import { handle, env, PREFIX } from "./shared";
import { openAiJsonResponse } from "./fixtures";
const describe = setupMiniflareIsolatedStorage();

describe("GET", () => {
  test("uncached success", async () => {
    const req = new Request(`${PREFIX}/what is the capital of azerbaijan.json`);

    const fetchMock = getMiniflareFetchMock();
    fetchMock.disableNetConnect();
    const origin = fetchMock.get("https://api.openai.com");

    origin
      .intercept({ method: "POST", path: "/v1/chat/completions" })
      .reply(200, openAiJsonResponse);

    const res = await handle(req, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      city: "baku",
    });
  });
});
