"use client";
import markdownit from "markdown-it";
import type { ChangeEventHandler } from "react";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
import localforage from "localforage";

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (!lang || hljs.getLanguage(lang)) return "";

    try {
      return hljs.highlight(str, { language: lang }).value;
    } catch (__) {}

    return "";
  },
});

export default function Home() {
  const [isSelectFile, setIsSelectFile] = useState(false);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem("html").then((html) => {
      if (html) {
        setHtml(html as string);
        setIsSelectFile(true);
      }
      setLoading(false);
    });
  }, []);

  const handleSelectFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtml(() => {
        const html = md.render(content);
        localforage.setItem("html", md.render(content));
        return html;
      });
      setIsSelectFile(true);
    };

    reader.readAsText(file);
  };

  const resetHtml = () => {
    setHtml("");
    setIsSelectFile(false);
  };

  return (
    <div className="flex h-full items-center justify-center py-2">
      {loading ? (
        <div>Loading...</div>
      ) : isSelectFile ? (
        <div className="flex h-full flex-col gap-y-8">
          <header className="flex justify-end">
            <button
              className="rounded border px-2 hover:text-blue-800"
              onClick={resetHtml}
            >
              reset
            </button>
          </header>
          <main
            className="markdown-body flex-1 overflow-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      ) : (
        <input type="file" onChange={handleSelectFile} />
      )}
    </div>
  );
}
