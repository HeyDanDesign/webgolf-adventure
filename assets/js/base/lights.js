import { AmbientLight, DirectionalLight } from 'three'
import { useScene } from '@base/scene'

let dLight = null

export const createLights = () => {
  const scene = useScene()

  const aLight = new AmbientLight(0xffffff, 0.5)

  dLight = new DirectionalLight(0xffffff, 1)
  // const dLightHelper = new DirectionalLightHelper(dLight)

  dLight.position.set(4, 6, 10)

  dLight.castShadow = true
  dLight.shadow.mapSize.width = 1024 * 2
  dLight.shadow.mapSize.height = 1024 * 2

  dLight.shadow.camera.top = 20
  dLight.shadow.camera.bottom = -20
  dLight.shadow.camera.left = -20
  dLight.shadow.camera.right = 20
  dLight.shadow.camera.near = 0.1
  dLight.shadow.camera.far = 100

  dLight.shadow.bias = -0.0001

  scene.add(aLight, dLight)
}

export const useDirectionalLight = () => dLight
