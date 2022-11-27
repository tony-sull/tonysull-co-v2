import { defineConfig } from 'astro/config'
import image from '@astrojs/image'
import sitemap from '@astrojs/sitemap'
import webfinger from 'astro-webfinger'

// https://astro.build/config
export default defineConfig({
  site: 'https://tonysull.co',
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    sitemap(),
    webfinger({
      mastodon: {
        instance: 'indieweb.social',
        username: 'tonysull'
      }
    })
  ],
  vite: {
    ssr: {
      external: ['svgo'],
    },
  },
})
