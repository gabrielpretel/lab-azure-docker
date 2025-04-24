import { defineStore } from 'pinia'
import { ref } from 'vue'

export type TaskRecord = {
  id: string
  name: string
  description: string
  completed: boolean
  bgColor: string
  editMode: boolean
}

export type TaskList = {
  id: string
  name: string
  bgColor: string
  editMode: boolean
  tasks: TaskRecord[]
}

const listFactory = (list: TaskList) => {
  const { name, bgColor, editMode } = list

  return {
    id: generateId(),
    name,
    bgColor,
    editMode,
    tasks: [],
  }
}

const taskFactory = (task: TaskRecord) => {
  const { id, name, description, completed, bgColor, editMode } = task

  return {
    id,
    name,
    description,
    completed,
    bgColor,
    editMode,
  }
}

const generateId = () => {
  return Math.random().toString(36).substring(2, 15)
}

export const useTasksLists = defineStore(
  'taskHistory',
  () => {
    const taskList = ref<Record<string, TaskList>>({})

    const addList = (list: TaskList) => {
      const newList = listFactory(list)
      taskList.value[newList.id] = newList
    }

    const addTask = (task: TaskRecord, listId: string) => {
      const taskRecord = taskFactory(task)

      taskList.value[listId].tasks.push(taskRecord)
    }

    return {
      addTask,
      addList,
      taskList,
      generateId,
      getTasks: (listId: string) => taskList.value[listId],
    }
  },
  {
    persist: {
      storage: process.client ? localStorage : undefined,
    },
  },
)
