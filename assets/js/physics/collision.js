import { transitionCamera } from '@base/camera'

import { usePhysicsEvents } from '@physics/physics'

import { useState, updateScorecard, updatePenalties, updateCollectibles, updateLocked } from '@game/state'
import {
  playSoundBallDisintegrate,
  playSoundBallHole,
  playSoundBallWater,
  playSoundCollectibleGained
} from 'assets/js/game/sounds'

import { useBall, teleportBall } from '@objects/ball/ball'
import { useWater } from '@objects/water/water'
import { playParticles, useHoleCollider } from '@objects/ground'
import { useCollectibleCollider, removeCollectible, playCollectibleParticles } from '@objects/collectible'
import { useBoulders } from '@objects/obstacles/boulder'

import data from '@data/levels'

export const updateCollision = () => {
  const state = useState()
  const physicsEvents = usePhysicsEvents()

  const ball = useBall()?.collider.handle
  const water = useWater()?.collider.handle
  const hole = useHoleCollider()?.handle
  const collectibles = useCollectibleCollider()?.handle

  const allBoulders = useBoulders()
  const boulders = []

  if (boulders.length !== allBoulders.length) {
    allBoulders.forEach((el) => {
      boulders.push(el.collider.handle)
    })
  }

  physicsEvents.drainCollisionEvents((handle1, handle2, started) => {
    // Collision between ball and water detected
    if ((handle1 === ball && handle2 === water) || (handle2 === ball && handle1 === water)) {
      if (started) {
        let dropHeight = 6
        let lastPos = state.lastPos
        if (lastPos === null) lastPos = data.levels[state.level].start

        teleportBall({ x: lastPos.x, y: dropHeight, z: lastPos.z })
        updatePenalties()
        playSoundBallWater()
      }
    }

    // Collision between ball and hole detected
    if ((handle1 === ball && handle2 === hole) || (handle2 === ball && handle1 === hole)) {
      if (started) {
        transitionCamera()
        updateScorecard()
        playParticles()
        playSoundBallHole()
        updateLocked(true)
      }
    }

    // Collision between ball and collectible detected
    if ((handle1 === ball && handle2 === collectibles) || (handle2 === ball && handle1 === collectibles)) {
      if (started) {
        const currentLevel = state.level
        let currentCollectible = null

        if (currentLevel === 2) currentCollectible = 0 // level 3
        if (currentLevel === 4) currentCollectible = 1 // level 5
        if (currentLevel === 6) currentCollectible = 2 // level 7
        if (currentLevel === 7) currentCollectible = 3 // level 8
        if (currentLevel === 8) currentCollectible = 4 // level 9

        // we dont remove the collider once its obtained so only call what we need if the user has just collected it
        if (!state.collectibles[currentCollectible]) {
          playSoundCollectibleGained()
          playCollectibleParticles()
          removeCollectible()
          updateCollectibles(currentCollectible, true)
        }
      }
    }

    // Collision between ball and boulder detected
    boulders.forEach((el) => {
      if ((handle1 === ball && handle2 === el) || (handle2 === ball && handle1 === el)) {
        const startPos = data.levels[state.level].start
        teleportBall({ x: startPos.x, y: startPos.y, z: startPos.z })
        playSoundBallDisintegrate()
      }
    })
  })

  // Clear the event queue for the next step
  physicsEvents.clear()
}
