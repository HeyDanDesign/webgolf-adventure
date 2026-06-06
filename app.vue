<template>
  <div class="w-full h-full fixed overflow-hidden select-none">

    <PreLoader v-if="showPreloader" :total="state.totalAssets" :loaded="state.loadedAssets" @complete="removePreloader" />
    <HowPlay v-if="showTutorial" @complete="removeTutorial" />
    <GameUi :state="state" :class="{ 'opacity-0': !showGameUi }" @show-tutorial="openTutorial" />
    <ScoreCard :state="state" />
    <LevelHelper v-if="state.showHelper" :state="state" />
    <BaseTerms />
    <FinalBreakdown v-if="state.finalBreakdown" :stats="state.finalBreakdown" />

    <canvas ref="canvas" class="fixed inset-0" />
  </div>
</template>

<script setup>
// game
import { createState } from '@game/state'
import { createLevel } from '@game/level'
import { createSounds } from '@game/sounds'

// base
import { loadAllModels, loadAllTextures } from '@base/loaders'
import { createScene } from '@base/scene'
import { createCamera } from '@base/camera'
import { createLights } from '@base/lights'
import { createRenderer } from '@base/renderer'
import { createPhysics } from '@physics/physics'
import { createTick } from '@base/tick'
import { createEvents } from '@base/events'

// dev
import { createGui } from '@dev/gui'
import { createControls } from '@dev/controls'
import { createStats } from '@dev/stats'

const debug = {
  controls: false,
  gui: false,
  stats: false,
  line: false,
  wireframes: false
}

const showPreloader = ref(true)
const showTutorial = ref(false)
const showGameUi = ref(false)

const canvas = ref(null)
let state = createState()

const removePreloader = () => {
  showPreloader.value = false

  if (!sessionStorage.getItem('tutorialSeen')) {
    showTutorial.value = true
  } else {
    showGameUi.value = true
  }
}

const removeTutorial = () => {
  showTutorial.value = false
  showGameUi.value = true
}

const openTutorial = () => showTutorial.value = true

onMounted(async () => {
  // create base
  await loadAllTextures()

  createScene()
  createCamera(debug)
  createLights()
  createRenderer(canvas.value)
  createEvents(debug)
  createSounds()
  createTick()

  await loadAllModels()

  createPhysics(debug)

  // dev
  if (debug.stats) createStats()
  if (debug.controls) createControls(canvas.value)
  if (debug.gui) createGui()

  // create first level
  createLevel()
})
</script>