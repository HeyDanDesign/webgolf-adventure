import { CircleGeometry, ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'

import vertexShader from '@shaders/ball-helper/vertex.glsl'
import fragmentShader from '@shaders/ball-helper/fragment.glsl'

let mesh = null

export const createBallHelper = (ballPos) => {
  const scene = useScene()

  const geo = new CircleGeometry(0.5, 16)
  const mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0.0 }
    },
    transparent: true,
    depthTest: false
  })
  mesh = new Mesh(geo, mat)
  mesh.scale.set(0, 0, 0)
  mesh.name = 'ballHelper'
  mesh.rotation.x = -Math.PI / 2
  mesh.position.set(ballPos.x, ballPos.y, ballPos.z)

  gsap.to(mesh.rotation, { duration: 1, z: -Math.PI / 2, ease: 'none', repeat: -1 })

  scene.add(mesh)
}

export const updateBallHelper = (pos) => mesh.position.set(pos.x, pos.y, pos.z)
export const showBallHelper = () => gsap.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { duration: 0.3, x: 1, y: 1, z: 1 })
export const hideBallHelper = () => gsap.fromTo(mesh.scale, { x: 1, y: 1, z: 1 }, { duration: 0.2, x: 0, y: 0, z: 0 })

export const useBallHelper = () => mesh
