import { Mesh } from 'three'

import { useScene } from '@base/scene'
import { useAllModels } from '@base/loaders'
import { addPhysics } from '@physics/physics'

let scene = null
const boulderObjects = []

export const createBoulder = (el, offset) => {
  scene = useScene()
  const meshes = useAllModels()
  const graphics = meshes.get(el.type).graphics

  // GRAPHICS
  const graphicsGeo = graphics.geometry
  const graphicsMat = graphics.material
  const graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
  graphicsMesh.position.set(el.position.x + offset.x, el.position.y, el.position.z + offset.z)
  graphicsMesh.receiveShadow = true
  graphicsMesh.castShadow = true

  // PHYSICS
  const physics = addPhysics(graphicsMesh, 'dynamic', { ccdEnabled: true, activeEvents: true }, el.coliderType, {
    radius: 0.9
  })

  // ADD RESET LOOP
  setTimeout(() => {
    setInterval(() => {
      physics.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
      physics.rigidBody.setRotation({ w: 1, x: 0, y: 0, z: 0 }, true)
      physics.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true)
      physics.rigidBody.setTranslation(
        {
          x: el.position.x + offset.x,
          y: el.position.y,
          z: el.position.z + offset.z
        },
        true
      )
    }, el.resetDelay)
  }, el.delay)

  // ADD TO ARRAY TO ANIMATE
  boulderObjects.push(physics)

  scene.add(graphicsMesh)
}

export const updateBoulder = () => {
  boulderObjects.forEach((el) => {
    const pos = el.rigidBody.translation()
    const rot = el.rigidBody.rotation()

    el.mesh.position.set(pos.x, pos.y, pos.z)
    el.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
  })
}

export const removeBoulder = () => boulderObjects.forEach((el) => scene.remove(el.mesh))
export const useBoulder = () => boulderObjects[0]
export const useBoulders = () => boulderObjects
