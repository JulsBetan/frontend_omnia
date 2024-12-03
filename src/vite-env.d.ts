/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DEPORTES_URL: string; // Define la URL base de API Deportes
  readonly VITE_APP_TITLE: string;    // Define el título de aplicación
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
