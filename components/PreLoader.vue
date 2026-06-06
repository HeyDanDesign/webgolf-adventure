<template>
  <section class="preLoader absolute z-9 inset bg-[#4da8e4]" ref="root">

    <div class="absolute w-full h-full inset" ref="loader">
      <div class="preLoader__loader size-120 rounded-full absolute xy-center">
        <img class="preLoader__ball size-80 absolute xy-center z-2" src="/images/golf-ball.png" />
        <img class="preLoader__spinner relative z-1" src="/images/spinner.png" />
      </div>

      <div class="absolute x-center bottom-0">
        <BaseText :fontSize="64" dropShadow>
          {{ Math.min(Math.round((props.loaded / props.total) * 100), 100) }}%
        </BaseText>
      </div>
    </div>

    <div class="absolute w-full h-full inset flex flex-col items-center opacity-0 pt-[12vh] scale-90" ref="intro">
      <LogoAnim :pauseAnim="logoPauseAnim" class="w-400 mb-40 s:w-320 s:mb-24 t:w-280" />
      <div ref="playBtn" class="opacity-0 translate-y-40">
        <BaseBtn @click="begin">Play Game</BaseBtn>
      </div>
    </div>

    <img
      class="absolute max-w-none w-full max-h-480 bottom-0 x-center object-cover object-top -z-1 m:w-[250%]"
      :style="{ maskImage: 'linear-gradient(to top, black 95%, transparent)' }"
      src="/images/preloader.webp"
      alt="" />

  </section>
</template>

<script setup>
import gsap from 'gsap'
import { playSoundUiStartBtn, playSoundWaves } from 'assets/js/game/sounds';

const root = ref(null)
const loader = ref(null)
const intro = ref(null)

const logoPauseAnim = ref(true)
const playBtn = ref(null)

const emit = defineEmits(['complete'])
const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  loaded: {
    type: Number,
    default: 0
  }
})

const transition = () => {
  const tl = gsap.timeline({
    delay: 0.5
  })

  tl.to(loader.value, { duration: 1, autoAlpha: 0 })
  tl.to(intro.value, { duration: 2, autoAlpha: 1, scale: 1, onStart: () => logoPauseAnim.value = false })
  tl.to(playBtn.value, { duration: 0.7, autoAlpha: 1, y: 0, ease: 'power2.inOut' }, '-=0.7')
}

watch(() => props.loaded, (loaded) => {
  if (loaded === props.total) transition()
})

const begin = () => {
  playSoundUiStartBtn()
  playSoundWaves()
  gsap.to(root.value, {
    delay: 0.5, duration: 2, scale: 1.2, autoAlpha: 0, ease: 'power2.inOut', onComplete: () => emit('complete')
  })
}
</script>

<style lang="scss">
@keyframes preLoaderBall {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@keyframes preLoaderSpinner {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.preLoader {
  &__ball {
    animation: preLoaderBall 1s infinite linear;
  }

  &__spinner {
    animation: preLoaderSpinner 1s infinite linear;
  }
}
</style>