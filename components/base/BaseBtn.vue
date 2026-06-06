<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :target="href && external ? '_blank' : undefined"
    :rel="href && external ? 'noopener' : undefined"
    :class="[sizeStyles, { 'baseBtn--sm': size === 'sm' }]"
    class="baseBtn inline-block bg-white text-white relative group transition-transform hover:-rotate-1 active:scale-[97%]"
    @mouseenter="playSoundUiHover"
    @click="playSoundUiClick">

    <BaseText :fontSize="fontSize" :strokeWidth="strokeWidth" class="relative z-4 transition-transform group-hover:scale-105 group-hover:rotate-1 group-active:scale-[108%]">
      <slot />
    </BaseText>

    <div :class="[colorStyles, overlayRadius]" class="absolute inset-0 z-2 bg-gradient-to-b transition-opacity group-hover:opacity-80 group-active:opacity-90" />
    <div :class="outerStyles" class="absolute z-1 bg-stone-500 opacity-10 group-hover:scale-x-95 group-hover:scale-y-90 transition-transform" />

    <div :class="blurStyles" class="absolute rounded-1/2 bg-white z-5" />

  </component>
</template>

<script setup>
import { playSoundUiHover, playSoundUiClick } from '@game/sounds'

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'lg' // 'lg' | 'sm'
  },
  href: {
    type: String,
    default: ''
  },
  external: {
    type: Boolean,
    default: true
  }
})

const colorStyles = computed(() => {
  if (props.color === 'yellow') return 'from-fire-100 to-fire-200'
  else return 'from-sky-100 to-sky-200'
})

const sizeStyles = computed(() => {
  if (props.size === 'sm') return 'h-40 rounded-12 xs:h-36 xs:rounded-8'
  return 'w-280 h-80 rounded-20 l:w-200 l:h-64 l:rounded-16 s:h-48 s:w-160 s:rounded-12'
})

const overlayRadius = computed(() => {
  if (props.size === 'sm') return 'rounded-8'
  return 'rounded-16 s:rounded-8'
})

const outerStyles = computed(() => {
  if (props.size === 'sm') return '-inset-2 rounded-12 xs:rounded-8'
  return '-inset-4 rounded-20 s:rounded-12'
})

const blurStyles = computed(() => {
  if (props.size === 'sm') return 'left-12 right-12 h-8 top-4 blur-[4px]'
  return 'left-24 right-24 h-16 top-8 blur-[6px] l:h-12'
})

const fontSize = ref(40)
const strokeWidth = ref(4)

const updateFontSizes = () => {
  if (props.size === 'sm') {
    fontSize.value = innerWidth > 600 ? 16 : 14
    strokeWidth.value = 2
    return
  }

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

  &--sm {
    box-shadow: 0 6px 12px rgba(#4EBAFF, 0.9);

    &::after {
      border-radius: 8px;
    }
  }
}
</style>
