export const isJson = (string: string): boolean => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

export const isYaml = (string: string): boolean => {
  return string.startsWith("---\n") || /^[\w\-]+:/.test(string.split("\n")[0]);
};

export const isHtml = (string: string): boolean => {
  return string.trim().startsWith("<") && string.trim().endsWith(">");
};

export const isXml = isHtml;

export const isPython = (_: string) => true;
export const isShell = (_: string) => true;
export const isJs = (s: string) =>
  s.startsWith("//") ||
  s.startsWith("/*") ||
  s.startsWith("enum") ||
  s.startsWith("import") ||
  s.startsWith("export") ||
  s.startsWith("var") ||
  s.startsWith("function") ||
  s.startsWith("const") ||
  s.startsWith("let");

export const isTs = (s: string) => {
  return isJs(s) || s.startsWith("interface") || s.startsWith("type")
}
export const isCss = (_: string) => true;
export const isMarkdown = (_: string) => true;
