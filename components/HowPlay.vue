<template>
  <section class="fixed inset z-3">

    <div class="flex items-center w-full h-full relative z-2 pointer-events-none">
      <div ref="comicStrip" class="comicStrip flex flex-wrap gap-12 w-600 h-full bg-gradient-to-b from-sky-200 to-sky-100 p-16 z-2 -translate-x-full l:hidden">
        <video class="w-full h-[30%] object-cover border-4 border-stone-500 rounded-8" muted loop autoplay playsinline>
          <source src="/videos/level.mp4" type="video/mp4">
        </video>

        <video class="w-[calc(60%-12px)] h-[calc(40%-24px)] object-cover border-4 border-stone-500 rounded-8" muted loop autoplay playsinline>
          <source src="/videos/windmill.mp4" type="video/mp4">
        </video>

        <video class="w-[40%] h-[calc(40%-24px)] object-cover border-4 border-stone-500 rounded-8" muted loop autoplay playsinline>
          <source src="/videos/all-coins.mp4" type="video/mp4">
        </video>

        <video class="w-[40%] h-[30%] object-cover border-4 border-stone-500 rounded-8" muted loop autoplay playsinline>
          <source src="/videos/boulders.mp4" type="video/mp4">
        </video>

        <video class="w-[calc(60%-12px)] h-[30%] object-cover border-4 border-stone-500 rounded-8" muted loop autoplay playsinline>
          <source src="/videos/particles.mp4" type="video/mp4">
        </video>
      </div>

      <div ref="content" class="px-120 -translate-x-40 opacity-0 pointer-events-auto xxl:px-80 l:px-56 l:text-center l:mx-auto xs:px-32">
        <div class="w-[416px] h-32 mb-16 xxl:w-360 l:mx-auto s:w-240">
          <BaseText :fontSize="fontSize" :strokeWidth="strokeWidth">Welcome to the WGA Tour</BaseText>
        </div>
        <div class="text-20 font-baloo font-400 mb-32 max-w-520 xxl:text-16">
          <p class="text-white/70 my-8 [&>strong]:text-white">Putt the ball into each hole with as few strokes and penalties as possible. Navigate your way through <strong>9 unique holes</strong> and obtain the <strong>special collectibles</strong> along the way to multiply your final score.</p>
          <p class="text-white/70 my-8 [&>strong]:text-white"><strong>How to play:</strong> click/tap and drag anywhere to adjust the power and direction of your shot. Release to putt the ball. To cancel a shot, move your finger/cursor to the bottom right corner of your screen.</p>
        </div>
        <BaseBtn class="w-400 l:!w-280 s:!w-240" @click="animOut">Ready? Set. Putt!</BaseBtn>
      </div>
    </div>

    <p ref="credit" class="fixed bottom-28 right-40 text-20 w-max font-baloo font-400 text-white/80 opacity-0 z-2 xxl:text-16 l:right-1/2 l:translate-x-1/2">
      Made By <a class="font-500 text-white hover:underline" href="https://hey-dan.com" target="_blank">Dan Heywood</a>
    </p>

    <div ref="overlay" class="fixed inset bg-stone-500/70 z-1 opacity-0" @click="animOut" />

  </section>
</template>

<script setup>
import { playSoundUiHelper, playSoundWoosh } from 'assets/js/game/sounds';
import gsap from 'gsap'

const emit = defineEmits(['complete'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const comicStrip = ref(null)
const content = ref(null)
const overlay = ref(null)
const credit = ref(null)

const animIn = () => {
  gsap.to(overlay.value, { duration: 0.8, opacity: 1, ease: 'power1.inOut' })
  gsap.to(comicStrip.value, { delay: 0.3, duration: 1, x: 0, ease: 'expo.out', onStart: () => playSoundWoosh() })
  gsap.to(content.value, { delay: 0.7, duration: 1, x: 0, opacity: 1, ease: 'expo.out' })
  gsap.to(credit.value, { delay: 1, duration: 1, opacity: 1, ease: 'expo.out' })
}

const animOut = () => {
  gsap.to(credit.value, { duration: 1, opacity: 0, ease: 'expo.inOut' })
  gsap.to(content.value, { duration: 1, x: -80, opacity: 0, ease: 'expo.inOut' })
  gsap.to(comicStrip.value, {
    duration: 1, x: "-100%", ease: 'expo.inOut', onStart: () => setTimeout(() => playSoundWoosh(), 100)
  })
  gsap.to(overlay.value, { delay: 0.5, duration: 0.8, opacity: 0, ease: 'power1.inOut', onComplete: () => emit('complete') })

  sessionStorage.setItem('tutorialSeen', true)
}

const fontSize = ref(40)
const strokeWidth = ref(4)

const updateFontSizes = () => {
  if (innerWidth > 1200) {
    fontSize.value = 40
    strokeWidth.value = 4
  } else if (innerWidth > 600 && innerWidth <= 1200) {
    fontSize.value = 32
    strokeWidth.value = 3
  } else {
    fontSize.value = 24
    strokeWidth.value = 3
  }
}

const onResize = () => {
  updateFontSizes()
}

onMounted(() => {
  animIn()
  updateFontSizes()
  window.addEventListener('resize', onResize)
})
</script>
