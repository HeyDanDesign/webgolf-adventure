import { createBoulder, removeBoulder, useBoulder } from '@objects/obstacles/boulder'
import { createSpinner, removeSpinner, useSpinner } from '@objects/obstacles/spinner'
import { createWindmill, removeWindmill, useWindmill } from '@objects/obstacles/windmill'

export const createObstacles = (level) => {
  const offset = level.offset

  level.obstacles.forEach((el, i) => {
    if (el.type === 'boulder') createBoulder(el, offset, i)
    if (el.type === 'spinner') createSpinner(el, offset)
    if (el.type === 'windmill') createWindmill(el, offset)
  })
}

export const removeObstacles = () => {
  if (useBoulder()) removeBoulder()
  if (useSpinner()) removeSpinner()
  if (useWindmill()) removeWindmill()
}
