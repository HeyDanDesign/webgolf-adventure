<template>
  <section class="absolute inset z-2">

    <img ref="logo" class="fixed top-24 x-center w-80 select-none xs:top-16 xs:w-80" src="/svgs/logo.svg" />

    <div class="absolute bottom-16 x-center max-w-600 w-full m:px-8 m:bottom-8">
      <div class="grid grid-cols-3 gap-8">

        <div
          v-for="el, i in columns"
          :key="i"
          :class="'col' + (i + 1)"
          class="flex flex-col h-full rounded-12 bg-gradient-to-b from-sky-200 to-sky-100 justify-center relative translate-y-40 opacity-0">

          <div class="py-24 l:py-16 s:pb-12">
            <div class="h-24 mb-8 l:h-20 s:h-16 xxs:h-14">
              <BaseText :fontSize="labelFontSize" :strokeWidth="labelStrokeWidth">{{ el.label }}</BaseText>
            </div>
            <div class="h-40 l:h-32 s:h-28 xxs:h-24">
              <BaseText :fontSize="scoreFontSize" :strokeWidth="scoreStrokeWidth" dropShadow>{{ el.score }}</BaseText>
            </div>
          </div>

          <div v-if="el.stat" class="border-t border-sky-200 py-12 w-full l:py-8">
            <div class="h-24 l:h-20 s:h-16 xxs:h-14">
              <BaseText :fontSize="labelFontSize" :strokeWidth="labelStrokeWidth">{{ el.stat }}</BaseText>
            </div>
          </div>

          <div class="absolute inset border-2 border-white rounded-12 opacity-50 pointer-events-none z-1" />

        </div>

      </div>

      <div ref="btns" class="grid grid-cols-2 gap-8 mt-8 translate-y-40 opacity-0">
        <BaseBtn color="yellow" class="w-full l:w-full s:w-full" @click="shareToX">Share Score</BaseBtn>
        <BaseBtn class="w-full l:w-full s:w-full" @click="reload">Play Again</BaseBtn>
      </div>

    </div>

  </section>
</template>

<script setup>
import { reloadNuxtApp } from "nuxt/app"
import gsap from 'gsap'

const props = defineProps({
  stats: {
    type: Object,
    default: () => { }
  }
})

const diff = props.stats.difference
const underOrOver = diff > 0 ? 'Under' : 'Over'
let totalStrokes = `${Math.abs(diff)} ${underOrOver} Par`

if (diff === 0) totalStrokes = 'Even Par'

const columns = [
  {
    label: 'Under/Over Score',
    score: Math.max(0, props.stats.scorePoints),
    stat: totalStrokes
  },
  {
    label: 'Collectible Multi',
    score: `+${props.stats.collectibleMulti}x`,
    stat: `${props.stats.collectibleTotal} / 5`
  }, {
    label: 'Final Score',
    score: Math.max(0, props.stats.finalScore),
    stat: ''
  }
]

const logo = ref(null)
const btns = ref(null)

const labelFontSize = computed(() => {
  if (innerWidth > 960) return 24
  if (innerWidth > 600 && innerWidth <= 960) return 20
  if (innerWidth > 400 && innerWidth <= 600) return 16
  else return 14
})

const labelStrokeWidth = computed(() => {
  if (innerWidth > 960) return 3
  else return 2
})

const scoreFontSize = computed(() => {
  if (innerWidth > 960) return 40
  if (innerWidth > 600 && innerWidth <= 960) return 32
  if (innerWidth > 400 && innerWidth <= 600) return 28
  else return 24
})

const scoreStrokeWidth = computed(() => {
  if (innerWidth > 960) return 4
  if (innerWidth > 600 && innerWidth <= 960) return 3
  else return 2
})

const shareToX = () => {
  var url = encodeURIComponent('https://webgolf.hey-dan.com');
  var text = encodeURIComponent(`I found ${props.stats.collectibleTotal}/5 collectibles, got a ${totalStrokes} and completed the #WGLGAtour with a final score of ${props.stats.finalScore}. Can you beat that?`);
  var tweetUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text;
  window.open(tweetUrl, '_blank', 'width=580,height=600');
}

const reload = () => reloadNuxtApp({ path: "/", ttl: 100 });

onMounted(() => {
  gsap.to(['.col1', '.col2', '.col3'], { delay: 2, duration: 0.8, y: 0, opacity: 1, stagger: 0.4 })
  gsap.to(btns.value, { delay: 4, duration: 0.8, y: 0, opacity: 1, stagger: 0.2 })
})
</script>