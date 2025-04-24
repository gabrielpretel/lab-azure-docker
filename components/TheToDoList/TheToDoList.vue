<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { TaskRecord, useTasksLists } from '../../composables/useTasksLists'
  import { toast } from 'vue-sonner'
  import { useRoute, useRouter } from 'vue-router'

  import draggable from 'vuedraggable'
  import TheNewTaskForm from './TheNewTaskForm.vue'
  import { useTransitions } from '../../composables/useTransitions'

  import DeleteIcon from '../assets/icons/deleteIcon.svg'
  import CompleteIcon from '../assets/icons/completeIcon.svg'
  import IncompleteIcon from '../assets/icons/incompleteIcon.svg'
  import EditIcon from '../assets/icons/editIcon.svg'
  import CrossIcon from '../assets/icons/crossIcon.svg'
  import DraggableIcon from '../assets/icons/draggableIcon.svg'

  type FilterTask = 'all' | 'completed' | 'incompleted'
  let selectedFilter = ref<FilterTask>('all')
  let editName = ref<string>('')
  let editDescription = ref<string>('')
  const isEmptyTasks = computed(() => taskList.tasks.length === 0)
  const isEmptyCompletedTasks = computed(() =>
    taskList.tasks.every((task) => !task.completed),
  )
  const isEmptyIncompletedTasks = computed(() =>
    taskList.tasks.every((task) => task.completed),
  )

  const route = useRoute()
  const router = useRouter()
  const idList = computed(() => route.params.idList as string)

  const taskHistory = useTasksLists()
  const taskList = taskHistory.getTasks(idList.value)

  const { beforeEnter, enter, leave } = useTransitions()

  const navigateToList = () => {
    router.push('/')
  }

  const sortTasksByCompletion = (tasks: TaskRecord[]): TaskRecord[] => {
    return tasks.sort((a, b) => {
      if (a.completed === b.completed) return 0
      return a.completed ? 1 : -1
    })
  }

  const toggleTaskCompletion = (currentTask: TaskRecord) => {
    taskList.tasks = taskList.tasks.map((task) =>
      task.id === currentTask.id
        ? { ...task, completed: !task.completed }
        : task,
    )

    taskList.tasks = sortTasksByCompletion(taskList.tasks)

    currentTask.completed
      ? toast.success('Task incompleted.')
      : toast.success('Task completed!')
  }

  const deleteTask = (id: string) => {
    taskList.tasks = taskList.tasks.filter((task) => task.id !== id)
    toast.success('Task deleted.')
  }

  const saveTaskEdits = (element: TaskRecord) => {
    taskList.tasks = taskList.tasks.map((task) =>
      task.id === element.id
        ? {
            ...task,
            name: editName.value,
            description: editDescription.value,
            editMode: false,
          }
        : task,
    )
    taskHistory.taskList[idList.value] = { ...taskList }
    toast.success('Task saved.')
  }

  const toggleEditMode = (element: TaskRecord) => {
    taskList.tasks = taskList.tasks.map((task) =>
      task.id !== element.id ? task : { ...task, editMode: !task.editMode },
    )
  }

  const startTaskEditing = (task: TaskRecord) => {
    editName.value = task.name
    editDescription.value = task.description
    toggleEditMode(task)
  }

  const reorderTasks = (newOrder: TaskRecord[]) => {
    const remainingTasks = taskList.tasks.filter(
      (task) => !newOrder.some((newTask) => newTask.id === task.id),
    )

    taskList.tasks = sortTasksByCompletion([...newOrder, ...remainingTasks])
  }

  const filteredTasks = computed(() => {
    switch (selectedFilter.value) {
      case 'completed':
        return taskList.tasks.filter((task) => task.completed === true)
      case 'incompleted':
        return taskList.tasks.filter((task) => task.completed === false)
      default:
        return taskList.tasks
    }
  })
</script>

