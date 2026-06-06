<template>
  <button
    class="baseBtn w-280 h-80 bg-white text-white text-40 relative rounded-20 group transition-transform hover:-rotate-1 active:scale-[97%] l:w-200 l:h-64 s:h-48 s:w-160 s:rounded-12"
    @mouseenter="playSoundUiHover"
    @click="playSoundUiClick">

    <BaseText :fontSize="fontSize" :strokeWidth="strokeWidth" class="relative z-4 transition-transform group-hover:scale-105  group-hover:rotate-1 group-active:scale-[108%]">
      <slot />
    </BaseText>

    <div :class="colorStyles" class="absolute inset-0 z-2 bg-gradient-to-b rounded-16 transition-opacity group-hover:opacity-80 group-active:opacity-90 s:rounded-8" />
    <div class="absolute -inset-4 z-1 bg-stone-500 rounded-20 opacity-10 group-hover:scale-x-95 group-hover:scale-y-90 transition-transform s:rounded-12" />

    <div class="absolute left-24 right-24 h-16 rounded-1/2 bg-white z-5 top-8 blur-[6px] l:h-12" />

  </button>
</template>

<script setup>
import { playSoundUiHover, playSoundUiClick } from '@game/sounds'

const props = defineProps({
  color: {
    type: String,
    default: ''
  }
})

const colorStyles = computed(() => {
  if (props.color === 'yellow') return 'from-fire-100 to-fire-200'
  else return 'from-sky-100 to-sky-200'
})

const fontSize = ref(40)
const strokeWidth = ref(4)

const updateFontSizes = () => {
  if (innerWidth > 960) {
    fontSize.value = 40
    strokeWidth.value = 4
  } else if (innerWidth > 600 && innerWidth <= 960) {
    fontSize.value = 28
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
  updateFontSizes()
  window.addEventListener('resize', onResize)
})
</script>

<style lang="scss">
.baseBtn {
  box-shadow: 0 12px 20px rgba(#4EBAFF, 1);

  &::after {
    content: '';
    inset: 0;
    border: 2px solid rgba(#45A0D9, 0.5);
    position: absolute;
    z-index: 4;
    border-radius: 16px;
    mix-blend-mode: multiply;

    @media screen and (max-width: 600px) {
      border-radius: 8px;
    }
  }
}
</style>