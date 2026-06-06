<template>
  <div
    ref="card"
    :class="shown ? 'pointer-events-auto' : 'pointer-events-none'"
    class="promoCard fixed top-24 right-24 z-3 w-320 opacity-0 select-none l:top-12 l:right-12 s:w-[calc(100%-24px)]">

    <div class="relative rounded-20 p-16 bg-gradient-to-b from-sky-100 to-white l:rounded-16">

      <button
        class="absolute -top-8 -right-8 z-3 size-28 rounded-full bg-white text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Dismiss"
        @click="animOut">
        <IconCross class="size-16" />
      </button>

      <div class="flex items-center gap-8 mb-8">
        <img
          src="/images/promo/headshot.jpg"
          alt="Dan Heywood"
          class="size-40 rounded-full object-cover border border-white/50 shrink-0" />
        <div>

          <p class="text-18 font-baloo font-700 leading-120 text-stone-500 mb-2 s:text-16">
            Hey! I'm Dan!
          </p>
          <p class="text-14 font-baloo font-400 leading-100 text-stone-500/80 text-balance s:text-12">Are you enjoying my little side project?</p>
        </div>
      </div>

      <p class="text-14 font-baloo font-400 leading-120 text-stone-500/80 mb-12">
        Need a <strong class="text-black">Senior Product Designer & Developer</strong> who can build websites, apps and games, just like this one? Let's talk...
      </p>

      <div class="flex gap-8">
        <BaseBtn href="https://hey-dan.com" color="yellow" size="sm" class="w-full">View portfolio</BaseBtn>
        <BaseBtn href="mailto:hello@hey-dan.com" :external="false" size="sm" class="w-full">Get in touch</BaseBtn>
      </div>

      <div class="absolute inset-0 border-2 border-white rounded-20 opacity-50 pointer-events-none z-1 l:rounded-16" />
    </div>
  </div>
</template>

<script setup>
import gsap from 'gsap'
import { useState } from '@game/state'
import { playSoundUiHelper, playSoundUiClick } from '@game/sounds'

import IconCross from '@svgs/icons/cross.svg'

// state
const state = useState()

// refs
const card = ref(null)

// state
const shown = ref(false)

// data
const PROMO_LEVEL = 2 // 3rd hole (0-indexed)
const FINAL_DELAY = 5.3 // wait for the FinalBreakdown columns + buttons to finish animating in

// events
const animIn = (delay = 0) => {
  if (shown.value) return
  shown.value = true

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.fromTo(card.value,
    { opacity: 0, x: reduce ? 0 : 40 },
    { delay, duration: 0.7, opacity: 1, x: 0, ease: 'expo.out', onStart: () => playSoundUiHelper() }
  )
}

const animOut = () => {
  sessionStorage.setItem('promoSeen', true)
  playSoundUiClick()

  gsap.to(card.value, {
    duration: 0.4,
    opacity: 0,
    x: 40,
    ease: 'power2.in',
    onComplete: () => (shown.value = false)
  })
}

// effects

// in-game: 3rd hole, after the first shot (once per session)
watch(
  () => [state.level, state.strokes],
  () => {
    if (shown.value) return
    if (sessionStorage.getItem('promoSeen')) return
    if (state.level !== PROMO_LEVEL || state.strokes < 1) return

    nextTick(() => animIn())
  },
  { immediate: true }
)

// final screen: once the breakdown has finished animating in (ignores the in-game "seen" flag)
watch(
  () => state.finalBreakdown,
  (val) => {
    if (!val) return
    nextTick(() => animIn(FINAL_DELAY))
  },
  { immediate: true }
)
</script>
