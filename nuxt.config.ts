import svgLoader from 'vite-svg-loader'
import glsl from 'vite-plugin-glsl'
import wasm from 'vite-plugin-wasm'
import path from 'path'

const meta = {
  siteTitle: 'WebGL Golf Adventure',
  siteName: 'WebGL Golf Adventure',
  siteDescription:
    'A 3D golf game built with Three.js and the Rapier physics engine. Navigate your way through 9 unique holes as quickly as you can and obtain special collectibles throughout the course.',
  socialUrl: 'https://webgolf.hey-dan.com/',
  socialCard: 'https://webgolf.hey-dan.com/images/meta/social-card.jpg',
  socialHandle: '@HeyDanDesign'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: meta.siteTitle,
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
        },
        { hid: 'description', name: 'description', content: meta.siteDescription },
        { name: 'format-detection', content: 'telephone=no' },
        { hid: 'canonical', rel: 'canonical', href: meta.socialUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:site', name: 'twitter:site', content: meta.socialUrl },
        { name: 'twitter:creator', content: meta.socialHandle },
        { hid: 'twitter:image', name: 'twitter:image', content: meta.socialCard },
        { property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: meta.siteTitle },
        { hid: 'og:description', property: 'og:description', content: meta.siteDescription },
        { hid: 'og:url', property: 'og:url', content: meta.socialUrl },
        { property: 'og:site_name', content: meta.siteName },
        { hid: 'og:image', property: 'og:image', content: meta.socialCard }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/svgs/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..500&display=swap'
        }
      ]
    }
  },

  css: ['@/public/extra.css'],

  vite: {
    plugins: [svgLoader(), glsl(), wasm()],
    build: {
      target: 'esnext'
    }
  },

  modules: ['@nuxtjs/tailwindcss'],

  plugins: ['~/plugins/analytics.client.js'],

  alias: {
    '@svgs': path.resolve(__dirname, './assets/svgs'),
    '@base': path.resolve(__dirname, './assets/js/base'),
    '@game': path.resolve(__dirname, './assets/js/game'),
    '@dev': path.resolve(__dirname, './assets/js/dev'),
    '@objects': path.resolve(__dirname, './assets/js/objects'),
    '@physics': path.resolve(__dirname, './assets/js/physics'),
    '@shaders': path.resolve(__dirname, './assets/shaders'),
    '@data': path.resolve(__dirname, './public/data')
  },

  ssr: false,
  spaLoadingTemplate: false
})
