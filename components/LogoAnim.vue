<template>
  <div>
    <client-only>
      <Vue3Lottie animationLink="/lotties/logo.json" :loop="false" :autoPlay="false" :pauseAnimation="props.pauseAnim" />
    </client-only>
  </div>
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie'

const props = defineProps({
  pauseAnim: {
    type: Boolean,
    default: true
  }
})
</script>