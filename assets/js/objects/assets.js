import { Mesh, RepeatWrapping, SRGBColorSpace } from 'three'

import { useScene } from '@base/scene'
import { useAtlas, useAllModels, useAllTextures } from '@base/loaders'
import { addPhysics } from '@physics/physics'

let scene = null
let assetObjects = []

export const createAssets = (level) => {
  scene = useScene()
  const graphicsMat = useAtlas()
  const meshes = useAllModels()
  const offset = level.offset

  level.assets.forEach((el) => {
    // GRAPHICS
    const graphicsGeo = meshes.get(el.type).graphics.geometry
    const graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
    graphicsMesh.position.set(el.position.x, el.position.y, el.position.z)
    graphicsMesh.receiveShadow = true
    graphicsMesh.castShadow = true

    if (el.type === 'advert') {
      const textures = useAllTextures()
      const texture = textures.get('banners')
      texture.wrapS = texture.wrapT = RepeatWrapping
      texture.colorSpace = SRGBColorSpace
      texture.flipY = false
      // texture.repeat.set(1, 1)

      const childMesh = meshes.get(el.type).graphics.children[0].clone()

      // Clone the material to avoid shared state
      childMesh.material = childMesh.material.clone()

      // Apply texture
      childMesh.material.color.set(0xffffff)
      childMesh.material.metalness = 0
      childMesh.material.map = texture
      childMesh.material.needsUpdate = true

      graphicsMesh.add(childMesh)
    }

    // PHYSICS
    let physicsGeo = null
    let physicsMesh = null
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

    // apply offset to both graphic and physics if defined
    graphicsMesh.position.x = physicsMesh.position.x += offset.x
    graphicsMesh.position.z = physicsMesh.position.z += offset.z

    // add physics
    physicsGeo.computeBoundingBox()
    const bbox = physicsGeo.boundingBox

    addPhysics(physicsMesh, 'fixed', null, el.coliderType, {
      width: bbox.max.x - bbox.min.x,
      height: bbox.max.y - bbox.min.y,
      depth: bbox.max.z - bbox.min.z
    })

    scene.add(graphicsMesh)
    assetObjects.push(graphicsMesh)
  })
}

export const removeAssets = () => {
  assetObjects.forEach((el) => scene.remove(el))
}
