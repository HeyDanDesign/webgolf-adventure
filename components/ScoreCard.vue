<template>
  <section
    :class="[
      { 'pointer-events-none': !props.state.showScorecard },
      { 'overflow-x-hidden overflow-y-auto': props.state.scorecard.length === 9 }
    ]"
    class="fixed inset-0 w-full h-svh z-3">

    <div :class="props.state.showScorecard ? 'translate-y-0' : 'translate-y-[100vh]'" class="w-full min-h-svh grid place-items-center gap-120 pt-160 pb-80 transition-transform duration-1000 delay-150 relative z-2 s:gap-80 s:pt-120">
      <div
        class="w-max relative rounded-40 bg-gradient-to-b from-sky-200 to-sky-100 pt-28 pb-40 pr-56 pl-40 xl:pt-20 xl:pb-24 xl:pl-16 xl:pr-32 xl:rounded-20 s:p-16 s:max-w-[340px]">

        <img class="w-160 absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 z-2" src="/svgs/logo.svg" alt="WebGL Golf Adventure" />

        <div class="flex justify-between xl:pt-16 s:pt-28">
          <div class="h-48 w-160 xl:w-140 xl:-mt-4 s:w-96 s:h-32 s:mt-0">
            <BaseText :fontSize="fs40" :strokeWidth="strokeWidth">Scorecard</BaseText>
          </div>

          <div class="flex gap-4 s:gap-2">
            <BaseCollectible class="xl:size-32" :type="1" :unlocked="props.state.collectibles[0]" />
            <BaseCollectible class="xl:size-32" :type="2" :unlocked="props.state.collectibles[1]" />
            <BaseCollectible class="xl:size-32" :type="3" :unlocked="props.state.collectibles[2]" />
            <BaseCollectible class="xl:size-32" :type="4" :unlocked="props.state.collectibles[3]" />
            <BaseCollectible class="xl:size-32" :type="5" :unlocked="props.state.collectibles[4]" />
          </div>
        </div>

        <div class="flex items-start mt-24 mb-16 xl:mt-16">
          <div class="flex flex-wrap w-120 justify-end gap-24 mt-16 pr-24 xl:pr-16 xl:w-96 s:pr-8 s:w-48">
            <div class="h-32 w-48 xl:w-40 s:w-28">
              <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Hole</BaseText>
            </div>
            <div class="h-32 w-40 ml-12 xl:w-32 s:w-24">
              <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Par</BaseText>
            </div>
            <div class="h-32 w-88 xl:w-64 s:w-56">
              <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Strokes</BaseText>
            </div>
            <div class="h-32 w-96 xl:w-80 s:w-64">
              <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Penalties</BaseText>
            </div>
            <div class="h-32 w-56 xl:w-48 s:w-36">
              <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Score</BaseText>
            </div>
          </div>

          <div>
            <!-- hole -->
            <div class="flex">
              <div v-for="el, i in 9" :class="[{ 'rounded-tl-16': i === 0 }, { 'rounded-tr-16': i === 8 }]" class="w-80 bg-grass-400 border border-stone-500 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32">
                  <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ i + 1 }}</BaseText>
                </div>
              </div>
            </div>

            <!-- par -->
            <div class="flex -mt-1">
              <div v-for="el in holePars" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32">
                  <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ el }}</BaseText>
                </div>
              </div>
            </div>

            <!-- strokes -->
            <div class="flex -mt-1">
              <div v-for="el in props.state.scorecard" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32">
                  <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ el.strokes }}</BaseText>
                </div>
              </div>
              <div v-for="el in (9 - props.state.scorecard.length)" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32" />
              </div>
            </div>

            <!-- penalties -->
            <div class="flex -mt-1">
              <div v-for="el in props.state.scorecard" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32">
                  <BaseText :fontSize="fs32" :strokeWidth="strokeWidth" color="#DF4E14">{{ el.penalties === 0 ? null : el.penalties }}</BaseText>
                </div>
              </div>
              <div v-for="el in (9 - props.state.scorecard.length)" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32" />
              </div>
            </div>

            <!-- score -->
            <div class="flex -mt-1 [&>*:first-child]:rounded-bl-16 bg-white rounded-bl-16">
              <div v-for="el, i in props.state.scorecard" :class="[getScoreDifferenceClass(el.score, i)]" class="w-80 border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32">
                  <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ el.score }}</BaseText>
                </div>
              </div>
              <div v-for="el in (9 - props.state.scorecard.length)" class="w-80 bg-white border border-stone-200 py-12 -mx-1 xl:w-48 s:w-28">
                <div class="h-32" />
              </div>
            </div>
          </div>

          <!-- final stats -->
          <div class="pl-4">
            <div class="w-80 py-[13px] xl:w-48 s:w-28">
              <div class="h-32">
                <BaseText :fontSize="fs24" :strokeWidth="strokeWidth">Out</BaseText>
              </div>
            </div>
            <div class="w-80 bg-fire-100 border border-stone-200 py-12 -mt-1 rounded-tr-16 xl:w-48 s:w-28">
              <div class="h-32">
                <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ parTotal }}</BaseText>
              </div>
            </div>
            <div class="w-80 bg-white border border-stone-200 py-12 -mt-1 xl:w-48 s:w-28">
              <div class="h-32">
                <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ strokeTotal }}</BaseText>
              </div>
            </div>
            <div class="w-80 bg-white border border-stone-200 py-12 -mt-1 xl:w-48 s:w-28">
              <div class="h-32">
                <BaseText :fontSize="fs32" :strokeWidth="strokeWidth" color="#DF4E14">{{ penaltiesTotal }}</BaseText>
              </div>
            </div>
            <div class="w-80 bg-grass-200 border border-stone-200 py-12 -mt-1 rounded-br-16 xl:w-48 s:w-28">
              <div class="h-32">
                <BaseText :fontSize="fs32" :strokeWidth="strokeWidth">{{ scoreTotal }}</BaseText>
              </div>
            </div>
          </div>

        </div>

        <div class="flex justify-center items-center xl:gap-16 s:gap-0 s:flex-wrap">
          <template v-if="props.state.showScorecardBtns">

            <template v-if="props.state.scorecard.length < 9">
              <BaseBtn color="yellow" @click="nextHole">Next Hole</BaseBtn>
            </template>

            <template v-else>
              <BaseBtn color="yellow" @click="createEnding">Finalise Score</BaseBtn>
            </template>
          </template>

          <p v-else class="font-baloo text-14">Scorecard updates at the end of each hole</p>
        </div>

        <div class="absolute inset border-4 border-white rounded-40 opacity-50 pointer-events-none z-1 xl:rounded-20" />
      </div>
    </div>

    <div v-if="!props.state.showScorecardBtns" :class="props.state.showScorecard ? '' : 'opacity-0'" class="fixed top-16 right-16 z-2 transition-opacity duration-500">
      <BaseIconBtn icon="close" @click="closeScorecard" />
    </div>

    <div :class="props.state.showScorecard ? '' : 'opacity-0'" class="fixed inset bg-stone-500/70 backdrop-blur-lg z-1 transition-opacity duration-500" @click="closeScorecard" />

  </section>
