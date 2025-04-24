<script setup lang="ts">
  import { ref } from 'vue'
  import AddIcon from '../assets/icons/addIcon.svg'
  import PlusIcon from '../assets/icons/plusIcon.svg'
  import { TaskList, useTasksLists } from '../../composables/useTasksLists'
  import { useRandomColors } from '../../composables/useRandomColors'

  const showNewListForm = ref<boolean>(false)
  const name = ref<string>('')

  const randomColor = useRandomColors()
  const lists = useTasksLists()

  const toggleNewListForm = () => {
    showNewListForm.value = !showNewListForm.value
  }

  const createNewList = () => {
    const newList: TaskList = {
      id: lists.generateId(),
      name: name.value,
      bgColor: randomColor.getRandomColor(),
      editMode: false,
      tasks: [],
    }

    lists.addList(newList)
    name.value = ''
  }
</script>
<template>
  <button
    aria-label="Create a new list"
    :class="!showNewListForm ? 'new-list' : 'new-list-open'"
    @click="toggleNewListForm()"
  >
    <AddIcon class="new-list-icon" /> New list
  </button>
  <div v-auto-animate>
    <form
      @submit.prevent="createNewList"
      class="new-list-form"
      v-if="showNewListForm"
      aria-labelledby="new-list-form-title"
    >
      <h2 id="new-list-form-title" class="sr-only">New List Form</h2>

      <label for="list-name" class="sr-only">List Name</label>
      <input
        id="list-name"
        type="text"
        v-model="name"
        placeholder="List name"
        required
        aria-label="Enter the name of the list"
      />

      <button aria-label="Add this list" class="add-list-button">
        <PlusIcon /><span>Add list</span>
      </button>
    </form>
  </div>
</template>
<style scoped>
  .new-list {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    transition: 0.4s;

    &:hover {
      font-weight: 600;
    }

    &:hover .new-list-icon {
      fill: #383b42;
      border-color: #383b42;
      color: white;
    }
  }

  .new-list-open {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    fill: #383b42;
    border-color: #383b42;
    font-weight: 600;

    & .new-list-icon {
      fill: #383b42;
      border-color: #383b42;
      color: white;
    }
  }

  .new-list-icon {
    fill: transparent;
    margin-right: 5px;
    transition: 0.4s;
  }

  .new-list-form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    gap: 10px;

    .add-list-button {
      display: flex;
      width: 110px;
      border-radius: 8px;
      padding: 8px;
      background-color: #fff;
      transition: 0.4s;
      font-size: 14px;
      text-align: center;
      box-shadow: 0px 0px 20px #f9dcd0;
      border: 1px solid #d9c8c05e;

      & svg {
        height: 16px;
      }

      &:hover {
        background-color: #383b42;
        border-color: #383b42;
        color: white;
      }
    }
  }
</style>
