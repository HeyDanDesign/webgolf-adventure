import { updateCamera } from '@base/camera'

import {
  useState,
  showScorecard,
  updateLevel,
  updateLastPos,
  resetStrokes,
  resetPenalties,
  updateShowHelper,
  updateCollectibles,
  updateLocked
} from '@game/state'
import { playSoundUiReset } from '@game/sounds'

import { createWater, resetWater } from '@objects/water/water'
import { createWaterFoam } from '@objects/water/waterFoam'
import { createClouds } from '@objects/clouds'
import { createDummy } from '@objects/dummy'
import { createBall, teleportBall } from '@objects/ball/ball'

import { createGround, removeGround } from '@objects/ground'
import { createBarriers, removeBarriers } from '@objects/barriers'
import { createAssets, removeAssets } from '@objects/assets'
import { createCollectible, removeCollectible, removeCollectibleParticles } from '@objects/collectible'
import { createObstacles, removeObstacles } from '@objects/obstacles/obstacles'

import { removePhysics } from '@physics/physics'

import data from '@data/levels'

export const createLevel = () => {
  const state = useState()
  const level = data.levels[state.level]

  createWater()
  createWaterFoam()
  createClouds()
  createDummy()
  createBall(level)

  //
  createGround(level)
  createBarriers(level)
  createAssets(level)
  createCollectible(level)
  createObstacles(level)
}

export const updateGameLevel = (reset) => {
  const state = useState()

  //
  removeGround()
  removeBarriers()
  removeAssets()
  removeCollectible()
  removeCollectibleParticles()
  removeObstacles()
  removePhysics()

  //
  updateLastPos(null)
  updateLevel(reset ? state.level : state.level + 1)
  if (reset) {
    resetStrokes()
    resetPenalties()

    let collectibleId = null
    if (state.level === 2) collectibleId = 0
    if (state.level === 4) collectibleId = 1
    if (state.level === 6) collectibleId = 2
    if (state.level === 7) collectibleId = 3
    if (state.level === 8) collectibleId = 4

    updateCollectibles(collectibleId, false)
    playSoundUiReset()
  }

  //
  const level = data.levels[state.level]
  updateCamera()

  //
  resetWater()
  createGround(level)
  createBarriers(level)
  createAssets(level)
  createCollectible(level)
  createObstacles(level)

  //
  teleportBall({ ...level.start })
  showScorecard(false, true)
  updateLocked(false)

  //
  if (
    (state.level === 2 && !sessionStorage.getItem('helperCollectibleSeen')) ||
    (state.level === 3 && !sessionStorage.getItem('helperObstaclesSeen')) ||
    (state.level === 5 && !sessionStorage.getItem('helperBouldersSeen')) ||
    (state.level === 8 && !sessionStorage.getItem('helperFinalSeen'))
  ) {
    setTimeout(() => updateShowHelper(true), 1000)
  }
}
