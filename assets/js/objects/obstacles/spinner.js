import { Mesh, Quaternion, Euler } from 'three'

import { useScene } from '@base/scene'
import { useAtlas, useAllModels } from '@base/loaders'
import { addPhysics } from '@physics/physics'

let scene = null
const spinnerObjects = []
let time = 0

export const createSpinner = (el, offset) => {
  scene = useScene()
  const meshes = useAllModels()
  const graphicsMat = useAtlas()

  // GRAPHICS
  const graphicsGeo = meshes.get(el.type).graphics.geometry
  const graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
  graphicsMesh.position.set(el.position.x + offset.x, el.position.y, el.position.z + offset.z)
  graphicsMesh.receiveShadow = true
  graphicsMesh.castShadow = true

  // PHYSICS
  const physics = addPhysics(
    graphicsMesh,
    'kinematicPositionBased',
    { friction: 0, restitution: 2.2 },
    el.coliderType,
    null
  )

  // ADD TO ARRAY TO ANIMATE
  spinnerObjects.push(physics)

  scene.add(graphicsMesh)
}

export const updateSpinner = (dt) => {
  time += dt * 1

  spinnerObjects.forEach((el) => {
    const quaternion = new Quaternion()
    quaternion.setFromEuler(new Euler(0, time, 0))
    el.rigidBody.setNextKinematicRotation(quaternion, true)

    const rot = el.rigidBody.rotation()
    el.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
  })
}

export const removeSpinner = () => spinnerObjects.forEach((el) => scene.remove(el.mesh))
export const useSpinner = () => spinnerObjects[0]
