import worker from "../src/worker";

type Env = {
  OPENAI_API_KEY: string;
  airesponses: R2Bucket;
  aikv: KVNamespace;
};

export const env = getMiniflareBindings<Env>();

export const PREFIX = "http://localhost";

export const handle = worker.fetch;
