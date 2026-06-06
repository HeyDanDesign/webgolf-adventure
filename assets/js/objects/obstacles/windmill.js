import { Mesh, Quaternion, Euler } from 'three'

import { useScene } from '@base/scene'
import { useAtlas, useAllModels } from '@base/loaders'
import { addPhysics } from '@physics/physics'

let scene = null
let basePhysics = null
let bladesPhysics = null
let time = 0

export const createWindmill = (el, offset) => {
  scene = useScene()
  const meshes = useAllModels()
  const graphicsMat = useAtlas()

  const graphics = meshes.get(el.type).graphics
  const baseGeo = graphics.children[0].geometry
  const bladesGeo = graphics.children[1].geometry

  const baseMesh = new Mesh(baseGeo, graphicsMat)
  const bladesMesh = new Mesh(bladesGeo, graphicsMat)

  const bladesOffsetX = -1
  const bladesOffsetY = 2.2

  baseMesh.material = bladesMesh.material = graphicsMat
  baseMesh.receiveShadow = bladesMesh.receiveShadow = true
  baseMesh.castShadow = bladesMesh.castShadow = true

  baseMesh.position.set(el.position.x + offset.x, el.position.y, el.position.z + offset.z)
  bladesMesh.position.set(
    el.position.x + offset.x + bladesOffsetX,
    el.position.y + bladesOffsetY,
    el.position.z + offset.z
  )

  // add physics
  baseMesh.geometry.computeBoundingBox()
  const baseBounds = baseMesh.geometry.boundingBox
  basePhysics = addPhysics(baseMesh, 'fixed', null, el.coliderType, {
    width: baseBounds.max.x - baseBounds.min.x,
    height: baseBounds.max.y - baseBounds.min.y,
    depth: baseBounds.max.z - baseBounds.min.z
  })

  bladesMesh.geometry.computeBoundingBox()
  const bladesBounds = bladesMesh.geometry.boundingBox
  bladesPhysics = addPhysics(bladesMesh, 'fixed', null, el.coliderType, {
    width: bladesBounds.max.x - bladesBounds.min.x,
    height: bladesBounds.max.y - bladesBounds.min.y,
    depth: bladesBounds.max.z - bladesBounds.min.z
  })

  scene.add(baseMesh, bladesMesh)
}

export const updateWindmill = (dt) => {
  time += dt * 1

  const quaternion = new Quaternion()
  quaternion.setFromEuler(new Euler(time, 0, 0))
  bladesPhysics.rigidBody.setRotation(quaternion, true)

  const rot = bladesPhysics.rigidBody.rotation()
  bladesPhysics.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
}

export const removeWindmill = () => scene.remove(basePhysics.mesh, bladesPhysics.mesh)
export const useWindmill = () => {
  if (!basePhysics || !bladesPhysics) return
  return [basePhysics, bladesPhysics]
}
