import { Scene, Color, Fog } from 'three'

let scene = null

export const createScene = () => {
  scene = new Scene()
  scene.background = new Color(0x0099ff)
  scene.fog = new Fog(0x0099ff, 50, 60)
  return scene
}

export const useScene = () => scene
