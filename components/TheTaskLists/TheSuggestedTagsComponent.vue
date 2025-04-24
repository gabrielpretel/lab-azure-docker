<script setup lang="ts">
  import { useRandomColors } from '../../composables/useRandomColors'
  import { TaskList, useTasksLists } from '../../composables/useTasksLists'
  import { ref } from 'vue'

  const suggestions = ref([
    'Shopping List',
    'Books to Read',
    'Gift Ideas',
    'Movies to Watch',
    'Places to Visit',
    'Healthy Recipes',
    'Meditation Plan',
  ])

  const lists = useTasksLists()
  const randomColor = useRandomColors()

  defineProps({
    taskListArray: {
      type: Array,
      default: () => [],
    },
  })

  const createSuggestedList = (suggestion: string) => {
    const newList: TaskList = {
      id: lists.generateId(),
      name: suggestion,
      bgColor: randomColor.getRandomColor(),
      editMode: false,
      tasks: [],
    }

    lists.addList(newList)
  }
</script>
<template>
  <div class="empty-state" v-if="taskListArray.length === 0">
    <div class="suggested-tags">
      <p class="empty-text">No lists yet? Try starting with:</p>
      <div class="tags" role="list">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          class="tag"
          @click="createSuggestedList(suggestion)"
          role="listitem"
          aria-label="Create list: {{ suggestion }}"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>
<style>
  .empty-state {
    text-align: left;
    padding: 10px 0;
  }

  .suggested-tags {
    margin-top: 1rem;
  }

  .empty-text {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #555;
    font-weight: 800;
  }

  .tags {
    display: flex;
    justify-content: start;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    color: #191919;
    background-color: #ffff;
    border: 1px solid #d9c8c05e;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0px 0px 20px #f9dcd0;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .tag:hover {
    background-color: #383b42;
    color: #fff;
  }
</style>
