import * as validate from "./validate";

export const EXTENSION_MIME_MAP = {
  txt: {
    mime: "text/plain",
    validate: (_: string) => true,
  },
  json: {
    mime: "application/json",
    validate: validate.isJson,
  },
  js: {
    mime: "application/javascript",
    validate: validate.isJs,
  },
  html: {
    mime: "text/html;charset=UTF-8",
    validate: validate.isHtml,
  },
  css: {
    mime: "text/css",
    validate: validate.isCss,
  },
  md: {
    mime: "text/markdown",
    validate: validate.isMarkdown,
  },
  ts: {
    mime: "application/typescript",
    validate: validate.isTs,
  },
  py: {
    mime: "application/python",
    validate: validate.isPython,
  },
  xml: {
    mime: "application/xml",
    validate: validate.isXml,
  },
  sh: {
    mime: "application/x-sh",
    validate: validate.isShell,
  },
  yml: {
    mime: "application/x-yaml",
    validate: validate.isYaml,
  },
  yaml: {
    mime: "application/x-yaml",
    validate: validate.isYaml,
  },
  bash: {
    mime: "application/x-bash",
    validate: validate.isShell,
  },
};

export type ExtensionMap = typeof EXTENSION_MIME_MAP;
export type Extension = keyof ExtensionMap;
export type Mime = ExtensionMap[Extension]["mime"];

export const isExtension = (path: string): path is Extension => {
  return Object.keys(EXTENSION_MIME_MAP).includes(path.toLowerCase());
};

export function isCode(extension: Extension): boolean {
  return ["py", "ts", "js", ".sh", ".bash"].includes(extension);
}
