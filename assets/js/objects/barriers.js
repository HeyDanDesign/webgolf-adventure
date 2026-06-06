import { MeshStandardMaterial, Mesh, BoxGeometry } from 'three'

import { useScene } from '@base/scene'
import { addPhysics } from '@physics/physics'

let scene = null
let barrierObjects = []

export const createBarriers = (level) => {
  scene = useScene()
  const offset = level.offset

  level.barriers.forEach((el) => {
    // GRAPHICS
    const graphicsGeo = new BoxGeometry(el.size.width, el.size.height, el.size.depth)
    const graphicsMat = new MeshStandardMaterial({ color: 0xdddddd })
    const graphicsMesh = new Mesh(graphicsGeo, graphicsMat)
    graphicsMesh.position.set(el.position.x, el.position.y, el.position.z)
    graphicsMesh.receiveShadow = true
    graphicsMesh.castShadow = true

    // apply rotation to both graphic and physics if defined
    let rotation = null
    if (el.rotation === -90) rotation = -Math.PI / 2
    else if (el.rotation === 90) rotation = Math.PI / 2
    else if (el.rotation === 180) rotation = Math.PI
    else rotation = el.rotation
    graphicsMesh.rotation.y = rotation

    // apply offset to graphics if defined
    graphicsMesh.position.x += offset.x
    graphicsMesh.position.z += offset.z

    // PHYSICS
    addPhysics(graphicsMesh, 'fixed', null, el.coliderType, {
      width: el.size.width,
      height: el.size.height,
      depth: el.size.depth
    })

    //
    scene.add(graphicsMesh)
    barrierObjects.push(graphicsMesh)
  })
}

export const removeBarriers = () => {
  barrierObjects.forEach((el) => scene.remove(el))
}
