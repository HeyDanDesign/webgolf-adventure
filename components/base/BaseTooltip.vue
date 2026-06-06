<template>
  <div
    :class="[positionStyles, { 'baseTooltip--bottom': props.position === 'bottom' }]"
    class="baseTooltip bg-stone-500 px-8 pt-4 pb-2 rounded-4 absolute left-1/2 -translate-x-1/2 w-max pointer-events-none opacity-0 transition-all z-9 group-hover:opacity-100">
    <p class="font-baloo text-white text-14 font-500">
      <slot />
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  position: {
    type: String,
    default: 'top'
  }
})

const positionStyles = computed(() => {
  if (props.position === 'bottom') return 'top-full translate-y-8 group-hover:translate-y-0 mt-8'
  else return 'bottom-full translate-y-8 group-hover:translate-y-0 mb-8'
})
</script>

<style lang="scss">
.baseTooltip {
  &::after {
    content: '';
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 4px 6px 0 6px;
    border-color: theme('colors.stone.500') transparent transparent transparent;
    position: absolute;
    left: calc(50% - 6px);
    top: 100%;
  }

  &--bottom {
    &::after {
      top: auto;
      bottom: 100%;
      transform: rotate(180deg);
    }
  }
}
</style>