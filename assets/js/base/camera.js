import { OrthographicCamera, Quaternion, Vector3, AxesHelper } from 'three'
import gsap from 'gsap'

import { useState } from '@game/state'
import { useScene } from '@base/scene'

import data from '@data/levels'
import { updateParticles } from '../objects/ground'
import { playSoundWoosh } from '../game/sounds'
import { updateCollectibleParticles } from '../objects/collectible'

let debug = null
let camera = null
let cameraRotating = false

const iso = 25
const yOffset = 2

export const createCamera = (d) => {
  debug = d
  const scene = useScene()
  const width = window.innerWidth
  const height = window.innerHeight

  // settings
  camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.01, 1000)
  updateCamera()

  if (debug.wireframes) {
    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)
  }

  // add to scene
  scene.add(camera)
}

export const updateCamera = () => {
  const state = useState()
  const level = data.levels[state.level]
  const zoom = innerWidth > 960 ? level.camera.zoom.desktop : level.camera.zoom.mobile
  const zoomAdjustmentFactor = innerWidth > 960 ? innerHeight / 1080 : innerWidth / 1080
  // initial isometric setup
  camera.position.set(-iso, iso, iso)
  camera.lookAt(0, 0, 0)
  camera.position.y += yOffset
  camera.zoom = zoom * zoomAdjustmentFactor

  // update projection matrix
  updateCameraMatrix()
}

export const updateCameraMatrix = () => {
  camera.updateProjectionMatrix()
}

export const resizeCamera = (width, height) => {
  camera.left = width / -2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = height / -2

  updateCamera()
}

export const rotateCamera = () => {
  if (cameraRotating) return

  cameraRotating = true

  // define a quaternion for a -90-degree rotation around the Y-axis
  const quaternion90Deg = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2)

  // calculate the new quaternion for the camera
  const newQuaternion = camera.quaternion.clone().multiply(quaternion90Deg)

  // calculate the new position considering the initial offset
  let distance = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
  let currentYRotation = Math.atan2(camera.position.z, camera.position.x)
  let newYRotation = currentYRotation - Math.PI / 2
  let newX = distance * Math.cos(newYRotation)
  let newZ = distance * Math.sin(newYRotation)

  // animation duration
  const duration = 0.7

  playSoundWoosh()

  // animate quaternion
  gsap.to(camera.quaternion, {
    delay: 0.1,
    x: newQuaternion.x,
    y: newQuaternion.y,
    z: newQuaternion.z,
    w: newQuaternion.w,
    duration,
    ease: 'power2.out'
  })

  // animate position
  gsap.to(camera.position, {
    delay: 0.1,
    x: newX,
    z: newZ,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      camera.lookAt(0, yOffset, 0)
      updateParticles()
      updateCollectibleParticles()
    },
    onComplete: () => (cameraRotating = false)
  })
}

export const transitionCamera = () => {
  const currentZoom = camera.zoom
  gsap.to(camera, { duration: 3, zoom: currentZoom - 10, ease: 'power2.out' })
}

export const useCamera = () => camera
