import type { ConfigFormatOption } from "@/config";

export function getOutputFilename(
  filename: string,
  format: ConfigFormatOption,
): string {
  const name = filename?.replace(/\.[^/.]+$/, "") ?? "";
  const newFilename = `${name}.${format.ext}`;

  return filename !== newFilename ? newFilename : `${name}_1.${format.ext}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop() ?? "";
}

export function isFileType(file: File, mimetype: string): boolean {
  const types = mimetype?.split(",").map((t) => t.trim().replace("*", "")) ?? [
    "",
  ];
  return types.some((type) => file?.type?.startsWith(type) ?? false);
}

export function isMaxFileSizeMb(file: File, maxSizeMb: number): boolean {
  return file?.size <= maxSizeMb * 1024 * 1024;
}

export function readJsonFile<T = any>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

export async function saveJsonAsFile(
  data: {},
  filename: string,
  type = "application/json",
): Promise<void> {
  const blob = new Blob([JSON.stringify(data)], { type });
  await saveFileAs(blob, filename, type);
}

export async function saveFileAs(
  data: Blob,
  filename: string,
  type: string,
): Promise<void> {
  const extension = "." + getFileExtension(filename);
  // @ts-expect-error - api still experimental
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: filename,
    types: [
      {
        accept: { [type]: [extension] },
      },
    ],
  });
  await writeFile(fileHandle, data);
}

async function writeFile(
  fileHandle: FileSystemFileHandle,
  data: Blob,
): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export async function saveAllFiles(
  files: { data: Blob; filename: string }[],
  directoryId: string,
): Promise<void> {
  const directoryHandle: FileSystemDirectoryHandle =
    // @ts-expect-error - api still experimental
    await window.showDirectoryPicker({
      id: directoryId,
      mode: "readwrite",
      startIn: "downloads",
    });

  const filesInDirectory: string[] = [];
  // @ts-expect-error - api still experimental
  for await (const key of directoryHandle.keys()) {
    filesInDirectory.push(key);
  }

  await Promise.all(
    files.map(async (file) => {
      //increment filename if alreadyd exists
      const extension = getFileExtension(file.filename);
      const filename = file.filename.replace(/\.[^/.]+$/, "");
      let newFilename = file.filename;
      let increment = 1;

      while (filesInDirectory.includes(newFilename)) {
        newFilename = `${filename}_${increment}.${extension}`;
        increment++;
      }

      const fileHandle = await directoryHandle.getFileHandle(newFilename, {
        create: true,
      });
      await writeFile(fileHandle, file.data);
    }),
  );
}

export function trackDownloadProgress(
  response: Response,
  reportProgress: (loadedBytes: number, fileSize: number, url: string) => void,
  reportDone: (url: string) => void,
): void {
  const contentLength = response.headers.get("content-length") ?? "0";
  const totalBytes = parseInt(contentLength, 10);
  let loadedBytes = 0;

  const reader = response.body?.getReader();
  if (!reader) return;

  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        reportDone(response.url);
        return;
      }

      if (value) {
        loadedBytes += value.length;
        reportProgress(loadedBytes, totalBytes, response.url);
      }

      read();
    });
  };

  read();
}
