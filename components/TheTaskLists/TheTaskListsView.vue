<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue-sonner'

  import DeleteIcon from '../assets/icons/deleteIcon.svg'
  import CompleteIcon from '../assets/icons/completeIcon.svg'
  import EditIcon from '../assets/icons/editIcon.svg'
  import CrossIcon from '../assets/icons/crossIcon.svg'
  import DraggableIcon from '../assets/icons/draggableIcon.svg'
  import draggable from 'vuedraggable'

  import { useTransitions } from '../../composables/useTransitions'
  import { TaskList, useTasksLists } from '../../composables/useTasksLists'

  import TheSuggestedTagsComponent from './TheSuggestedTagsComponent.vue'
  import TheNewListForm from './TheNewListFormComponent.vue'
  import TheEmptyListMessageComponent from './TheEmptyListMessageComponent.vue'

  let editName = ref<string>('')

  const router = useRouter()
  const lists = useTasksLists()

  let taskListArray = computed({
    get: () => Object.values(lists.taskList),
    set: (newArray) => {
      const newTaskList: Record<string, TaskList> = {}
      newArray.forEach((list) => {
        newTaskList[list.id] = list
      })
      lists.taskList = newTaskList
    },
  })

  const { beforeEnter, enter, leave } = useTransitions()

  const navigateToList = (listId: string) => {
    router.push(`/list/${listId}`)
  }

  const startListEditing = (list: TaskList) => {
    editName.value = list.name
    toggleEditMode(list)
  }

  const saveListEdits = (list: TaskList) => {
    taskListArray.value = taskListArray.value.map((item: TaskList) =>
      item.id === list.id
        ? {
            ...item,
            name: editName.value,
            editMode: false,
          }
        : item,
    )
  }

  const toggleEditMode = (list: TaskList) => {
    taskListArray.value = taskListArray.value.map((item: TaskList) =>
      item.id !== list.id ? item : { ...item, editMode: !item.editMode },
    )
  }

  const deleteList = (id: string) => {
    taskListArray.value = taskListArray.value.filter(
      (list: TaskList) => list.id !== id,
    )

    toast.success('List deleted.')
  }

  const reorderLists = (newOrder: TaskList[]) => {
    taskListArray.value = [...newOrder]
  }
</script>

<template>
  <TheGreeting />
  <Toaster
    position="top-center"
    :toastOptions="{
      class: 'my-toast',
    }"
  />
  <h1>My lists</h1>

  <TheNewListForm />

  <TheEmptyListMessageComponent :taskListArray="taskListArray" />

  <TheSuggestedTagsComponent :taskListArray="taskListArray" />

  <section>
    <div class="task-list" role="list" aria-label="Task lists">
      <draggable
        v-model="taskListArray"
        group="lists"
        handle=".drag-handle"
        animation="200"
        ghost-class="dragging"
        item-key="id"
        @update:modelValue="reorderLists"
        v-auto-animate
      >
        <template #item="{ element }">
          <ul>
            <li
              class="item"
              :key="element.id"
              :style="{
                backgroundColor:
                  !element.completed || element.editMode
                    ? element.bgColor
                    : '#fafafa',
              }"
              :class="{
                link: !element.editMode,
                itemEditmode: element.editMode,
                completed: element.completed && !element.editMode,
              }"
              role="link"
              tabindex="0"
              @click.stop="navigateToList(element.id)"
              @keydown.enter.stop="navigateToList(element.id)"
              :aria-label="'Navigate to task list ' + element.name"
            >
              <div class="item-readonly" v-if="!element.editMode">
                <DraggableIcon class="drag-handle" aria-label="Drag list" />
                <div class="task-content">
                  <div class="task-header">
                    <span>{{ element.name }}</span>

                    <div
                      class="task-buttons"
                      role="group"
                      aria-label="List actions"
                    >
                      <button
                        @click.stop="startListEditing(element)"
                        @keydown.enter.stop="startListEditing(element)"
                        :aria-label="'Edit list ' + element.name"
                      >
                        <EditIcon class="icon" />
                      </button>
                      <button
                        @click.stop="deleteList(element.id)"
                        @keydown.enter.stop="deleteList(element.id)"
                        :aria-label="'Delete list ' + element.name"
                      >
                        <DeleteIcon class="icon" />
                      </button>
                    </div>
                  </div>
                  <p v-if="element.description !== ''">
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
                    @submit.prevent.stop="saveListEdits(element)"
                    @click.stop
                    @keydown.stop
                    class="edit-form"
                    :key="element.id"
                    aria-labelledby="'Edit list ' + element.name"
                  >
                    <p>Editing list...</p>

                    <label for="edit-list-name" class="sr-only">
                      Edit List Name
                    </label>
                    <input
                      id="edit-list-name"
                      type="text"
                      v-model="editName"
                      aria-label="Edit the name of the list"
                    />

                    <div class="control-buttons">
                      <button
                        class="cancel-button"
                        @click.prevent.stop="startListEditing(element)"
                        aria-label="Cancel editing the list"
                      >
                        <CrossIcon /> Cancel
                      </button>
                      <button
                        class="save-button"
                        type="submit"
                        aria-label="Save changes to the list"
                      >
                        <CompleteIcon /> Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </transition>
            </li>
          </ul>
        </template>
      </draggable>
    </div>
  </section>
</template>

<style scoped>
  .task-list {
    margin-top: 20px;

    & .item {
      display: flex;
      flex-direction: column;
      padding: 18px;
      border-radius: 8px;
      margin-bottom: 10px;
      max-width: 600px;
      transition: all 0.3s ease;
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
        cursor: auto;

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

  & .link:hover {
    scale: 1.03;
    cursor: pointer;
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

  .my-toast {
    padding: 8px;
  }

  ol[data-sonner-toaster] {
    --width: 150px !important;
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
</style>