<template>
  <Toaster
    position="top-center"
    :toastOptions="{
      class: 'my-toast',
    }"
  />
  <button @click="navigateToList" class="back-button">< Back to lists</button>
  <h2 tabindex="0" :aria-label="'Task list' + taskList.name">
    {{ taskList.name }}
  </h2>
  <section class="todo-list-container">
    <div class="filters-container" role="group" aria-label="Filter tasks">
      <button
        class="button-primary"
        @click="selectedFilter = 'all'"
        :class="{ active: selectedFilter === 'all' }"
        aria-label="Show all tasks"
      >
        All
      </button>
      <button
        class="button-primary"
        @click="selectedFilter = 'completed'"
        :class="{ active: selectedFilter === 'completed' }"
        aria-label="Show completed tasks"
      >
        Completed
      </button>
      <button
        class="button-primary"
        @click="selectedFilter = 'incompleted'"
        :class="{ active: selectedFilter === 'incompleted' }"
        aria-label="Show incompleted tasks"
      >
        Incompleted
      </button>
    </div>
    <TheNewTaskForm />
    <div
      v-if="
        isEmptyTasks ||
        (selectedFilter === 'completed' && isEmptyCompletedTasks) ||
        (selectedFilter === 'incompleted' && isEmptyIncompletedTasks)
      "
      class="empty-list empty-list--centered"
      role="alert"
      aria-live="polite"
    >
      <p v-if="isEmptyTasks">
        No tasks available at the moment. Use the button below to create a new
        note and start organizing your tasks effectively.
      </p>
      <p v-else-if="selectedFilter === 'completed' && isEmptyCompletedTasks">
        No completed tasks yet.
      </p>
      <p
        v-else-if="selectedFilter === 'incompleted' && isEmptyIncompletedTasks"
      >
        No incomplete tasks yet.
      </p>
    </div>

    <div class="task-list" role="list" aria-label="Task list">
      <draggable
        v-model="taskList.tasks"
        group="tasks"
        handle=".drag-handle"
        animation="200"
        ghost-class="dragging"
        item-key="id"
        @update:modelValue="reorderTasks"
        v-auto-animate
      >
        <template #item="{ element }">
          <li
            class="item"
            :key="element.id"
            v-if="filteredTasks.includes(element)"
            role="listitem"
            :style="{
              backgroundColor:
                !element.completed || element.editMode
                  ? element.bgColor
                  : '#fafafa',
            }"
            :class="{
              itemEditmode: element.editMode,
              completed: element.completed && !element.editMode,
            }"
            :aria-label="element.name"
          >
            <div class="item-readonly" v-show="!element.editMode">
              <DraggableIcon class="drag-handle" aria-label="Drag task" />
              <div class="task-content">
                <div class="task-header">
                  <span
                    :aria-label="
                      element.completed
                        ? 'Completed ' + element.name
                        : element.name
                    "
                    tabindex="0"
                    >{{ element.name }}</span
                  >
                  <div
                    class="task-buttons"
                    role="group"
                    aria-label="Task actions"
                  >
                    <button
                      @click="toggleTaskCompletion(element)"
                      :aria-label="
                        element.completed
                          ? 'Mark task ' + element.name + ' as incomplete'
                          : 'Mark task ' + element.name + ' as complete'
                      "
                    >
                      <CompleteIcon v-if="!element.completed" class="icon" />
                      <template v-else>
                        <IncompleteIcon class="icon" />
                      </template>
                    </button>
                    <button
                      :aria-label="'Edit task ' + element.name"
                      @click="startTaskEditing(element)"
                    >
                      <EditIcon class="icon" />
                    </button>
                    <button
                      :aria-label="'Delete task ' + element.name"
                      @click="deleteTask(element.id)"
                    >
                      <DeleteIcon class="icon" />
                    </button>
                  </div>
                </div>
                <p v-if="element.description !== ''" tabindex="0">
                  {{ element.description }}
                </p>
              </div>
            </div>
            <transition
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
            >
              <div class="item-editmode" v-show="element.editMode">
                <form
                  @submit.prevent="saveTaskEdits(element)"
                  class="edit-form"
                  :key="element.id"
                  aria-label="'Edit task ' + element.name"
                >
                  <p>Editing task...</p>
                  <label for="edit-name-{{ element.id }}" class="sr-only"
                    >Task Name</label
                  >
                  <input
                    id="edit-name-{{ element.id }}"
                    type="text"
                    v-model="editName"
                    aria-label="Edit task name"
                  />
                  <label for="edit-description-{{ element.id }}" class="sr-only"
                    >Task Description</label
                  >
                  <textarea
                    id="edit-description-{{ element.id }}"
                    v-model="editDescription"
                    aria-label="Edit task description"
                  ></textarea>
                  <div class="control-buttons">
                    <button
                      class="cancel-button"
                      @click.prevent="startTaskEditing(element)"
                      aria-label="Cancel task editing"
                    >
                      <CrossIcon /> Cancelar
                    </button>
                    <button
                      class="save-button"
                      type="submit"
                      aria-label="Save task changes"
                    >
                      <CompleteIcon /> Save changes
                    </button>
                  </div>
                </form>
              </div>
            </transition>
          </li>
        </template>
      </draggable>
    </div>
  </section>
