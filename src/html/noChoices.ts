import * as types from "../types";

export const noChoices = (
  url: URL,
  response: types.OAiChatResponse,
): string => {
  return `<h1>No valid choices</h1>
<h2> Try again?</h2>
<textarea style="width: 100%;">${decodeURIComponent(url.pathname)}</textarea>
<button>Try again</button>
<script>
document.querySelector('button').addEventListener('click', function() {
console.log("click")
  let url = new URL(window.location);
  let value = document.querySelector('textarea').value;
  if (value.startsWith('/')) {
    value = value.slice(1);
  }
  value = '/' + encodeURIComponent(value);
  url.pathname = value;
  window.location = url;

});
</script>
<h2>found:</h2>
<ol>
${response.choices.map((c) => `<li><pre>${c}</pre></li>`).join("\n")}
</ol>`;
};
