
export const landingHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI API 💵</title>
<style>
    main {
        padding: 10px;
    }
    code {
        white-space: pre-wrap;
    }
    * > code {
        display: block;
        padding: 10px;
        background-color: #eee;
        border-radius: 5px;
        margin: 10px 0;
        box-shadow: 0 0 5px #ccc;
    }

    .copy-btn {
        float: right;
        margin: 10px;
        font-family: monospace;
        cursor: pointer;
    }

    .copy-btn:hover {
        text-decoration: underline;
        color: #008;
    }
    iframe {
        width: 80%;
        border: 4px solid #333;
    }

</style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f0f0;">

    <header style="background-color: #333; color: #fff; text-align: center; padding: 10px;">
        <h1>😎 OpenAI caching proxy 💵</h1>
    </header>
<main>
    <p>This is an api to help developers use openAI with caching.</p>
    <h1>Proxy/Post Mode</h1>
    <span>Proxy mode mirrors the openai chat api and adds caching</span>
    <div>
        <div class='copy-btn'>📋 copy</div>
    <code>curl -s -X POST --json '{
    "model": "gpt-3.5-turbo",
    "messages": [ { "role": "system", "content": "who is the leader of Cambodia. just output the name" } ]
  }' \
  "https://aiapi.cash/"</code>

        <code>{
  "id": "12345",
  "object": "chat.completion",
  "created": 00000000,
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
    "prompt_tokens": 0, // 0 because this is a cached response
    "completion_tokens": 0,
    "total_tokens": 0
  }
}</code>
        <script>
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = btn.parentElement.querySelector('code');
                    navigator.clipboard.writeText(code.innerText);
                });
            });
        </script>
    </div>
    <h1>GET Mode</h1>
    <span>Proxy mode is any get request to this api</span>
    <span>This mode attempts to use the file extension to determine mime type, we generate three versions and try to parse out the valid fileformat</span>

    <h2>Example 1: Typescript code</h2>

    <p>
        <a target="_blank" href="https://aiapi.cash/output zod types to parse reddits subreddit api.ts">
            https://aiapi.cash/output zod types to parse reddits subreddit api.ts
        </a>
    </p>
    <iframe src="https://aiapi.cash/output zod types to parse reddits subreddit api.ts" style="height:60vh"></iframe>
    <p>

        zod types for reddit subreddit api
    </p>
    <hr />

    <h2>Example 2: package.json</h2>
    <p>
        <a target="_blank" href="https://aiapi.cash/node package myexampleproject with express, zod, express-session, typescript.json">
            https://aiapi.cash/node package myexampleproject with express, zod, express-session, typescript.json
        </a>
    </p>
    <iframe src="https://aiapi.cash/node package myexampleproject with express, zod, express-session, typescript.json" style="height:40vh"></iframe>
    <hr />

    <h2>Example 3: html file</h2>

    <p>
        <a target="_blank" href="https://aiapi.cash/american%20presidents%20from%201820%20to%201900%20as%20table%20include%20name%20(with%20link%20to%20wikipedia),%20birthplace,%20years%20served%20and%20political%20party.html">
            https://aiapi.cash/american presidents from 1820 to 1900 as table include name (with link to wikipedia), birthplace, years served and political party.html
        </a>

        </p>
    <iframe style="height:70vh"
        src="https://aiapi.cash/american%20presidents%20from%201820%20to%201900%20as%20table%20include%20name%20(with%20link%20to%20wikipedia),%20birthplace,%20years%20served%20and%20political%20party.html"></iframe>
</main>

`;
