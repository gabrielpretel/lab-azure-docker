<script setup lang="ts">
  defineProps({
    taskListArray: {
      type: Array,
      default: () => [],
    },
  })
</script>
<template>
  <div
    class="empty-list empty-list--centered"
    v-if="taskListArray.length === 0"
    role="alert"
    aria-live="polite"
  >
    <p>
      <i>No lists available at the moment</i>. Use the <b>button above</b> to
      create a <i>new list</i> and start organizing your tasks effectively.
    </p>
  </div>
</template>
