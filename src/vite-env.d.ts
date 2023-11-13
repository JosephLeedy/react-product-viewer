/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MAGENTO_BASE_URL: string
    readonly VITE_MAGENTO_IMAGE_URL: string
    readonly VITE_MAGENTO_PLACEHOLDER_IMAGE_URL: string
    readonly VITE_MAGENTO_URI_SUFFIX: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
