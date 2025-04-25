/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DWANI_BACKEND_APP_API_URL: string;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }