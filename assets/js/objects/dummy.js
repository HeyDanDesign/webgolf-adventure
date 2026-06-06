import { PlaneGeometry, MeshBasicMaterial, Mesh } from 'three'

import { useScene } from '@base/scene'

let mesh = null
let mat = null

export const createDummy = () => {
  const scene = useScene()

  const points = 50
  const geo = new PlaneGeometry(points, points)

  mat = new MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0
  })
  mesh = new Mesh(geo, mat)
  mesh.name = 'dummy'
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 5.1

  scene.add(mesh)
}

export const useDummy = () => mesh
