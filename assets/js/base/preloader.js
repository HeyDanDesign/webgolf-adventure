import { TextureLoader, RepeatWrapping, PlaneGeometry, ShaderMaterial, Mesh, Vector3 } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'
import { useCamera } from '@base/camera'
import { useAllTextures } from '@base/loaders'

import vertexShader from '@shaders/preloader/vertex.glsl'
import fragmentShader from '@shaders/preloader/fragment.glsl'

let scene = null
let mesh = null
let geo = null
let mat = null

export const createPreloader = () => {
  scene = useScene()
  const camera = useCamera()
  const textures = useAllTextures()

  geo = new PlaneGeometry(50, 40)

  const texture1 = textures.get('clouds1')
  texture1.wrapS = texture1.wrapT = RepeatWrapping

  mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      influence: { value: 0 },
      brightness: { value: 2 },
      map: { value: texture1 }
    }
  })
  mesh = new Mesh(geo, mat)
  mesh.name = 'preloader'

  mesh.position.copy(camera.position)
  mesh.position.add(new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).multiplyScalar(3))
  mesh.rotation.copy(camera.rotation)

  scene.add(mesh)
}

export const hidePreloader = () => {
  gsap.to(mat.uniforms.influence, { duration: 1, value: 1, ease: 'none' })
  gsap.to(mat.uniforms.brightness, {
    duration: 1,
    value: 0,
    ease: 'none',
    onComplete: () => {
      scene.remove(mesh)
      mesh = null
    }
  })
}

export const usePreloader = () => mesh
