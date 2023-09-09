import { z } from "zod";

export const OAiTemperatureZ = z.number().default(0.7);
export type OAiTemperature = z.infer<typeof OAiTemperatureZ>;

export const OAiChatRoleZ = z.union([
  z.literal("user"),
  z.literal("system"),
  z.literal("assistant"),
]);
export type OAiChatRole = z.infer<typeof OAiChatRoleZ>;

export const OAiTopPZ = z.number().default(1);
export type OAiTopP = z.infer<typeof OAiTopPZ>;

export const OAiFrequencyPenaltyZ = z.number().default(0.0);
export type OAiFrequencyPenalty = z.infer<typeof OAiFrequencyPenaltyZ>;

export const OAiPresencePenaltyZ = z.number().default(0.0);
export type OAiPresencePenalty = z.infer<typeof OAiPresencePenaltyZ>;

export const OAiMaxTokensZ = z.number().default(2000);
export type OAiMaxTokens = z.infer<typeof OAiMaxTokensZ>;

export const OAiNZ = z.number().default(1);
export type OAiN = z.infer<typeof OAiNZ>;

export const OAiLogitBiasZ = z.record(z.string(), z.number()).default({});
export type OAiLogitBias = z.infer<typeof OAiLogitBiasZ>;

export const OAiStopZ = z.array(z.string()).nullable().default(null);
export type OAiStop = z.infer<typeof OAiStopZ>;


export const OAiChatModelZ = z.union([
  z.literal("gpt-4"),
  z.literal("gpt-4-32k"),
  z.literal("gpt-3.5-turbo"),
  z.literal("gpt-3.5-turbo-16k"),
]);

export type OAiChatModel = z.infer<typeof OAiChatModelZ>;

export const OAiModelZ = OAiChatModelZ;
export type OAiModel = z.infer<typeof OAiModelZ>;

export type OAiModelDetail<T extends OAiModel | OAiChatModel> = {
  model: T;
  max_tokens: number;
};


export const OAI_CHAT_MODELS: OAiModelDetail<OAiChatModel>[] = [
  {
    model: "gpt-4",
    max_tokens: 8192,
  },

  {
    model: "gpt-4-32k",
    max_tokens: 32768,
  },

  {
    model: "gpt-3.5-turbo",
    max_tokens: 4096,
  },

  {
    model: "gpt-3.5-turbo-16k",
    max_tokens: 16384,
  },
];

export const OAiResponseZ = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  choices: z.array(z.unknown()),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type OAiResponse = z.infer<typeof OAiResponseZ>;


export const OAiChatChoiceZ = z.object({
  index: z.number().nullable(),
  message: z.object({
    role: OAiChatRoleZ,
    content: z.string(),
  }),
  finish_reason: z.string(),
});
export type OAiChatChoice = z.infer<typeof OAiChatChoiceZ>;

export const OAiChatResponseZ = OAiResponseZ.extend({
  choices: z.array(OAiChatChoiceZ),
});

export type OAiChatResponse = z.infer<typeof OAiChatResponseZ>;

export const OAiChatMessageZ = z.object({
  role: OAiChatRoleZ,
  content: z.string(),
});

export type OAiChatMessage = z.infer<typeof OAiChatMessageZ>;

export const OAiChatMessagesZ = z.array(OAiChatMessageZ);

export type OAiChatMessages = z.infer<typeof OAiChatMessagesZ>;

export const OAiGenericParamsZ = z.object({
  temperature: OAiTemperatureZ,
  max_tokens: OAiMaxTokensZ,
  top_p: OAiTopPZ,
  n: OAiNZ,
  frequency_penalty: OAiFrequencyPenaltyZ,
  presence_penalty: OAiPresencePenaltyZ,
});

export const OAiChatConfigZ = OAiGenericParamsZ.extend({
  model: OAiChatModelZ,
});

export type OAiChatConfig = z.infer<typeof OAiChatConfigZ>;

export const OAiChatParamsZ = OAiChatConfigZ.extend({
  messages: OAiChatMessagesZ,
});

export type OAiChatParams = z.infer<typeof OAiChatParamsZ>;

export const OAiParamsZ = OAiChatParamsZ;

export type OAiParams = z.infer<typeof OAiParamsZ>;
