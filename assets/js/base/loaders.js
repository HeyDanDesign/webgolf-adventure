import { TextureLoader, MeshStandardMaterial, SRGBColorSpace } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { updateLoadedAssets } from '@game/state'

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/js/libs/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

const textureLoader = new TextureLoader()

//
let atlasMat = null

const allModels = new Map()
const allTextures = new Map()

const modelPaths = [
  // ground
  { name: 'ground_2x2', path: '/models/ground/ground_2x2.glb' },
  { name: 'ground_4x4', path: '/models/ground/ground_4x4.glb' },
  { name: 'ground_8x8', path: '/models/ground/ground_8x8.glb' },
  { name: 'bridge1', path: '/models/ground/bridge1.glb' },
  { name: 'bridge2', path: '/models/ground/bridge2.glb' },
  // sand,
  { name: 'sand_4x4', path: '/models/sand/sand_4x4.glb' },
  // holes
  { name: 'hole_2x2', path: '/models/hole/hole_2x2.glb' },
  { name: 'hole_4x4', path: '/models/hole/hole_4x4.glb' },
  { name: 'hole_8x8', path: '/models/hole/hole_8x8.glb' },
  // ramps
  { name: 'ramp_2x4', path: '/models/ramp/ramp_2x4.glb' },
  { name: 'ramp_4x4', path: '/models/ramp/ramp_4x4.glb' },
  // assets
  { name: 'sign-danger', path: '/models/assets/sign-danger.glb' },
  { name: 'sign-left', path: '/models/assets/sign-left.glb' },
  { name: 'sign-right', path: '/models/assets/sign-right.glb' },
  { name: 'bush-large', path: '/models/assets/bush-large.glb' },
  { name: 'bush-medium', path: '/models/assets/bush-medium.glb' },
  { name: 'bush-small', path: '/models/assets/bush-small.glb' },
  { name: 'tree1', path: '/models/assets/tree1.glb' },
  { name: 'tree2', path: '/models/assets/tree2.glb' },
  { name: 'trunk1', path: '/models/assets/trunk1.glb' },
  { name: 'trunk2', path: '/models/assets/trunk2.glb' },
  { name: 'advert', path: '/models/assets/advert.glb' },
  // obstacles
  { name: 'windmill', path: '/models/obstacles/windmill.glb' },
  { name: 'boulder', path: '/models/obstacles/boulder.glb' },
  { name: 'spinner', path: '/models/obstacles/spinner.glb' },
  // collectibles
  { name: 'coin-1', path: '/models/collectibles/01_w.glb' },
  { name: 'coin-2', path: '/models/collectibles/02_e.glb' },
  { name: 'coin-3', path: '/models/collectibles/03_b.glb' },
  { name: 'coin-4', path: '/models/collectibles/04_g.glb' },
  { name: 'coin-5', path: '/models/collectibles/05_l.glb' }
]

const texturePaths = [
  { name: 'clouds1', path: '/textures/clouds1.jpg' },
  { name: 'clouds2', path: '/textures/clouds2.jpg' },
  { name: 'arrow', path: '/textures/arrow.png' },
  { name: 'water', path: '/textures/water.png' },
  { name: 'foam', path: '/textures/foam.png' },
  // banners
  { name: 'banners', path: '/textures/banners.png' },
  // ending
  { name: 'collectible1_base', path: '/textures/collectible1_base.png' },
  { name: 'collectible1_alpha', path: '/textures/collectible1_alpha.png' },
  { name: 'collectible2_base', path: '/textures/collectible2_base.png' },
  { name: 'collectible2_alpha', path: '/textures/collectible2_alpha.png' },
  { name: 'collectible3_base', path: '/textures/collectible3_base.png' },
  { name: 'collectible3_alpha', path: '/textures/collectible3_alpha.png' },
  { name: 'collectible4_base', path: '/textures/collectible4_base.png' },
  { name: 'collectible4_alpha', path: '/textures/collectible4_alpha.png' },
  { name: 'collectible5_base', path: '/textures/collectible5_base.png' },
  { name: 'collectible5_alpha', path: '/textures/collectible5_alpha.png' }
]

export const loadModel = (url) => {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject)
  })
}

export const loadAllModels = async () => {
  return new Promise((resolve, reject) => {
    try {
      // load atlas material
      const atlas = textureLoader.load('/textures/atlas.png', (texture) => {
        texture.colorSpace = SRGBColorSpace
        texture.flipY = false
      })

      atlasMat = new MeshStandardMaterial({ map: atlas })

      // load all models
      modelPaths.forEach(async ({ name, path }) => {
        const object = await loadModel(path)
        let graphics = null
        let physics = null

        if (name === 'boulder' || name === 'spinner') {
          graphics = object.scene.children[0]
          allModels.set(name, { graphics })
        } else if (name === 'windmill') {
          graphics = object.scene
          allModels.set(name, { graphics })
        } else {
          object.scene.traverse((child) => {
            if (child.isMesh && child.name.endsWith('_graphics')) {
              graphics = child
            } else if (child.isMesh && child.name.endsWith('_physics')) {
              physics = child
            }
          })

          allModels.set(name, { graphics, physics })
        }

        updateLoadedAssets()

        if (allModels.size === modelPaths.length) resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

// TEXTURES
export const loadTexture = (url) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.colorSpace = SRGBColorSpace
        updateLoadedAssets()
        resolve(texture)
      },
      undefined,
      reject
    )
  })
}

export const loadAllTextures = async () => {
  return new Promise((resolve, reject) => {
    try {
      texturePaths.forEach(async ({ name, path }) => {
        const texture = await loadTexture(path)
        allTextures.set(name, texture)
        if (allTextures.size === texturePaths.length) resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const useAllModels = () => allModels
export const useAllTextures = () => allTextures
export const useAtlas = () => atlasMat
