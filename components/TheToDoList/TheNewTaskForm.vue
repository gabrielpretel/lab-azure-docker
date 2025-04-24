<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PlusIcon from '../assets/icons/plusIcon.svg'
  import { useTasksLists } from '../../composables/useTasksLists'
  import AddIcon from '../assets/icons/addIcon.svg'
  import CompleteIcon from '../assets/icons/completeIcon.svg'
  import CrossIcon from '../assets/icons/crossIcon.svg'
  import { useRandomColors } from '../../composables/useRandomColors'

  const name = ref('')
  const description = ref('')
  const showNewTaskForm = ref(false)
  const showAlert = ref(false)
  const route = useRoute()
  const idList = computed(() => route.params.idList as string)

  const taskHistory = useTasksLists()
  const randomColor = useRandomColors()

  const onSubmit = () => {
    const newTask = {
      id: taskHistory.generateId(),
      name: name.value,
      description: description.value,
      completed: false,
      bgColor: randomColor.getRandomColor(),
      editMode: false,
    }

    taskHistory.addTask(newTask, idList.value)

    name.value = ''
    description.value = ''

    showNewTaskForm.value = !showNewTaskForm.value
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 5000)
  }

  const onClick = () => {
    showNewTaskForm.value = !showNewTaskForm.value
  }

  const closeAlert = () => {
    showAlert.value = false
  }
</script>

<template>
  <button
    aria-label="Create a new task"
    :class="!showNewTaskForm ? 'new-task' : 'new-task-open'"
    @click="onClick()"
  >
    <AddIcon class="new-task-icon" /> New task
  </button>

  <div v-auto-animate>
    <form
      @submit.prevent="onSubmit"
      v-if="showNewTaskForm"
      class="new-task-form"
      aria-labelledby="new-task-form-title"
    >
      <h2 id="new-task-form-title" class="sr-only">New Task Form</h2>

      <label for="task-name" class="sr-only">Task Name</label>
      <input
        id="task-name"
        type="text"
        v-model="name"
        placeholder="Task name"
        required
        aria-label="Enter the name of the task"
      />

      <label for="task-description" class="sr-only">Task Description</label>
      <textarea
        id="task-description"
        v-model="description"
        placeholder="Write a note..."
        aria-label="Enter a description or note for the task"
      ></textarea>

      <button aria-label="Add this task" class="add-task-button">
        <PlusIcon /><span>Add task</span>
      </button>
    </form>

    <div
      class="alert-container"
      v-if="showAlert"
      role="alert"
      aria-live="assertive"
    >
      <div class="alert-info">
        <CompleteIcon class="success-icon" aria-hidden="true" />
        <p>Task added successfully.</p>
      </div>
      <button aria-label="Close alert" @click="closeAlert" class="close-button">
        <CrossIcon class="cross-icon" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style>
  .new-task {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    transition: 0.4s;

    &:hover {
      font-weight: 600;
    }

    &:hover .new-task-icon {
      fill: #383b42;
      border-color: #383b42;
      color: white;
    }
  }

  .new-task-open {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    fill: #383b42;
    border-color: #383b42;
    font-weight: 600;

    & .new-task-icon {
      fill: #383b42;
      border-color: #383b42;
      color: white;
    }
  }

  .new-task-icon {
    fill: transparent;
    margin-right: 5px;
    transition: 0.4s;
  }

  .new-task-form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    gap: 10px;

    & input,
    textarea {
      border-radius: 8px;
      font-family: 'Anderson Grotesk', Arial, Helvetica, sans-serif;
      border: none;
      padding: 8px 20px;
      background-color: #fff;
      box-shadow: 0px 0px 20px #f9dcd0;
      border: 1px solid #d9c8c05e;

      &:focus {
        outline: 1px solid rgb(212, 212, 212);
      }
    }

    & input {
      max-width: 300px;
    }

    & textarea {
      max-width: 600px;
      min-height: 100px;
      resize: none;
    }

    & .add-task-button {
      display: flex;
      width: 110px;
      border-radius: 8px;
      padding: 8px;
      background-color: #fff;
      transition: 0.4s;
      font-size: 14px;
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

  .alert-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 8px;
    background-color: #00755d;
    margin-top: 10px;

    & .alert-info {
      display: flex;
      align-items: center;
    }

    & p {
      font-weight: 400;
      margin-left: 5px;
      color: white;
      font-size: 0.9rem;
    }
  }

  .cross-icon {
    height: 1rem;
    transition: 0.4s;
    color: white;

    &:hover {
      scale: 1.2;
    }
  }

  .success-icon {
    fill: white;
    color: white;
    height: 20px;
  }

  .close-button {
    display: flex;
    align-self: center;
  }
</style>
