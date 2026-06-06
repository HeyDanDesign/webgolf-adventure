import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { useCamera } from '@base/camera'

let controls = null

export const createControls = (canvas) => {
  const camera = useCamera()

  controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  controls.update()
}

export const updateControls = () => controls.update()
export const useControls = () => controls
