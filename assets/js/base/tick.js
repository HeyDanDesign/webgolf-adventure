import { Clock } from 'three'

import { updateCameraMatrix, useCamera } from '@base/camera'
import { updateRenderer, useRenderer } from '@base/renderer'

import { updateControls, useControls } from '@dev/controls'
import { updateStats, useStats } from '@dev/stats'

import { updateWater, useWater } from '@objects/water/water'
import { useWaterFoam, updateWaterFoam } from '@objects/water/waterFoam'
import { updateClouds, useClouds } from '@objects/clouds'
import { updateBall, useBall } from '@objects/ball/ball'
import { updateCollectible, useCollectibleCollider } from '@objects/collectible'

import { updatePhysics, usePhysics } from '@physics/physics'

import { updateBoulder, useBoulder } from '@objects/obstacles/boulder'
// import { updateSpinner, useSpinner } from '@objects/obstacles/spinner'
import { updateWindmill, useWindmill } from '@objects/obstacles/windmill'

const clock = new Clock()

export const createTick = () => {
  const dt = clock.getDelta()
  const et = clock.getElapsedTime()

  // base
  if (useCamera()) updateCameraMatrix()
  if (useRenderer()) updateRenderer()

  // dev
  if (useControls()) updateControls()
  if (useStats()) updateStats()

  // objects
  if (useWater()) updateWater(et)
  if (useWaterFoam()) updateWaterFoam(et)
  if (useClouds()) updateClouds()
  if (useBall()) updateBall(dt)
  if (useCollectibleCollider()) updateCollectible()
  if (useWindmill()) updateWindmill(dt)
  if (useBoulder()) updateBoulder()
  // if (useSpinner()) updateSpinner(dt)

  // physics
  if (usePhysics()) updatePhysics(dt)

  window.requestAnimationFrame(createTick)
}
