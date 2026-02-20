const APP_NAME = 'josenaldo.github.io'
const APP_TITLE = 'Josenaldo Matos'
const APP_DESCRIPTION = 'Software Developer & Kidney Waster'
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.github.io'
const APP_IMAGE = `${APP_URL}/images/default.jpg`
const APP_IMAGE_OBJECT = {
  url: APP_IMAGE,
  width: 1200,
  height: 630,
}

const SeoConfig = {
  titleTemplate: '%s | Josenaldo Matos',
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  canonical: APP_URL,
  openGraph: {
    url: APP_URL,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    type: 'website',
    locale: 'pt_BR',
    site_name: APP_TITLE,
    images: [
      {
        url: `${APP_URL}/images/default.jpg`,
        width: 1200,
        height: 630,
        alt: APP_TITLE,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@josenaldomatos',
    site: '@josenaldomatos',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    { name: 'application-name', content: APP_NAME },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: APP_NAME },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'msapplication-config', content: '/icons/browserconfig.xml' },
    { name: 'msapplication-TileColor', content: '#9A67EA' },
    { name: 'msapplication-tap-highlight', content: 'no' },
    { name: 'theme-color', content: '#9A67EA' },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/icons/manifest-icon-192.maskable.png',
    },
    {
      rel: 'icon shortcut',
      href: '/icons/manifest-icon-192.maskable.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      href: '/icons/manifest-icon-512.maskable.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/icons/manifest-icon-192.maskable.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
}

const seoConfigModule = {
  SeoConfig,
  APP_NAME,
  APP_TITLE,
  APP_DESCRIPTION,
  APP_URL,
  APP_IMAGE,
  APP_IMAGE_OBJECT,
}

export default seoConfigModule
