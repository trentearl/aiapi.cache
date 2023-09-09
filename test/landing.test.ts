import { expect, test } from "vitest";

import { handle, env, PREFIX } from "./shared";

test("/ landing returns html", async () => {
  const req = new Request(`${PREFIX}/`);

  const res = await handle(req, env);

  expect(res.status).toBe(200);
  expect(await res.text()).toContain("<title>AI API 💵</title>");
});
