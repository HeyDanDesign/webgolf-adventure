import { BufferGeometry, BufferAttribute, LineBasicMaterial, LineSegments } from 'three'
import { useScene } from '@base/scene'
import { usePhysics } from '@physics/physics'

let scene = null
const geometry = new BufferGeometry()
let lineSegments = null

export const createPhysicsWireframe = () => {
  scene = useScene()
  const physics = usePhysics()

  const { vertices } = physics.debugRender()

  // Convert vertices to Float32Array and add it to geometry
  const verticesArray = new Float32Array(vertices)
  geometry.setAttribute('position', new BufferAttribute(verticesArray, 3))

  const material = new LineBasicMaterial({ color: 0x000000 })
  lineSegments = new LineSegments(geometry, material)

  scene.add(lineSegments)
}

export const updatePhysicsWireframe = () => {
  removePhysicsWireframe()
  createPhysicsWireframe()
}

export const removePhysicsWireframe = () => {
  if (lineSegments) {
    scene.remove(lineSegments)
    lineSegments = null
  }
}
