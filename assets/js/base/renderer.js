import {
  WebGLRenderer,
  SRGBColorSpace,
  PCFSoftShadowMap,
  WebGLRenderTarget,
  RGBAFormat,
  NearestFilter,
  DepthTexture,
  UnsignedShortType,
  DepthFormat
} from 'three'

import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'

import { useWater, useWaterBed } from '@objects/water/water'
import { useDepthMaterial, useWaterFoam } from '@objects/water/waterFoam'
import { useClouds } from '@objects/clouds'
import { useDummy } from '@objects/dummy'
import { useBallHelper } from '@objects/ball/ballHelper'
import { useBallDirection } from '@objects/ball/ballDirection'
import { useParticles } from '@objects/ground'
import { useCollectibleParticles } from '@objects/collectible'
import { usePodiums } from '@game/ending'

let width = null
let height = null
let renderer = null
let renderTarget = null
let pixelRatio = 1

export const createRenderer = (canvas) => {
  width = window.innerWidth
  height = window.innerHeight
  pixelRatio = Math.min(window.devicePixelRatio, 2)

  renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(pixelRatio)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.needsUpdate = true
  renderer.shadowMap.type = PCFSoftShadowMap

  createRenderTarget()
}

export const resizeRenderer = (width, height) => {
  renderer.setSize(width, height)
  renderer.setPixelRatio(pixelRatio)

  renderTarget.setSize(width, height)
}

export const updateRenderer = () => {
  const scene = useScene()
  const camera = useCamera()

  // Render scene to the WebGLRenderTarget first to capture the depth information
  const clouds = useClouds()
  const dummy = useDummy()
  const water = useWater()
  const waterBed = useWaterBed()
  const waterFoam = useWaterFoam()
  const ballHelper = useBallHelper()
  const ballDirection = useBallDirection()
  const particles = useParticles()
  const podiums = usePodiums()
  const collectiblesParticles = useCollectibleParticles()

  if (clouds) clouds.visible = false
  if (dummy) dummy.visible = false
  if (water) water.mesh.visible = false
  if (waterBed) waterBed.visible = false
  if (waterFoam) waterFoam.visible = false
  if (ballHelper) ballHelper.visible = false
  if (ballDirection) ballDirection.visible = false
  if (particles) particles.visible = false
  if (podiums) podiums.forEach((el) => (el.children[2].visible = false))
  if (collectiblesParticles) collectiblesParticles.visible = false

  scene.overrideMaterial = useDepthMaterial()

  renderer.setRenderTarget(renderTarget)
  renderer.render(scene, camera)

  // Then render scene to the canvas
  renderer.setRenderTarget(null) // Set back to default render target (the canvas)
  scene.overrideMaterial = null

  if (clouds) clouds.visible = true
  if (dummy) dummy.visible = true
  if (water) water.mesh.visible = true
  if (waterBed) waterBed.visible = true
  if (waterFoam) waterFoam.visible = true
  if (ballHelper) ballHelper.visible = true
  if (ballDirection) ballDirection.visible = true
  if (particles) particles.visible = true
  if (podiums) podiums.forEach((el) => (el.children[2].visible = true))
  if (collectiblesParticles) collectiblesParticles.visible = true

  renderer.render(scene, camera)
}

const createRenderTarget = () => {
  const newWidth = width * pixelRatio
  const newHeight = height * pixelRatio

  renderTarget = new WebGLRenderTarget(newWidth, newHeight)
  renderTarget.setSize(newWidth, newHeight)
  renderTarget.texture.format = RGBAFormat
  renderTarget.texture.minFilter = NearestFilter
  renderTarget.texture.magFilter = NearestFilter
  renderTarget.texture.generateMipmaps = false
  renderTarget.stencilBuffer = false

  //
  renderTarget.depthTexture = new DepthTexture()
  renderTarget.depthTexture.type = UnsignedShortType
  renderTarget.depthTexture.format = DepthFormat
  renderTarget.depthTexture.minFilter = NearestFilter
  renderTarget.depthTexture.magFilter = NearestFilter
  renderTarget.depthTexture.image.width = newWidth
  renderTarget.depthTexture.image.height = newHeight
  renderTarget.depthTexture.needsUpdate = true
}

export const useRenderer = () => renderer
export const useRenderTarget = () => renderTarget
