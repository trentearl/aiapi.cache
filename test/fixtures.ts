
import * as types from '../src/types'

export const openAiTextResponse: types.OAiChatResponse = {
  id: "1324",
  object: "chat.completion",
  created: 1694254628,
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "Hun Sen"
      },
      finish_reason: "stop"
    }
  ],
  usage: {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  }
}

export const openAiJsonResponse: types.OAiChatResponse = {
  id: "1234",
  object: "chat.completion",
  created: 1694254628,
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: '{"city":"baku"}'
      },
      finish_reason: "stop"
    }
  ],
  usage: {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  }
}

