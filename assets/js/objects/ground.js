import { MeshStandardMaterial, ShaderMaterial, Mesh, BoxGeometry, PlaneGeometry, AdditiveBlending } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'
import { useAtlas, useAllModels } from '@base/loaders'
import { addPhysics } from '@physics/physics'

import vertexShader from '@shaders/particles/vertex.glsl'
import fragmentShader from '@shaders/particles/fragment.glsl'

let scene = null
let camera = null
let groundMeshes = []
let holeCollider = null
let particles = null

export const createGround = (level) => {
  scene = useScene()
  camera = useCamera()
  const graphicsMat = useAtlas()
  const meshes = useAllModels()
  const offset = level.offset

  level.ground.forEach((el) => {
    // GRAPHICS
    const height = 3
    const graphicsGeo = meshes.get(el.type).graphics.geometry
    const graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
    graphicsMesh.position.set(el.position.x, el.position.y, el.position.z)
    graphicsMesh.receiveShadow = true
    graphicsMesh.castShadow = true

    // PHYSICS
    let physicsGeo = null
    let physicsMesh = null
    physicsGeo = meshes.get(el.type).physics?.geometry || graphicsGeo
    physicsMesh = new Mesh(physicsGeo, graphicsMat)
    physicsMesh.position.set(el.position.x, el.position.y, el.position.z)

    // apply rotation to both graphic and physics if defined
    let rotation = null
    if (el.rotation === -90) rotation = -Math.PI / 2
    if (el.rotation === 90) rotation = Math.PI / 2
    if (el.rotation === 180) rotation = Math.PI
    graphicsMesh.rotation.y = physicsMesh.rotation.y = rotation

    // apply offset to both graphic and physics if defined
    graphicsMesh.position.x = physicsMesh.position.x += offset.x
    graphicsMesh.position.z = physicsMesh.position.z += offset.z

    // add physics
    addPhysics(physicsMesh, 'fixed', null, el.coliderType, {
      width: el.size,
      height: height,
      depth: el.size
    })

    // if el type is a hole, add hole colider
    if (el.type.includes('hole')) {
      // GRAPHICS
      const holeSize = 0.3
      const holeGeo = new BoxGeometry(holeSize, holeSize, holeSize)
      const holeMat = new MeshStandardMaterial({ color: 0x000000 })
      const hole = new Mesh(holeGeo, holeMat)
      hole.name = 'hole'
      hole.position.set(el.position.x, height - holeSize / 2 - 0.3 + el.position.y, el.position.z)
      hole.position.x += offset.x
      hole.position.z += offset.z

      // PARTICLES
      const particlesGeo = new PlaneGeometry(2, 2)
      const particlesMat = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthTest: false,
        transparent: true,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: 0.42 },
          uParticles: { value: 100.0 },
          uOpacity: { value: 0.0 }
        }
      })
      particles = new Mesh(particlesGeo, particlesMat)
      particles.name = 'particles'
      particles.position.set(el.position.x, height - holeSize / 2 - 0.3 + el.position.y, el.position.z)
      particles.position.x += offset.x
      particles.position.y += 1
      particles.position.z += offset.z

      particles.rotation.copy(camera.rotation)

      // PHYSICS
      holeCollider = addPhysics(hole, 'fixed', null, 'cuboid', {
        width: holeSize,
        height: holeSize,
        depth: holeSize,
        sensor: true
      })

      scene.add(hole, particles)
      groundMeshes.push(hole, particles)
    }

    scene.add(graphicsMesh)
    groundMeshes.push(graphicsMesh)
  })
}

export const updateParticles = () => particles.rotation.copy(camera.rotation)
export const playParticles = () => {
  const uTime = particles.material.uniforms.uTime
  const uOpacity = particles.material.uniforms.uOpacity

  gsap.fromTo(uTime, { value: 0 }, { duration: 2, value: 1 })
  gsap.fromTo(uOpacity, { value: 0 }, { duration: 0.6, value: 1 })
}
export const removeGround = () => groundMeshes.forEach((el) => scene.remove(el))

export const useHoleCollider = () => holeCollider?.collider
export const useParticles = () => particles
