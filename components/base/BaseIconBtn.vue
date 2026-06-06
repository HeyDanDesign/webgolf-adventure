<template>
  <button
    class="baseIconBtn size-64 bg-white relative rounded-full grid place-content-center group transition-transform active:scale-95 xl:size-56 s:size-40"
    @mouseenter="playSoundUiHover"
    @click="playSoundUiClick">

    <IconResetBall v-if="props.icon === 'reset-ball'" :class="iconStyles" />
    <IconRotateCamera v-else-if="props.icon === 'rotate-camera'" :class="iconStyles" />
    <IconScorecard v-else-if="props.icon === 'scorecard'" :class="iconStyles" />
    <IconHowTo v-else-if="props.icon === 'how-to'" :class="iconStyles" />
    <IconCross v-else-if="props.icon === 'close'" :class="iconStyles" />
    <IconSoundActive v-else-if="props.icon === 'sound-active'" :class="iconStyles" />
    <IconSoundInactive v-else-if="props.icon === 'sound-inactive'" :class="iconStyles" />
    <IconXcom v-else-if="props.icon === 'x-com'" :class="iconStyles" />
    <IconRestart v-else-if="props.icon === 'restart'" :class="iconStyles" />

    <div :class="colorStyles" class="absolute inset-0 z-2 bg-gradient-to-b rounded-full transition-opacity group-hover:opacity-80 group-active:opacity-90" />
    <div class="absolute -inset-4 z-1 bg-stone-500 rounded-full opacity-10 group-hover:scale-x-95 group-hover:scale-y-90 transition-transform" />

    <BaseTooltip v-if="props.tooltip" position="top" class="xxs:hidden">
      {{ props.tooltip }}
    </BaseTooltip>

    <div class="absolute left-12 right-12 h-16 rounded-1/2 bg-white z-5 top-4 blur-[6px]" />

  </button>
</template>

<script setup>
import { playSoundUiHover } from '@game/sounds'
import { playSoundUiClick } from '@game/sounds'

import IconResetBall from '@svgs/icons/reset-ball.svg'
import IconRotateCamera from '@svgs/icons/rotate-camera.svg'
import IconScorecard from '@svgs/icons/scorecard.svg'
import IconHowTo from '@svgs/icons/how-to.svg'
import IconCross from '@svgs/icons/cross.svg'
import IconSoundActive from '@svgs/icons/sound-active.svg'
import IconSoundInactive from '@svgs/icons/sound-inactive.svg'
import IconXcom from '@svgs/icons/x-com.svg'
import IconRestart from '@svgs/icons/restart.svg'

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  tooltip: {
    type: String,
    default: ''
  }
})

const colorStyles = computed(() => {
  if (props.color === 'green') return 'from-grass-100 to-grass-200'
  else if (props.color === 'yellow') return 'from-fire-100 to-fire-200'
  else if (props.color === 'red') return 'from-[#ffb8b8] to-[#fd8484]'
  else return 'from-sky-100 to-sky-200'
})

const iconStyles = 'size-40 relative z-4 transition-transform group-hover:scale-105 group-hover:rotate-2 xl:size-32 s:size-24'
</script>

<style lang="scss">
.baseIconBtn {

  &::after {
    content: '';
    inset: 0;
    border: 2px solid rgba(#45A0D9, 0.5);
    position: absolute;
    z-index: 4;
    border-radius: 64px;
    mix-blend-mode: multiply;
  }
}
</style>