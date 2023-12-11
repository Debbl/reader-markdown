"use client";

import { useGitHubInfo } from "@debbl/ahooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { db } from "~/db";
import { useParserMarkdown } from "~/hooks/useParserMarkdown";

export default function Page() {
  const searchParams = useSearchParams();
  const { html, isLoading, setContent, setIsLoading } = useParserMarkdown();

  const { GitHubInfo } = useGitHubInfo(
    "https://github.com/Debbl/reader-markdown",
  );

  useEffect(() => {
    (async function () {
      const id = searchParams.get("id");
      if (!id) return;

      const content = await db.content.where("id").equals(+id).first();
      if (!content) return;

      setContent(content.content);
      setIsLoading(false);
    })();
  }, [searchParams, setContent, setIsLoading]);

  return (
    <div className="relative flex h-full w-full items-center justify-center py-2">
      {isLoading ? (
        <div className="loading loading-infinity loading-lg"></div>
      ) : (
        <div className="flex h-full w-full flex-col gap-y-2 overflow-auto px-1 md:px-10 lg:px-32 xl:px-64">
          <header className="flex justify-end">
            <Link href="/">
              <button className="btn btn-sm">home</button>
            </Link>
          </header>
          <main className="w-full flex-1 ">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </main>
          <footer>
            <Link href="/" className="text-gray-600 underline">
              cd..
            </Link>
            <GitHubInfo className="mb-2 mt-10 h-4" />
          </footer>
        </div>
      )}
    </div>
  );
}
