import {
  PlaneGeometry,
  ShaderMaterial,
  MeshStandardMaterial,
  Mesh,
  Vector3,
  TextureLoader,
  RepeatWrapping
} from 'three'
import { ColliderDesc } from '@dimforge/rapier3d'

import { useScene } from '@base/scene'
// import { useRenderTarget } from '@base/renderer'
import { useAllTextures } from '@base/loaders'

import { usePhysics } from '@physics/physics'

import vertexShader from '@shaders/water/vertex.glsl'
import fragmentShader from '@shaders/water/fragment.glsl'

let scene = null
let waterMesh = null
let waterBed = null
let material = null
let collider = null

export const createWater = () => {
  scene = useScene()
  const textures = useAllTextures()

  // GRAPHICS
  // water
  const points = 75
  const geo = new PlaneGeometry(points, points)
  const texture = textures.get('water')
  texture.wrapS = texture.wrapT = RepeatWrapping

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      time: { value: 0 },
      map: { value: texture },
      basecolor: { value: new Vector3(0.0, 0.6, 1.0) },
      foamcolor: { value: new Vector3(0.259, 0.702, 1) }
      // depthTexture: { value: useRenderTarget().depthTexture }
    }
  })
  waterMesh = new Mesh(geo, material)
  waterMesh.name = 'water'
  waterMesh.rotation.x = -Math.PI / 2
  waterMesh.position.y = 0.3

  // floor bed
  const bedGeo = new PlaneGeometry(points, points)
  const bedMat = new MeshStandardMaterial({ color: 0x0099ff })
  waterBed = new Mesh(bedGeo, bedMat)
  waterBed.rotation.x = -Math.PI / 2
  waterBed.receiveShadow = true
  scene.add(waterMesh, waterBed)

  // PHYSICS
  // collider properties
  const waterMeshPos = waterMesh.position
  // for cubiod colliders you need to half the sizes of the geometry
  // however in this case we dont as we want to make sure no matter how hard the ball is hit, it will touch this collider
  const colliderSizes = [points, 1, points]
  const colliderDesc = ColliderDesc.cuboid(...colliderSizes)
    .setTranslation(waterMeshPos.x, -2, waterMeshPos.z)
    .setSensor(true)
  collider = usePhysics().createCollider(colliderDesc)
}

export const resetWater = () => (material.uniforms.time.value = 0)
export const updateWater = () => {
  if (material.uniforms.time.value >= 500) resetWater()
  material.uniforms.time.value += 0.1
}

export const useWater = () => {
  if (waterMesh && collider) return { mesh: waterMesh, collider }
}

export const useWaterBed = () => waterBed
