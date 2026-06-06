import { Vector3, Box3, BoxGeometry, Quaternion, Euler } from 'three'
import { World, EventQueue, RigidBodyDesc, ColliderDesc, ActiveEvents } from '@dimforge/rapier3d'

import { createPhysicsWireframe, updatePhysicsWireframe, removePhysicsWireframe } from '@physics/wireframes'
import { updateCollision } from '@physics/collision'

let debug = null

let physics = null
let physicsEvents = null
let physicsObjects = []

export const createPhysics = (d) => {
  debug = d
  const gravity = new Vector3(0.0, -20, 0.0)
  physics = new World(gravity)
  physicsEvents = new EventQueue(true)
}

export const updatePhysics = (deltaTime) => {
  physics.step(physicsEvents)
  physics.timestep = deltaTime
  updateCollision()
  if (debug.wireframes) updatePhysicsWireframe()
}

export const addPhysics = (mesh, rbType, rbSettings, cType, cSettings, addToArray = true) => {
  // Calculate the geometric center offset of the mesh
  const boundingBox = new Box3().setFromObject(mesh)
  const center = new Vector3()
  boundingBox.getCenter(center)
  const offset = center.sub(mesh.position)
  const meshPos = mesh.position.clone()
  const meshRot = mesh.rotation.clone()

  // RigidBody settings
  const rigidBodyDesc = RigidBodyDesc[rbType]()

  // Collider settings
  let colliderDesc = null

  switch (cType) {
    case 'cuboid':
      const { width, height, depth } = cSettings
      colliderDesc = ColliderDesc.cuboid(width / 2, height / 2, depth / 2)

      if (mesh.geometry instanceof BoxGeometry) {
        rigidBodyDesc.setTranslation(meshPos.x, meshPos.y, meshPos.z)
      } else {
        rigidBodyDesc.setTranslation(meshPos.x + offset.x, meshPos.y + offset.y, meshPos.z + offset.z)
      }

      break
    case 'ball':
      const { radius } = cSettings
      colliderDesc = ColliderDesc.ball(radius)
      rigidBodyDesc.setTranslation(meshPos.x + offset.x, meshPos.y + offset.y, meshPos.z + offset.z)
      break
    default:
      colliderDesc = ColliderDesc.trimesh(mesh.geometry.attributes.position.array, mesh.geometry.index?.array)
      rigidBodyDesc.setTranslation(meshPos.x, meshPos.y, meshPos.z)
      break
  }

  //
  const quaternion = new Quaternion()
  quaternion.setFromEuler(new Euler(meshRot.x, meshRot.y, meshRot.z))
  rigidBodyDesc.setRotation(quaternion)

  // Optional settings
  if (rbSettings?.linearDamping) rigidBodyDesc.setLinearDamping(rbSettings.linearDamping)
  if (rbSettings?.angularDamping) rigidBodyDesc.setAngularDamping(rbSettings.angularDamping)
  if (rbSettings?.ccdEnabled) rigidBodyDesc.setCcdEnabled(true)

  // Create rigidBody
  const rigidBody = usePhysics().createRigidBody(rigidBodyDesc)

  // Apply additional settings to collider
  if (cSettings?.friction) colliderDesc.setFriction(cSettings.friction)
  if (cSettings?.restitution) colliderDesc.setRestitution(cSettings.restitution)
  if (cSettings?.activeEvents) colliderDesc.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
  if (cSettings?.sensor) colliderDesc.setSensor(true)

  // Create collider
  const collider = usePhysics().createCollider(colliderDesc, rigidBody)

  // Store in physicObjects
  const physicObject = { mesh, rigidBody, collider }
  if (addToArray) physicsObjects.push(physicObject)

  //
  if (debug.wireframes) createPhysicsWireframe()

  return physicObject
}

export const removePhysics = () => {
  const allColliders = physicsObjects.map((item) => item.collider)
  allColliders.forEach((el) => {
    physics.removeCollider(el, true)
  })
  if (debug.wireframes) removePhysicsWireframe()
}

export const usePhysics = () => physics
export const usePhysicsEvents = () => physicsEvents
export const usePhysicsObjects = () => physicsObjects
