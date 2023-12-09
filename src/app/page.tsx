"use client";
import markdownit from "markdown-it";
import type { ChangeEventHandler } from "react";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
import localforage from "localforage";
import { useGitHubInfo } from "@debbl/ahooks";

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

  const { GitHubInfo } = useGitHubInfo(
    "https://github.com/Debbl/reader-markdown",
  );

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
    localforage.removeItem("html");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center py-2">
      {loading ? (
        <div className="loading loading-infinity loading-lg"></div>
      ) : isSelectFile ? (
        <div className="flex h-full w-full flex-col gap-y-2 px-1 md:px-10 lg:px-32 xl:px-64">
          <header className="flex justify-end">
            <button
              className="btn btn-outline btn-info btn-sm"
              onClick={resetHtml}
            >
              reset
            </button>
          </header>

          <main className="w-full flex-1 overflow-auto">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <GitHubInfo className="mb-2 mt-10 h-4" />
          </main>
        </div>
      ) : (
        <input
          type="file"
          accept=".md"
          className="file-input file-input-bordered file-input-info w-full max-w-xs"
          onChange={handleSelectFile}
        />
      )}
    </div>
  );
}
