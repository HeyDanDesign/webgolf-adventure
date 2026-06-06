import data from '@data/levels'

let state = null
const soundAssets = 13
const desktopAssets = 44 + soundAssets
const mobileAssets = desktopAssets - soundAssets

export const createState = () => {
  state = reactive({
    totalAssets: innerWidth > 960 ? desktopAssets : mobileAssets,
    loadedAssets: 0,
    level: 0,
    power: 0,
    locked: false,
    strokes: 0,
    penalties: 0,
    maxStrokes: 15,
    scorecard: [
      // {
      //   par: 4,
      //   penalties: 0,
      //   score: 4,
      //   strokes: 4
      // },
      // {
      //   par: 4,
      //   penalties: 0,
      //   score: 4,
      //   strokes: 4
      // },
      // {
      //   par: 6,
      //   penalties: 0,
      //   score: 6,
      //   strokes: 6
      // },
      // {
      //   par: 3,
      //   penalties: 0,
      //   score: 3,
      //   strokes: 3
      // },
      // {
      //   par: 6,
      //   penalties: 0,
      //   score: 6,
      //   strokes: 6
      // },
      // {
      //   par: 3,
      //   penalties: 0,
      //   score: 3,
      //   strokes: 3
      // },
      // {
      //   par: 6,
      //   penalties: 0,
      //   score: 6,
      //   strokes: 6
      // }
    ],
    showScorecard: false,
    showScorecardBtns: false,
    collectibles: [false, false, false, false, false],
    lastPos: null,
    soundActive: true,
    endTerm: 0,
    showHelper: false,
    endScreen: false,
    finalBreakdown: null
  })

  return state
}

export const updateLoadedAssets = () => state.loadedAssets++
export const updateLevel = (val) => (state.level = val)
export const updatePower = (val) => (state.power = val * 10)
export const updateLocked = (val) => (state.locked = val)
export const updateCollectibles = (id, val) => (state.collectibles[id] = val)
export const updateEndTerm = (val) => (state.endTerm = val)
export const updateShowHelper = (val) => (state.showHelper = val)
export const updateSoundActive = () => (state.soundActive = !state.soundActive)
export const updateEndScreen = (val) => (state.endScreen = val)
export const updateFinalBreakdown = (val) => (state.finalBreakdown = val)

// scorecard
export const updateScorecard = async () => {
  const currentLevel = state.level
  const holeData = {
    par: data.levels[currentLevel].par,
    strokes: state.strokes,
    penalties: state.penalties,
    score: state.strokes + state.penalties
  }

  // if we played a new level for the first time
  if (currentLevel >= state.scorecard.length) state.scorecard.push(holeData)
  // if we replayed a level
  else state.scorecard[currentLevel] = holeData

  setTimeout(() => {
    showScorecard(true, true)
    resetStrokes()
    resetPenalties()
  }, 2500)
}
export const resetScorecard = () => (state.scorecard = 0)
export const showScorecard = (val, btns = false) => {
  state.showScorecard = val
  state.showScorecardBtns = btns
}

// strokes
export const updateStrokes = () => state.strokes++
export const resetStrokes = () => (state.strokes = 0)

// penalties
export const updatePenalties = () => state.penalties++
export const resetPenalties = () => (state.penalties = 0)

//
export const updateLastPos = (pos) => (state.lastPos = pos)

// sound

// access state
export const useState = () => state