</template>

<style>
  h2 {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .todo-list-container {
    position: relative;
  }

  .task-list {
    margin-top: 20px;

    & .item {
      display: flex;
      flex-direction: column;
      padding: 18px;
      border-radius: 8px;
      margin-bottom: 10px;
      max-width: 600px;
      transition:
        background-color 0.3s ease,
        scale 0.3s ease;
      box-shadow: 0px 8px 20px #f9dcd0;
      border: 1px solid #d9c8c05e;

      & .item-readonly {
        display: flex;
        flex-direction: row;
      }

      & .edit-form {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 10px;

        & p {
          padding-left: 8px;
          font-weight: 900;
          font-size: 1rem;
        }
      }

      .control-buttons {
        display: flex;
        justify-content: end;
        gap: 8px;

        & button {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f6f8f9;
          gap: 4px;
          font-size: 0.9rem;
          padding: 5px 10px;
          border-radius: 8px;
          transition: 0.4s;

          &:hover {
            background-color: #383b42;
            color: white;
          }

          & svg {
            height: 18px;
            width: 18px;
          }
        }
        .save-button {
          background-color: #ffbb98;
          box-shadow: none;
        }
        .cancel-button {
          background-color: #fff;
          box-shadow: none;
        }
      }

      & span {
        font-weight: 600;
        font-size: 1.1rem;
        align-self: center;
        padding-right: 10px;
      }

      & p {
        margin-top: 5px;
        font-size: 0.9rem;
      }

      & .task-content {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: self-start;

    & .task-buttons {
      display: flex;
    }
    & button {
      border-radius: 8px;
      transition: 0.4s;
      font-size: 14px;
    }

    .icon {
      height: 1.2rem;
      transition: 0.4s;

      &:hover {
        scale: 1.2;
      }
    }
  }

  .drag-handle {
    cursor: grab;
    height: 20px;
    width: 20px;
    align-self: center;
    margin-right: 10px;
    color: #383b42;
  }

  .dragging {
    opacity: 0;
    scale: 1.05;
    background-color: #f0f0f0;
  }

  .completed {
    text-decoration: line-through;
    background-color: #919191;
    opacity: 0.6;

    & .tag {
      text-decoration: dashed;
    }
  }

  .completed-message {
    text-decoration: none;
  }

  .filters-container {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    gap: 8px;
    min-height: 32px;

    & .active {
      background-color: #383b42;
      color: white;
    }
  }

  .my-toast {
    padding: 8px;
  }

  ol[data-sonner-toaster] {
    --width: 150px !important;
  }

  .item-editmode {
    overflow: hidden;
  }

  label {
    padding-left: 8px;
    font-size: 0.9rem;
  }

  .back-button {
    font-size: 1rem;
    font-weight: 800;
    transition: all 0.4s ease;

    &:hover {
      text-shadow: 0px 0px 20px #ffbb98;
      animation: backAnimation 1s infinite ease-in-out;
    }
  }

  @keyframes backAnimation {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(-10px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
