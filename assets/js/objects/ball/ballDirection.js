import { Group, PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, AdditiveBlending, RepeatWrapping } from 'three'
import gsap from 'gsap'

import { useScene } from '@base/scene'
import { useAllTextures } from '@base/loaders'

let group = null
let mesh = null
let mat = null

export const createBallDirection = (ballPos) => {
  const scene = useScene()
  const textures = useAllTextures()

  const arrow = textures.get('arrow')
  arrow.wrapS = arrow.wrapT = RepeatWrapping
  arrow.repeat.set(4, 1)

  gsap.to(arrow.offset, { duration: 1, x: 1, repeat: -1, ease: 'none' })

  group = new Group()
  const geo = new PlaneGeometry(2, 0.3)
  mat = new MeshBasicMaterial({
    color: 0xd4e660,
    alphaMap: arrow,
    transparent: true,
    depthTest: false,
    blending: AdditiveBlending
  })
  mesh = new Mesh(geo, mat)
  mesh.name = 'ballDirection'
  mesh.rotation.x = -Math.PI / 2
  mesh.position.x = -1

  group.add(mesh)
  group.position.set(ballPos.x, ballPos.y, ballPos.z)
  group.scale.set(0, 1, 1)

  scene.add(group)
}

export const updateBallDirectionPos = (pos) => group.position.set(pos.x, pos.y, pos.z)
export const updateBallDirectionRot = (rot) => (group.rotation.y = rot)
export const updateBallDirectionScale = (power) => group.scale.set(power, 1, 1)

export const useBallDirection = () => mesh
