import { Mesh, PlaneGeometry, ShaderMaterial, Quaternion, Euler, AdditiveBlending } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'
import { useAtlas, useAllModels } from '@base/loaders'
import { addPhysics } from '@physics/physics'

import vertexShader from '@shaders/particles/vertex.glsl'
import fragmentShader from '@shaders/particles/fragment.glsl'

let scene = null
let camera = null
let graphicsMesh = null
let particlesMesh = null
let physicsMesh = null
let collider = null
let rigidBody = null
let time = 0

export const createCollectible = (level) => {
  scene = useScene()
  camera = useCamera()
  const graphicsMat = useAtlas()
  const meshes = useAllModels()
  const offset = level.offset

  level.collectibles.forEach((el) => {
    // GRAPHICS
    const graphicsGeo = meshes.get(el.type).graphics.geometry
    graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
    graphicsMesh.position.set(el.position.x, el.position.y, el.position.z)
    graphicsMesh.receiveShadow = true
    graphicsMesh.castShadow = true

    // PARTICLES
    const particlesGeo = new PlaneGeometry(2, 2)
    const particlesMat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      transparent: true,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        uSeed: { value: 0.42 },
        uParticles: { value: 100.0 },
        uOpacity: { value: 0.0 }
      }
    })
    particlesMesh = new Mesh(particlesGeo, particlesMat)
    particlesMesh.position.set(el.position.x, el.position.y + 0.5, el.position.z)
    particlesMesh.rotation.copy(camera.rotation)

    // PHYSICS
    let physicsGeo = null
    physicsGeo = meshes.get(el.type).physics?.geometry || graphicsGeo
    physicsMesh = new Mesh(physicsGeo, graphicsMat)
    physicsMesh.position.set(el.position.x, el.position.y, el.position.z)

    // apply rotation to both graphic and physics if defined
    let rotation = null
    if (el.rotation === -90) rotation = -Math.PI / 2
    else if (el.rotation === 90) rotation = Math.PI / 2
    else if (el.rotation === 180) rotation = Math.PI
    else rotation = el.rotation
    graphicsMesh.rotation.y = physicsMesh.rotation.y = rotation

    // apply offset to graphics if defined
    graphicsMesh.position.x = particlesMesh.position.x = physicsMesh.position.x += offset.x
    graphicsMesh.position.z = particlesMesh.position.z = physicsMesh.position.z += offset.z

    // add physics
    physicsGeo.computeBoundingBox()
    const bbox = physicsGeo.boundingBox

    const collectiblePhysics = addPhysics(physicsMesh, 'fixed', null, el.coliderType, {
      width: bbox.max.x - bbox.min.x,
      height: bbox.max.y - bbox.min.y,
      depth: bbox.max.z - bbox.min.z,
      activeEvents: true,
      sensor: true
    })

    collider = collectiblePhysics.collider
    rigidBody = collectiblePhysics.rigidBody

    scene.add(graphicsMesh, particlesMesh)
  })
}

export const updateCollectible = () => {
  time -= 0.025
  const quaternion = new Quaternion()
  quaternion.setFromEuler(new Euler(0, time, 0))
  rigidBody.setRotation(quaternion, true)

  const rot = rigidBody.rotation()

  graphicsMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
}

export const updateCollectibleParticles = () => {
  if (particlesMesh) particlesMesh.rotation.copy(camera.rotation)
}

export const playCollectibleParticles = () => {
  const uTime = particlesMesh.material.uniforms.uTime
  const uOpacity = particlesMesh.material.uniforms.uOpacity

  gsap.fromTo(uTime, { value: 0 }, { duration: 2, value: 1 })
  gsap.fromTo(uOpacity, { value: 0 }, { duration: 0.6, value: 1 })
}

export const removeCollectible = () => scene.remove(graphicsMesh)
export const removeCollectibleParticles = () => scene.remove(particlesMesh)

export const useCollectible = () => graphicsMesh
export const useCollectibleParticles = () => particlesMesh
export const useCollectibleCollider = () => collider
