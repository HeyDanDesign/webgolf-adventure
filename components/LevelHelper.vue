<template>
  <section class="fixed inset z-3">

    <div ref="content" class="w-full max-w-600 rounded-40 p-56 pb-48 bg-gradient-to-b from-sky-200 to-sky-100 absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[100vh] z-2 opacity-0 l:rounded-20 l:p-40 xs:p-24">

      <div class="clip bg-stone-500 h-240 mb-40 xxl:mb-20">

        <video
          v-if="props.state.level === 2"
          :style="{ objectPosition: '50% 18%' }"
          class="clip2 w-full h-full object-cover border-4 border-stone-500 rounded-8"
          muted loop autoplay playsinline>
          <source src="/videos/all-coins.mp4" type="video/mp4">
        </video>
        <video
          v-else-if="props.state.level === 3"
          :style="{ objectPosition: '50% 25%' }"
          class="clip2 w-full h-full object-cover border-4 border-stone-500 rounded-8"
          muted loop autoplay playsinline>
          <source src="/videos/windmill.mp4" type="video/mp4">
        </video>
        <video
          v-else-if="props.state.level === 5"
          class="clip2 w-full h-full object-cover border-4 border-stone-500 rounded-8"
          muted loop autoplay playsinline>
          <source src="/videos/boulders.mp4" type="video/mp4">
        </video>
        <video
          v-else-if="props.state.level === 8"
          class="clip2 w-full h-full object-cover border-4 border-stone-500 rounded-8"
          muted loop autoplay playsinline>
          <source src="/videos/particles.mp4" type="video/mp4">
        </video>

      </div>
      <div :class="contentHeaderSize + ' h-32 mb-12'">
        <BaseText :fontSize="fontSize" :strokeWidth="strokeWidth">{{ contentHeader }}</BaseText>
      </div>
      <p class="text-18 font-baloo font-400 mb-24 text-stone-500/80 [&>strong]:text-stone-500 [&>a]:underline [&>a]:hover:no-underline xxl:text-16 xxl:mb-16" v-html="contentText" />

      <BaseBtn color="yellow" @click="animOut">Play Hole</BaseBtn>

      <div class="absolute inset border-4 border-white rounded-40 opacity-50 pointer-events-none z-1 l:rounded-20" />
    </div>

    <div ref="overlay" class="fixed inset bg-stone-500/70 backdrop-blur-lg z-1 opacity-0" @click="animOut" />

  </section>
</template>

<script setup>
import gsap from 'gsap'
import { updateShowHelper } from '@game/state'
import { playSoundUiHelper, playSoundWoosh } from 'assets/js/game/sounds';

const props = defineProps({
  state: {
    type: Object,
    default: () => { }
  }
})

const fontWrapperSize = ref('w-[200px]')
const fontSize = ref(40)
const strokeWidth = ref(4)
const content = ref(null)
const overlay = ref(null)

const updateFontSizes = () => {
  if (innerWidth > 1200) {
    fontSize.value = 40
    strokeWidth.value = 4
  } else { // if (innerWidth > 600 && innerWidth <= 1200) {
    fontSize.value = 32
    strokeWidth.value = 3
  }
}

const contentHeaderSize = computed(() => {
  switch (props.state.level) {
    case 2:
      return 'w-[200px] xxl:w-[156px]'
    case 3:
      return 'w-[166px] xxl:w-[130px]'
    case 5:
      return 'w-[140px] xxl:w-120'
    case 8:
      return 'w-240 xxl:w-[190px]'
  }
})

const contentHeader = computed(() => {
  switch (props.state.level) {
    case 2:
      return 'Collectibles'
    case 3:
      return 'Obstacles'
    case 5:
      return 'Boulders'
    case 8:
      return 'The Final Hole'
  }
})

const contentText = computed(() => {
  switch (props.state.level) {
    case 2:
      return 'This level contains a Collectible. Once you have collected one, it will stay with you until the end of the hole (even if you fall into the water). The Collectible will only be removed if you reset to the starting position.'
    case 3:
      return 'Let\'s up the difficulty a bit. From this point forth, obstacles will obstruct your path.'
    case 5:
      return 'A nearby volcano has erupted firing out incredibly hot lava boulders. Avoid colliding with one of these or your golf ball will disintegrate and send you back to the starting position.'
    case 8:
      return 'Congratulations! You have made it to the final hole. Well done for coming this far and thank you for playing. This final hole is a <strong>par 3</strong>. Good luck!'
  }
})

const onResize = () => {
  updateFontSizes()
}

const animIn = () => {
  gsap.to(overlay.value, { duration: 0.8, opacity: 1, ease: 'power1.inOut' })
  gsap.to(content.value, { delay: 0.7, duration: 1, y: '-50%', opacity: 1, ease: 'expo.out', onStart: () => playSoundUiHelper() })
}

const animOut = () => {
  switch (props.state.level) {
    case 2:
      sessionStorage.setItem('helperCollectibleSeen', true)
      break;
    case 3:
      sessionStorage.setItem('helperObstaclesSeen', true)
      break;
    case 5:
      sessionStorage.setItem('helperBouldersSeen', true)
      break;
    case 8:
      sessionStorage.setItem('helperFinalSeen', true)
      break;
  }

  gsap.to(content.value, {
    duration: 1,
    y: innerHeight - (content.value.offsetHeight / 2),
    opacity: 0,
    ease: 'expo.inOut',
    onStart: () => playSoundWoosh()
  })

  gsap.to(overlay.value, {
    delay: 0.5,
    duration: 0.8,
    opacity: 0,
    ease: 'power1.inOut',
    onComplete: () => updateShowHelper(false)
  })
}

onMounted(() => {
  animIn()
  updateFontSizes()
  window.addEventListener('resize', onResize)
})
</script>

<style scoped>
.clip {
  clip-path: polygon(0 5%, 100% 0, 100% 95%, 0% 100%);
}

.clip2 {
  clip-path: polygon(1% 7%, 99% 2%, 99% 93%, 1% 98%);
}
</style>