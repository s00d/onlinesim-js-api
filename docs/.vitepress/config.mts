import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'OnlineSim API',
  description: 'Documentation for the OnlineSim API',
  lastUpdated: true,
  cleanUrls: true,
  base: process.env.NODE_ENV === 'production' ? '/onlinesim-js-api/' : '/',

  themeConfig: {
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'API',
        items: [
          { text: 'GetFree', link: '/api/GetFree' },
          { text: 'GetNumbers', link: '/api/GetNumbers' },
          { text: 'GetProxy', link: '/api/GetProxy' },
          { text: 'GetRent', link: '/api/GetRent' },
          { text: 'GetUser', link: '/api/GetUser' },
        ],
      },
    ],

    editLink: {
      pattern: 'https://github.com/s00d/onlinesim-js-api/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
    },

    sidebar: {
      '/api/': [
        {
          text: 'API',
          base: '/api',
          items: [
            { text: 'GetFree', link: '/GetFree' },
            { text: 'GetNumbers', link: '/GetNumbers' },
            { text: 'GetOnlineProxy', link: '/GetOnlineProxy' },
            { text: 'GetProxy', link: '/GetProxy' },
            { text: 'GetRent', link: '/GetRent' },
            { text: 'GetUser', link: '/GetUser' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/s00d/onlinesim-js-api' },
    ],
  },
})
