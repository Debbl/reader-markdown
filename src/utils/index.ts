function readeFileContent(file: File) {
  return new Promise<string | ArrayBuffer | null | undefined>(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        resolve(ev.target?.result);
      };

      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsText(file);
    },
  );
}

export { readeFileContent };
