import { LineCurve3, TubeGeometry, MeshBasicMaterial, Mesh } from 'three'
import { useScene } from '@base/scene'

let scene = null
const tubeRadius = 0.1
let line = null

export const createLine = (start, end) => {
  scene = useScene()

  const path = new LineCurve3(start, end)
  const geo = new TubeGeometry(path, 1, tubeRadius, 20, false)
  const mat = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    depthTest: false
  })
  line = new Mesh(geo, mat)
  line.name = 'line'
  scene.add(line)
}

export const updateLine = (start, end) => {
  const path = new LineCurve3(start, end)
  const geometry = new TubeGeometry(path, 1, tubeRadius, 20, false)

  // Adjust repetition along the length of the line)
  line.geometry.dispose()
  line.geometry = geometry
}

export const removeLine = () => scene.remove(line)
