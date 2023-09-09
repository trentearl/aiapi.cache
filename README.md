[https://aiapi.cash](https://aiapi.cash)

# AI API 💵

This is an API to help developers use OpenAI with caching.

## Proxy/Post Mode

Proxy mode mirrors the OpenAI chat API and adds caching.

```bash
curl -s -X POST --json '{
    "model": "gpt-3.5-turbo",
    "messages": [ { "role": "system", "content": "who is the leader of Cambodia. just output the name" } ]
}'   "https://aiapi.cash/"

```

Response:

```json
{
  "id": "12345",
  "object": "chat.completion",
  "created": "00000000",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hun Sen"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```

# GET Mode

Proxy mode is any get request to this api
This mode attempts to use the file extension to determine mime type, we generate three versions and try to parse out the valid file format

## Example 1: package.json

[https://aiapi.cash/node package myexampleproject with express, zod, express-session, typescript.json](https://aiapi.cash/node%20package%20myexampleproject%20with%20express,%20zod,%20express-session,%20typescript.json)

## Example 3: html file

[https://aiapi.cash/american presidents from 1820 to 1900 as table include name (with link to wikipedia), birthplace, years served and political party.html](<https://aiapi.cash/american%20presidents%20from%201820%20to%201900%20as%20table%20include%20name%20(with%20link%20to%20wikipedia),%20birthplace,%20years%20served%20and%20political%20party.html>)

## Example 3: Typescript code

[https://aiapi.cash/output zod types to parse reddits subreddit api.ts](https://aiapi.cash/output%20zod%20types%20to%20parse%20reddits%20subreddit%20api.ts)
