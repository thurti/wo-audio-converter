import type { ConfigFormatOption } from "@/config";
import type { SelectedSettings } from "@/store";

export function generateRandomId(name: string): string {
  return `${name}-${(Math.random() * 10e15).toString(16)}`;
}

export function createFFmegCommandArgs(
  file: File,
  format: ConfigFormatOption,
  settings: SelectedSettings
): string[] {
  if (!file || !format || !settings) return [];

  return [
    "-i",
    file.name,
    ...getSettingsString(settings).split(" "),
    getOutputFilename(file.name, format),
  ];
}

export function getSettingsString(settings: SelectedSettings): string {
  if (!settings) return "";

  return Object.values(settings)
    .reduce((acc, setting) => {
      return `${acc} ${setting.value}`;
    }, "")
    .trim();
}

export function createSettingsFromString(value: string): SelectedSettings {
  if (!value) return {};
  return {
    custom: {
      id: "custom",
      label: "Custom",
      value,
    },
  };
}

export function getOutputFilename(
  filename: string,
  format: ConfigFormatOption
): string {
  const name = filename?.replace(/\.[^/.]+$/, "") ?? "";
  const newFilename = `${name}.${format.id}`;

  return filename !== newFilename ? newFilename : `${name}_1.${format.id}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop();
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

export async function saveFileAs(
  data: Blob,
  filename: string,
  type: string
): Promise<void> {
  const extension = "." + getFileExtension(filename);
  /* @ts-ignore */
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
  data: Blob
): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export async function saveAllFiles(
  files: { data: Blob; filename: string }[],
  directoryId: string
): Promise<void> {
  const directoryHandle = await window.showDirectoryPicker({
    id: directoryId,
    mode: "readwrite",
    startIn: "downloads",
  });

  const filesInDirectory: string[] = [];
  for (const key of directoryHandle.keys()) {
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
    })
  );
}

export async function isServiceWorkerInstalled(): Promise<boolean> {
  return (await getServiceWorker()) !== undefined;
}

export async function getServiceWorker(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration;
    } catch (error) {
      console.warn(`getServiceWorker failed with ${error}`);
    }
  }
}

export async function registerServiceWorker(
  version: string = ""
): Promise<ServiceWorkerRegistration> {
  if ("serviceWorker" in navigator) {
    try {
      const url = version !== "" ? `/sw.js?v=${version}` : "/sw.js";
      const registration = await navigator.serviceWorker.register(url, {
        scope: "/",
        type: "module",
        updateViaCache: "none",
      });

      if (registration.installing) {
        console.log(`Service worker installing ${version}`);
      } else if (registration.waiting) {
        console.log(`Service worker waiting ${version}`);
      } else if (registration.active) {
        console.log(`Service worker active ${version}`);
      }

      return registration;
    } catch (error) {
      console.warn(`Registration ${version} failed with ${error}`);
    }
  }
}

export async function addUrlToCache(url: string, cache: Cache): Promise<void> {
  if ((await cache.match(url)) !== undefined) {
    return Promise.resolve();
  }
  return cache.add(url);
}

export async function preloadFilesToCache(
  files: string[],
  cacheName: string
): Promise<void[]> {
  const cache = await caches.open(cacheName);
  return Promise.all(files.map((file) => addUrlToCache(file, cache)));
}

export async function deleteCachesStartWith(name: string): Promise<boolean[]> {
  const keys = await caches.keys();
  return Promise.all(
    keys
      .filter((cacheName) => cacheName.startsWith(name))
      .map((cacheName) => caches.delete(cacheName))
  );
}

export function isWorkerAllowed(): boolean {
  if (navigator.cookieEnabled === false) return false;
  if (!("serviceWorker" in navigator)) return false;
  return true;
}
