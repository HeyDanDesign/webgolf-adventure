<template>
  <div class="size-48 relative m:size-32">
    <img :class="{ '!scale-100 !opacity-100': unlocked }" class="size-full absolute z-2 scale-125 opacity-0 transition-all duration-500" :src="`/images/collectibles/${props.type}.png`" />
    <img class="size-full relative z-1" src="/images/collectibles/0.png" />
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  unlocked: {
    type: Boolean,
    default: false
  }
})
</script>