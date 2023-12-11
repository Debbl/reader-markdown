"use client";
import type { ChangeEventHandler } from "react";
import { useGitHubInfo } from "@debbl/ahooks";
import { readeFileContent } from "~/utils";
import { useParserMarkdown } from "~/hooks/useParserMarkdown";

export default function Home() {
  const { html, isLoading, setContent, setIsLoading } = useParserMarkdown();

  const { GitHubInfo } = useGitHubInfo(
    "https://github.com/Debbl/reader-markdown",
  );

  const handleSelectFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    readeFileContent(file).then((_content) => {
      const content = _content?.toString() ?? "";
      setContent(content);
      setIsLoading(false);
    });
  };

  const resetHtml = () => {
    setContent("");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center py-2">
      {isLoading ? (
        <div className="loading loading-infinity loading-lg"></div>
      ) : html ? (
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-1 md:px-10 lg:px-32 xl:px-64">
          <header className="flex justify-end">
            <button
              className="btn btn-outline btn-info btn-sm"
              onClick={resetHtml}
            >
              reset
            </button>
          </header>

          <main className="w-full flex-1 ">
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
