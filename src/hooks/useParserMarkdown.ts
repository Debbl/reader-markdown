import markdownit from "markdown-it";
import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js";
import localforage from "localforage";

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (!(lang && hljs.getLanguage(lang))) return "";

    try {
      return hljs.highlight(str, { language: lang }).value;
    } catch (__) {}

    return "";
  },
});

function useParserMarkdown() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const html = useMemo(() => md.render(content), [content]);

  useEffect(() => {
    localforage.getItem<string>("content").then((value) => {
      if (value) {
        setContent(value);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    localforage.setItem("content", content);
  }, [content]);

  return {
    isLoading,
    html,
    content,
    setContent,
    setIsLoading,
  };
}

export { useParserMarkdown };
