<template>
  <span
    class="badge"
    :class="type"
    :style="{
      verticalAlign: vertical
    }"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    required: false,
    default: 'tip'
  },
  text: {
    type: String,
    required: false,
    default: ''
  },
  vertical: {
    type: String,
    required: false,
    default: undefined
  }
})
</script>
