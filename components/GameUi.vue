<template>
  <section :class="{ '!opacity-0': props.state.endScreen }" class="fixed inset-0 z-2 pointer-events-none transition-opacity duration-500">

    <img class="fixed top-24 left-24 w-120 select-none xs:top-16 xs:left-16 xs:w-80" src="/svgs/logo.svg" />

    <div class="fixed bottom-24 left-24 flex gap-12 pointer-events-auto select-none xl:gap-8 xs:bottom-16 xs:left-16 t:w-40 t:flex-wrap t:gap-4">
      <BaseIconBtn icon="reset-ball" tooltip="Reset hole" @click="updateGameLevel(true)" />
      <BaseIconBtn icon="rotate-camera" tooltip="Rotate camera" @click="rotateCamera" />
      <BaseIconBtn icon="scorecard" color="green" tooltip="Show scorecard" @click="showScorecard(true, false)" />
      <BaseIconBtn icon="how-to" color="yellow" tooltip="How to play" @click="emit('showTutorial')" />
      <BaseIconBtn :icon="soundIcon" :tooltip="soundTooltip" color="yellow" class="l:hidden" @click="toggleSound" />
    </div>

    <div class="fixed bottom-32 x-center pointer-events-none select-none w-max m:bottom-auto m:top-16 m:!left-auto m:!right-16 m:!translate-x-0">
      <div class="flex gap-4">
        <BaseCollectible :type="1" :unlocked="state.collectibles[0]" class="mt-48 m:mt-0" />
        <BaseCollectible :type="2" :unlocked="state.collectibles[1]" class="mt-24 m:mt-0" />
        <BaseCollectible :type="3" :unlocked="state.collectibles[2]" />
        <BaseCollectible :type="4" :unlocked="state.collectibles[3]" class="mt-24 m:mt-0" />
        <BaseCollectible :type="5" :unlocked="state.collectibles[4]" class="mt-48 m:mt-0" />
      </div>

      <div class="w-120 h-32 absolute x-center -bottom-4 m:!left-auto m:!-right-32 m:-bottom-32 m:!translate-x-0">
        <BaseText :fontSize="fontSize" :strokeWidth="strokeWidth">Hole {{ state.level + 1 }}</BaseText>
      </div>
    </div>

    <PowerGauge />

  </section>
</template>

<script setup>
import { rotateCamera } from '@base/camera'
import { showScorecard } from '@game/state'
import { updateGameLevel } from '@game/level'
import { toggleAllSounds } from 'assets/js/game/sounds';

const emit = defineEmits(['showTutorial'])
const props = defineProps({
  state: {
    type: Object,
    default: () => { }
  }
})

const soundIcon = ref('sound-active')
const soundTooltip = ref('Mute sounds')

const toggleSound = () => {
  if (soundIcon.value === 'sound-active') {
    soundIcon.value = 'sound-inactive'
    soundTooltip.value = 'Unmute sounds'
  } else {
    soundIcon.value = 'sound-active'
    soundTooltip.value = 'Mute sounds'
  }

  toggleAllSounds()
}

const fontSize = computed(() => {
  if (innerWidth > 750) return 24
  else return 20
})

const strokeWidth = computed(() => {
  if (innerWidth > 750) return 3
  else return 2
})
</script>