import { ThreePerf } from 'three-perf'
import { useRenderer } from '@base/renderer'

let perf = null

export const createPerformance = () => {
  perf = new ThreePerf({
    anchorX: 'left',
    anchorY: 'top',
    domElement: document.body,
    renderer: useRenderer()
  })
}

export const usePerformance = () => perf
