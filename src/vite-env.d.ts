/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FFMPEG_CORE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
