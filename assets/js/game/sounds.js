import { updateLoadedAssets, updateSoundActive, useState } from '@game/state'

let uiHover = null
let uiClick = null
let uiStartBtn = null
let uiHelper = null
let uiReset = null
let uiEnding = null

let waves = null
let woosh = null

let ballHit = null
let ballHole = null
let ballWater = null
let ballDisintegrate = null

let collectibleGained = null

export const createSounds = () => {
  if (innerWidth <= 960) return

  // ui hover
  uiHover = new Audio('/sounds/ui_hover.mp3')
  uiHover.volume = 0.15
  uiHover.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiHover.load()

  // ui click
  uiClick = new Audio('/sounds/ui_click.mp3')
  uiClick.volume = 0.15
  uiClick.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiClick.load()

  // ui start btn
  uiStartBtn = new Audio('/sounds/ui_start-btn.mp3')
  uiStartBtn.volume = 0.1
  uiStartBtn.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiStartBtn.load()

  // ui helper
  uiHelper = new Audio('/sounds/ui_helper.mp3')
  uiHelper.volume = 0.15
  uiHelper.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiHelper.load()

  // ui reset
  uiReset = new Audio('/sounds/ui_reset.mp3')
  uiReset.volume = 0.1
  uiReset.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiReset.load()

  // ui ending
  uiEnding = new Audio('/sounds/ui_ending.mp3')
  uiEnding.volume = 0.15
  uiEnding.addEventListener('canplaythrough', () => updateLoadedAssets())
  uiEnding.load()

  // waves
  waves = new Audio('/sounds/waves.mp3')
  waves.volume = 0.5
  waves.loop = true
  waves.addEventListener('canplaythrough', () => updateLoadedAssets())
  waves.load()

  // woosh
  woosh = new Audio('/sounds/woosh.mp3')
  woosh.volume = 0.1
  woosh.addEventListener('canplaythrough', () => updateLoadedAssets())
  woosh.load()

  // ball hit
  ballHit = new Audio('/sounds/ball_hit.wav')
  ballHit.volume = 0.1
  ballHit.addEventListener('canplaythrough', () => updateLoadedAssets())
  ballHit.load()

  // ball hole
  ballHole = new Audio('/sounds/ball_hole.mp3')
  ballHole.volume = 0.15
  ballHole.addEventListener('canplaythrough', () => updateLoadedAssets())
  ballHole.load()

  // ball water
  ballWater = new Audio('/sounds/ball_water.mp3')
  ballWater.volume = 0.1
  ballWater.addEventListener('canplaythrough', () => updateLoadedAssets())
  ballWater.load()

  // ball disintegrate
  ballDisintegrate = new Audio('/sounds/ball_disintegrate.mp3')
  ballDisintegrate.volume = 0.1
  ballDisintegrate.addEventListener('canplaythrough', () => updateLoadedAssets())
  ballDisintegrate.load()

  // collectible gained
  collectibleGained = new Audio('/sounds/collectible_gained.mp3')
  collectibleGained.volume = 0.1
  collectibleGained.addEventListener('canplaythrough', () => updateLoadedAssets())
  collectibleGained.load()
}

export const playSoundUiHover = () => {
  if (!uiHover) return
  uiHover.currentTime = 0
  uiHover.play()
}

export const playSoundUiClick = () => {
  if (!uiClick) return
  uiClick.currentTime = 0
  uiClick.play()
}

export const playSoundUiStartBtn = () => {
  if (!uiStartBtn) return
  uiStartBtn.currentTime = 0
  uiStartBtn.play()
}

export const playSoundUiHelper = () => {
  if (!uiHelper) return
  uiHelper.currentTime = 0
  uiHelper.play()
}

export const playSoundUiReset = () => {
  if (!uiReset) return
  uiReset.currentTime = 0
  uiReset.play()
}

export const playSoundUiEnding = () => {
  if (!uiEnding) return
  uiEnding.currentTime = 0
  uiEnding.play()
}

export const playSoundWaves = () => {
  if (!waves) return
  waves.currentTime = 0
  waves.play()
}

export const playSoundWoosh = () => {
  if (!woosh) return
  woosh.currentTime = 0
  woosh.play()
}

export const playSoundBallHit = () => {
  if (!ballHit) return
  ballHit.currentTime = 0
  ballHit.play()
}

export const playSoundBallHole = () => {
  if (!ballHole) return
  ballHole.currentTime = 0
  ballHole.play()
}

export const playSoundBallWater = () => {
  if (!ballWater) return
  ballWater.currentTime = 0
  ballWater.play()
}

export const playSoundBallDisintegrate = () => {
  if (!ballDisintegrate) return
  ballDisintegrate.currentTime = 0
  ballDisintegrate.play()
}

export const playSoundCollectibleGained = () => {
  if (!collectibleGained) return
  collectibleGained.currentTime = 0
  collectibleGained.play()
}

export const toggleAllSounds = () => {
  updateSoundActive()
  const isSoundActive = useState().soundActive
  const allSounds = [
    uiHover,
    uiClick,
    uiStartBtn,
    uiHelper,
    uiReset,
    uiEnding,
    //
    waves,
    woosh,
    //
    ballHit,
    ballHole,
    ballWater,
    ballDisintegrate,
    //
    collectibleGained
  ]
  allSounds.forEach((el) => (el.muted = !isSoundActive))
}