</template>

<script setup>
import { showScorecard } from '@game/state'
import { updateGameLevel } from '@game/level'
import { playSoundUiStartBtn, playSoundWoosh } from '@game/sounds'
import { createEnding } from '@game/ending'

import data from '@data/levels'

const props = defineProps({
  state: {
    type: Object,
    default: () => { }
  }
})

const holePars = []
let parTotal = 0

data.levels.forEach((el) => {
  holePars.push(el.par)
  parTotal += el.par
})

const strokeTotal = computed(() => {
  let total = 0
  props.state.scorecard.forEach((el) => {
    total += el.strokes
  })
  return total
})

const penaltiesTotal = computed(() => {
  let total = 0
  props.state.scorecard.forEach((el) => {
    total += el.penalties
  })
  return total
})

const scoreTotal = computed(() => {
  let total = 0
  props.state.scorecard.forEach((el) => {
    total += el.score
  })
  return total
})

const closeScorecard = () => {
  if (props.state.showScorecardBtns) return
  showScorecard(false)
}

const fs40 = ref(40)
const fs32 = ref(32)
const fs24 = ref(24)
const fs20 = ref(20)
const strokeWidth = ref(3)

const updateFontSizes = () => {
  if (innerWidth > 1080) {
    fs40.value = 40
    fs32.value = 32
    fs24.value = 24
    fs20.value = 20
    strokeWidth.value = 3
  } else if (innerWidth > 600 && innerWidth <= 1080) {
    fs40.value = 32
    fs32.value = 24
    fs24.value = 20
    fs20.value = 20
    strokeWidth.value = 3
  } else {
    fs40.value = 24
    fs32.value = 20
    fs24.value = 16
    fs20.value = 16
    strokeWidth.value = 2
  }
}

const getScoreDifferenceClass = (score, index) => {
  const par = holePars[index]
  const diff = score - par

  if (diff === 0) return 'bg-white'
  if (diff === 1) return 'bg-fire-400/10'
  if (diff === 2) return 'bg-fire-400/20'
  if (diff >= 3) return 'bg-fire-400/30'
  if (diff === -1) return 'bg-grass-300/10'
  if (diff === -2) return 'bg-grass-300/20'
  return 'bg-grass-300/30'
}


const onResize = () => {
  updateFontSizes()
}

const nextHole = () => {
  updateGameLevel(false)
  playSoundUiStartBtn()
}

watch(() => props.state.showScorecard, (show) => {
  if (show) setTimeout(() => playSoundWoosh(), 300)
  else setTimeout(() => playSoundWoosh(), 100)
})

onMounted(() => {
  updateFontSizes()
  window.addEventListener('resize', onResize)
})
</script>