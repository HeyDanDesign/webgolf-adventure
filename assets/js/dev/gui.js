import GUI from 'lil-gui'

let gui = null

export const createGui = () => {
  gui = new GUI()
}

export const useGui = () => gui
