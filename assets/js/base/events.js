import { Vector3, Raycaster, Vector2 } from 'three'
import debounce from 'lodash/debounce'

import { useScene } from '@base/scene'
import { useCamera, resizeCamera } from '@base/camera'
import { resizeRenderer } from '@base/renderer'

import { updatePower, useState } from '@game/state'

import { createLine, updateLine, removeLine } from '@objects/line'
import { hitBall } from '@objects/ball/ball'
import { showBallHelper, hideBallHelper } from '@objects/ball/ballHelper'
import { updateBallDirectionRot, updateBallDirectionScale } from '@objects/ball/ballDirection'

import { usePhysics } from '@physics/physics'
import { resizeWaterFoam } from '../objects/water/waterFoam'

let debug = null
let scene = null
let start = null
let end = null

let onStartListener = null
let onMoveListener = null
let onEndListener = null
let onResizeListener = null

let clientX, clientY, raycaster, mouse

const intersector = (event) => {
  const camera = useCamera()

  if (event.touches?.length > 0) {
    // Touch event
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else if (event.changedTouches?.length > 0) {
    // end event
    clientX = event.changedTouches[0].clientX
    clientY = event.changedTouches[0].clientY
  } else if (event.clientX !== undefined && event.clientY !== undefined) {
    // Mouse event
    clientX = event.clientX
    clientY = event.clientY
  } else {
    // Not a valid event for processing
    return null
  }

  mouse = new Vector2()
  raycaster = new Raycaster()

  // Convert screen coordinates to normalized device coordinates
  mouse.x = (clientX / window.innerWidth) * 2 - 1
  mouse.y = -(clientY / window.innerHeight) * 2 + 1

  // Set the raycaster from the camera and the computed coordinates
  raycaster.setFromCamera(mouse, camera)

  // Intersect all children in the scene (recursive = true)
  const intersects = raycaster.intersectObjects(scene.children, true)

  // Return first object that includes "advert" in its name
  const advertHit = intersects.find((hit) => hit.object.name.includes('advert'))
  if (advertHit) return advertHit

  // Fallback to the dummy plane or similar
  return intersects.find((hit) => hit.object.name === 'dummy') || null
}

const onStart = (event) => {
  // ignore if right click
  if (event.button === 2) return

  // make sure the canvas is the start point
  if (!(event.target instanceof HTMLCanvasElement)) return

  // if user is above 15 strokes, do nothing
  const state = useState()
  if (state.strokes > 15) return

  const hit = intersector(event)
  if (!hit) return

  // Detect advert click
  if (hit.object.name.includes('advert')) {
    window.open('https://hey-dan.com', '_blank')
    // prevent shot logic from continuing
    return
  }

  start = hit
  end = start

  // pin start point of line on canvas
  if (debug.line) createLine(start.point, end.point)

  // expand ball helper
  showBallHelper()
  document.querySelector('.powerGauge__cancelShot').style.opacity = 1
  document.querySelector('.powerGauge__ball').style.opacity = 0.5

  // add move listeners
  window.addEventListener('mousemove', onMoveListener)
  window.addEventListener('touchmove', onMoveListener)
}

const onMove = (event) => {
  // find current cursor point
  end = intersector(event)

  // keep the y axis the same as where it started to avoid desyncing with the cursor
  const endLevel = new Vector3(end.point.x, start.point.y, end.point.z)

  // pin end point of line on canvas
  if (debug.line) updateLine(start.point, endLevel)

  // update power ui
  const strength = Math.min(start.point.distanceTo(end.point) * 0.012, 0.1)
  updatePower(strength)

  // update directional helper rotation
  // Assuming startPoint and endPoint are Vector3 objects
  let directionVector = end.point.clone().sub(start.point)
  let referenceVector = new Vector3(1, 0, 0) // For rotation around Y-axis, comparing with X-axis

  // Normalize vectors to calculate the angle correctly
  directionVector.normalize()
  referenceVector.normalize()

  // Calculate the angle
  let angle = Math.acos(directionVector.dot(referenceVector))

  // Determine the direction of rotation (clockwise or counterclockwise)
  // This might be needed based on how you wish to apply the rotation
  if (directionVector.z > 0) angle = -angle
  updateBallDirectionRot(angle)
  updateBallDirectionScale(1)
}

const onEnd = (event) => {
  if (!start) return

  hideBallHelper()
  document.querySelector('.powerGauge__cancelShot').style.opacity = 0
  document.querySelector('.powerGauge__ball').style.opacity = 1

  updatePower(0)
  updateBallDirectionScale(0)

  // Check end point, if bottom right corner do nothing, else hit ball
  const thresholdX = innerWidth > 600 ? 180 : 140
  const thresholdY = innerHeight > 600 ? 160 : 120

  const rightEdge = innerWidth - clientX <= thresholdX
  const bottomEdge = innerHeight - clientY <= thresholdY

  if (rightEdge && bottomEdge) {
    // do nothing
  } else {
    const physics = usePhysics()
    hitBall(start, end, physics)
  }

  // remove line and reset variables
  if (debug.line) removeLine()
  start = null
  end = null

  // remove move listeners
  window.removeEventListener('mousemove', onMoveListener)
  window.removeEventListener('touchmove', onMoveListener)
}

export const onResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  resizeCamera(width, height)
  resizeRenderer(width, height)
  resizeWaterFoam(width, height)
}

export const createEvents = (d) => {
  debug = d
  scene = useScene()

  onStartListener = (event) => onStart(event)
  onMoveListener = (event) => onMove(event)
  onEndListener = (event) => onEnd(event)
  onResizeListener = debounce(() => onResize(), 500)

  window.addEventListener('mousedown', onStartListener)
  window.addEventListener('mouseup', onEndListener)
  window.addEventListener('touchstart', onStartListener)
  window.addEventListener('touchend', onEndListener)
  window.addEventListener('resize', onResizeListener)
}

export const removeEvents = () => {
  window.removeEventListener('mousedown', onStartListener)
  window.removeEventListener('mouseup', onEndListener)
  window.removeEventListener('touchstart', onStartListener)
  window.removeEventListener('touchend', onEndListener)
  window.removeEventListener('resize', onResizeListener)
}

export const useMouse = () => mouse
export const useRaycaster = () => raycaster
