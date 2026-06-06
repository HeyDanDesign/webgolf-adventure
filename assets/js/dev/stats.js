import Stats from 'stats.js'

let stats = null

export const createStats = () => {
  stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)
}

export const updateStats = () => {
  stats.begin()
  //
  stats.end()
}

export const useStats = () => stats
