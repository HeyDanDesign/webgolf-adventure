<template>
  <div ref="root" class="fixed inset z-3 pointer-events-none opacity-0 scale-75 select-none">
    <img
      v-for="el, i in images"
      :src="`/images/terms/${el}`"
      :class="{ 'opacity-0': term !== i }"
      class="max-w-[80%] max-h-160 absolute xy-center">
    {{ test }}
  </div>
</template>

<script setup>
import gsap from 'gsap'
import { useState } from '@game/state'

const images = [
  '00_hole-in-one.png',
  '01_condor.png',
  '02_albertross.png',
  '03_eagle.png',
  '04_birdie.png',
  '05_par.png',
  '06_bogey.png',
  '07_2x-bogey.png',
  '08_3x-bogey.png',
  '09_terrible.png',
  '10_out-of-strokes.png'
]

const state = useState()
const root = ref(null)
const term = ref(0)

// 

const test = computed(() => {
  const scorecard = state.scorecard
  const currentHole = scorecard[scorecard.length - 1]
  const par = currentHole?.par
  const score = currentHole?.score

  const value = par - score

  if (typeof value !== 'number' || isNaN(value)) return

  // hole-in-one
  if (score === 1) term.value = 0

  // out-of-strokes
  else if (score >= 15) term.value = 10

  // condor
  else if (value === 4) term.value = 1

  // albatross
  else if (value === 3) term.value = 2

  // eagle
  else if (value === 2) term.value = 3

  // birdie
  else if (value === 1) term.value = 4

  // par
  else if (value === 0) term.value = 5

  // bogey
  else if (value === -1) term.value = 6

  // 2x bogey
  else if (value === -2) term.value = 7

  // 3x bogey
  else if (value === -3) term.value = 8

  // terrible
  else term.value = 9

  gsap.fromTo(root.value, { scale: 0.75 }, { duration: 3, scale: 1, ease: 'power2.out' })
  gsap.fromTo(root.value, { opacity: 0 }, { duration: 1, opacity: 1, ease: 'power2.out' })
  gsap.to(root.value, { delay: 1.75, duration: 1, opacity: 0, ease: 'power2.out' })


})
</script>