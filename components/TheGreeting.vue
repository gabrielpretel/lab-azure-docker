<script setup lang="ts">
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getCurrentDate = (): string => {
    const today = new Date()
    const day = dayNames[today.getDay()]
    const date = today.getDate()
    const month = monthNames[today.getMonth()]
    const year = today.getFullYear()
    return `${day}, ${date} ${month} ${year}`
  }

  const currentDate = getCurrentDate()
</script>

<template>
  <div class="greeting-container">
    <h1>Good evening, Gabriel</h1>
    <span>It`s {{ currentDate }}</span>
  </div>
</template>

<style>
  .greeting-container {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }
</style>
