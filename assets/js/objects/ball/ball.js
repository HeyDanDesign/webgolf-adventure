import { MeshStandardMaterial, Mesh, SphereGeometry, Vector3 } from 'three'

import { useScene } from '@base/scene'
import { createBallHelper, updateBallHelper } from '@objects/ball/ballHelper'
import { createBallDirection, updateBallDirectionPos } from '@objects/ball/ballDirection'
import { updateStrokes, useState, updateLastPos, updateScorecard, updateLocked } from '@game/state'
import { playSoundBallHit } from 'assets/js/game/sounds'
import { addPhysics } from '@physics/physics'

import data from '@data/levels'

let mesh = null
let rigidBody = null
let collider = null

let ballMoving = false
let lastPos = { x: 0, y: 0, z: 0 }

export const createBall = (level) => {
  const scene = useScene()
  // GRAPHICS
  // ball
  const radius = 0.1
  const geo = new SphereGeometry(radius, 8, 8)
  const mat = new MeshStandardMaterial({ color: 0xffffff })
  mesh = new Mesh(geo, mat)
  mesh.name = 'ball'
  mesh.position.set(level?.start.x, level?.start.y, level?.start.z)
  mesh.receiveShadow = true
  mesh.castShadow = true

  scene.add(mesh)

  //
  createBallHelper(mesh.position)
  createBallDirection(mesh.position)

  // PHYSICS
  const ballPhysics = addPhysics(
    mesh,
    'dynamic',
    {
      linearDamping: 1.0,
      angularDamping: 1.0,
      ccdEnabled: true
    },
    'ball',
    {
      radius,
      friction: 2.0,
      restitution: 1.2,
      activeEvents: true
    },
    false
  )

  collider = ballPhysics.collider
  rigidBody = ballPhysics.rigidBody
}

export const hitBall = (start, end) => {
  // if start and end point are the same, do nothing
  if (start.point === end.point || ballMoving) return

  //
  playSoundBallHit()

  //
  ballMoving = true

  // calculate the direction vector and normalise
  let direction = new Vector3()
  direction.subVectors(end.point, start.point)
  direction.normalize()

  // convert direction to a normalized vector
  const vector = new Vector3(direction.x, direction.y, direction.z).normalize()

  // calculate the impulse vector
  const strength = Math.min(start.point.distanceTo(end.point) * 0.012, 0.1)
  const impulse = new Vector3(-vector.x * strength, -vector.y * strength, -vector.z * strength)

  // apply the impulse to the ball's rigid rigidBody
  rigidBody.applyImpulse(impulse, true)

  //
  updateStrokes()
  updateLocked(true)
}

export const updateBall = () => {
  const pos = rigidBody.translation()
  const rot = rigidBody.rotation()

  mesh.position.set(pos.x, pos.y, pos.z)
  mesh.rotation.set(rot.x, rot.y, rot.z)

  updateBallHelper(pos)
  updateBallDirectionPos(pos)
  checkBallHasStopped()
}

export const checkBallHasStopped = () => {
  const thresholdVelocity = 2.0 // Threshold for considering the body nearly stopped
  const thresholdPositionChange = 0.01 // Small position change threshold

  // Calculate the current speed and angular velocity magnitude
  const velocity = rigidBody.linvel()
  const angularVelocity = rigidBody.angvel() // Assuming 3D, for 2D you might not need this
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z)
  const angularSpeed = Math.sqrt(
    angularVelocity.x * angularVelocity.x +
      angularVelocity.y * angularVelocity.y +
      angularVelocity.z * angularVelocity.z
  )

  // Get the current position and calculate the change from the previous position
  const currentPosition = rigidBody.translation() // This method name may vary
  const positionChange = Math.sqrt(
    Math.pow(currentPosition.x - lastPos.x, 2) +
      Math.pow(currentPosition.y - lastPos.y, 2) +
      Math.pow(currentPosition.z - lastPos.z, 2)
  )

  // Update the previous position for the next check
  lastPos = {
    x: currentPosition.x,
    y: currentPosition.y,
    z: currentPosition.z
  }

  // Check if both the speed and position change are below their thresholds
  if (
    speed < thresholdVelocity &&
    positionChange < thresholdPositionChange &&
    angularSpeed < thresholdVelocity &&
    ballMoving
  ) {
    ballStopped(lastPos)
    updateLocked(false)
  }
}

const ballStopped = (lastPos) => {
  const state = useState()
  updateLastPos(lastPos)
  ballMoving = false

  if (state.strokes + state.penalties >= state.maxStrokes) {
    updateScorecard()
  }
}

export const resetBall = () => {
  const state = useState()
  teleportBall({ ...data.levels[state.level].start })
  updateStrokes()
}

export const teleportBall = (location) => {
  rigidBody.setTranslation(location, true)
  rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
  rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true)
}

export const useBall = () => {
  if (mesh && rigidBody && collider) return { mesh, rigidBody, collider }
}
