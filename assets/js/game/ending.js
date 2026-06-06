import { Group, Mesh, PlaneGeometry, MeshBasicMaterial } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'
import { useAtlas, useAllModels, useAllTextures } from '@base/loaders'

import { useState, showScorecard, updateEndScreen, updateFinalBreakdown } from '@game/state'
import { playSoundUiEnding } from '@game/sounds'

import { resetWater } from '@objects/water/water'

import { removeGround } from '@objects/ground'
import { removeBarriers } from '@objects/barriers'
import { removeAssets } from '@objects/assets'
import { removeCollectible, removeCollectibleParticles } from '@objects/collectible'
import { removeObstacles } from '@objects/obstacles/obstacles'
import { teleportBall } from '@objects/ball/ball'

import { removePhysics } from '@physics/physics'

let state = null
let camera = null
let scene = null
let podiums = []

const groupPositions = [
  { x: -4, y: -1, z: -4 },
  { x: -1, y: -0.5, z: -3 },
  { x: 2, y: 0, z: -2 },
  { x: 3, y: -0.5, z: 1 },
  { x: 4, y: -1, z: 4 }
]

export const createEnding = () => {
  state = useState()
  camera = useCamera()
  scene = useScene()

  updateEndScreen(true)

  //
  removeGround()
  removeBarriers()
  removeAssets()
  removeCollectible()
  removeCollectibleParticles()
  removeObstacles()
  removePhysics()
  teleportBall({ x: 0, y: -10, z: 0 })
  resetWater()
  showScorecard(false, true)

  //
  const zoom = innerWidth > 960 ? 95 : 80
  const zoomAdjustmentFactor = innerWidth > 960 ? innerHeight / 1080 : innerWidth / 1080
  camera.zoom = zoom * zoomAdjustmentFactor

  createFinalScore()
  createEndingGraphics()
  playSoundUiEnding()
}

export const createFinalScore = () => {
  let parTotal = 0
  let scoreTotal = 0
  let collectibleTotal = 0

  const scoreMulti = 10

  let collectibleMulti = 0

  //
  for (let i = 0; i < 5; i++) {
    if (!state.collectibles[i]) continue
    collectibleTotal++
    if (i === 0) collectibleMulti += 1.5
    if (i === 1) collectibleMulti += 2
    if (i === 2) collectibleMulti += 2.5
    if (i === 3) collectibleMulti += 3
    if (i === 4) collectibleMulti += 6
  }

  state.scorecard.forEach((el) => {
    parTotal += el.par
    scoreTotal += el.score
  })

  const startPoints = 100
  const difference = parTotal - scoreTotal
  const scorePoints = difference * scoreMulti + startPoints
  const finalScore = scorePoints * collectibleMulti

  const breakdown = {
    scoreTotal,
    collectibleTotal,
    difference,
    scorePoints,
    collectibleMulti,
    finalScore
  }

  updateFinalBreakdown(breakdown)
}

export const createEndingGraphics = () => {
  const graphicsMat = useAtlas()
  const meshes = useAllModels()
  const textures = useAllTextures()

  for (let i = 0; i < 5; i++) {
    const pos = groupPositions[i]
    const group = new Group()

    //
    const groundGeo = meshes.get('ground_2x2').graphics.geometry
    const groundMesh = new Mesh(groundGeo, graphicsMat)
    groundMesh.receiveShadow = true
    groundMesh.castShadow = true

    //
    const collectibleGeo = meshes.get('coin-' + (i + 1)).graphics.geometry
    const collectibleMesh = new Mesh(collectibleGeo, graphicsMat)
    collectibleMesh.position.set(0, 3.5, 0)
    collectibleMesh.receiveShadow = true
    collectibleMesh.castShadow = true
    collectibleMesh.visible = false

    gsap.to(collectibleMesh.rotation, { duration: 4, y: -Math.PI * 2, ease: 'none', repeat: -1 })

    const base = textures.get(`collectible${i + 1}_base`)
    const alpha = textures.get(`collectible${i + 1}_alpha`)

    //
    const labelGeo = new PlaneGeometry(2, 2)
    const labelMat = new MeshBasicMaterial({
      map: base,
      alphaMap: alpha,
      depthTest: false,
      transparent: true,
      opacity: 0
    })
    const labelMesh = new Mesh(labelGeo, labelMat)
    labelMesh.position.y = 2.5
    labelMesh.rotation.copy(camera.rotation)

    //
    group.position.set(pos.x, -4.2, pos.z)
    group.add(groundMesh, collectibleMesh, labelMesh)
    podiums.push(group)
    scene.add(group)
  }

  animPodiums()
}

export const animPodiums = () => {
  for (let i = 0; i < 5; i++) {
    const collectible = state.collectibles[i]
    const podium = podiums[i]
    let opacity = 0.3

    // reveal obtained collectibles
    if (collectible) {
      podium.children[1].visible = true
      opacity = 1
    }

    let delay = 1.5
    if (i === 1 || i === 3) delay = 1
    if (i === 0 || i === 4) delay = 0.5

    gsap.to(podium.position, { delay, duration: 1, y: groupPositions[i].y })
    gsap.to(podium.children[2].material, { delay: delay + 1.4, duration: 0.7, opacity })
  }
}

export const usePodiums = () => podiums
