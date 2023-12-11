import type { Table } from "dexie";
import Dexie from "dexie";

export interface Content {
  id?: number;
  file: {
    name: string;
    lastModified: number;
    size: number;
    type: string;
    webkitRelativePath: string;
  };
  content: string;
}

export class ContentDatabase extends Dexie {
  content!: Table<Content>;

  constructor() {
    super("readerMarkdown");
    this.version(1).stores({
      content: "++id, file, content",
    });
  }
}

export const db = new ContentDatabase();
