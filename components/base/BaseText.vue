<template>
  <svg :class="{ 'baseText--dropShadow': dropShadow }" class="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
    <text
      :font-size="fontSize"
      :stroke-width="strokeWidth * 2"
      :fill="color"
      :stroke="color"
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="baby-monsta"
      stroke-linecap="round"
      stroke-linejoin="round">
      <slot />
    </text>
    <text
      :font-size="fontSize"
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="baby-monsta"
      fill="white">
      <slot />
    </text>
  </svg>
</template>

<script setup>
defineProps({
  fontSize: {
    type: Number,
    default: 40
  },
  strokeWidth: {
    type: Number,
    default: 4
  },
  dropShadow: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#1F2E3D'
  }
})
</script>

<style>
.baseText--dropShadow {
  text-shadow: 0 2px 0px theme('colors.stone.500');
}
</style>