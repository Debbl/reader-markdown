import { type ChangeEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { readeFileContent } from "~/utils";
import type { Content } from "~/db";
import { db } from "~/db";

export default function Index() {
  const [contentList, setContentList] = useState<Content[]>([]);

  const loadContentList = async () => {
    const list = await db.content.toArray();
    setContentList(list);
  };

  const handleSelectFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = (await readeFileContent(file))?.toString() ?? "";

    await db.content.add({
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        webkitRelativePath: file.webkitRelativePath,
      },
      content,
    });
    await loadContentList();

    e.target.value = "";
  };

  useEffect(() => {
    loadContentList();
  }, []);

  const handleRemove = async (id?: number) => {
    if (!id) return;

    await db.content.delete(id);
    await loadContentList();
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center py-2">
      <div className="flex flex-col gap-y-2">
        {contentList.map((item) => (
          <div
            key={item.id}
            className="flex justify-between hover:text-blue-600"
          >
            <Link href={`/${item.id}`}>
              <span>{`${item.id}. `}</span>
              {item.file.name}
            </Link>

            <button onClick={() => handleRemove(item.id)}>X</button>
          </div>
        ))}

        <div className="mt-10">
          <input
            type="file"
            accept=".md"
            className="file-input file-input-bordered file-input-md w-full max-w-xs"
            onChange={handleSelectFile}
          />
        </div>
      </div>
    </div>
  );
}
