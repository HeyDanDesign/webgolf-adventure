import { PlaneGeometry, ShaderMaterial, Mesh, Vector3, TextureLoader, RepeatWrapping } from 'three'

import { useScene } from '@base/scene'
import { useAllTextures } from '@base/loaders'

import vertexShader from '@shaders/clouds/vertex.glsl'
import fragmentShader from '@shaders/clouds/fragment.glsl'

let mesh = null
let mat = null

export const createClouds = () => {
  const scene = useScene()
  const textures = useAllTextures()

  const points = 75
  const geo = new PlaneGeometry(points, points)
  const texture1 = textures.get('clouds1')
  const texture2 = textures.get('clouds2')
  texture1.wrapS = texture1.wrapT = RepeatWrapping
  texture2.wrapS = texture2.wrapT = RepeatWrapping

  mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      time: { value: 0 },
      map1: { value: texture1 },
      map2: { value: texture2 },
      basecolor: { value: new Vector3(1.0, 1.0, 1.0) },
      foamcolor: { value: new Vector3(1.0, 1.0, 1.0) }
    }
  })
  mesh = new Mesh(geo, mat)
  mesh.name = 'clouds'
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 8

  scene.add(mesh)
}

export const updateClouds = () => {
  mat.uniforms.time.value += 0.0005
}

export const useClouds = () => {
  if (mesh) return mesh
}
