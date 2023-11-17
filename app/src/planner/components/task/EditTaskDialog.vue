<template>
  <v-sheet :style="borderedCard">
    <v-card :elevation="0">
      <v-card-title class="mt-4">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <div
              v-bind="props"
              :class="isHovering ? 'mx-1 title-select' : 'mx-1'"
            >
              <input
                class="text-input"
                :class="isMobile ? 'text-h4' : 'text-h5'"
                name="title"
                type="text"
                v-model="selectedTask.data.title"
              />
            </div>
          </template>
        </v-hover>
        <div class="d-flex mt-1">
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize"
            size="small"
            color="error"
            variant="tonal"
            prepend-icon="mdi-delete"
            :loading="deletingLoading"
            @click="confirmDeleteTask"
          >
            Delete
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text class="mt-2">
        <p>Description:</p>
        <v-textarea
          v-model="selectedTask.data.description"
          variant="outlined"
          placeholder="Write a description..."
          auto-grow
          rows="4"
          row-height="30"
          shaped
        ></v-textarea>
        <p>Group:</p>
        <v-select
          v-model="selectedGroup"
          :items="taskGroups"
          item-title="name"
          item-value="id"
          placeholder="Select a group."
          variant="outlined"
        >
          <template v-slot:selection="{ item }">
            <v-chip :color="getColor(item)">
              <span>{{ item.title }}</span>
            </v-chip>
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions class="mb-1">
        <v-spacer></v-spacer>
        <v-btn
          @click="cancel"
          class="text-capitalize mr-1"
          variant="outlined"
          color="secondary"
          size="large"
          >Cancel</v-btn
        >
        <v-btn
          @click="update"
          class="text-capitalize mr-4"
          color="secondary"
          variant="flat"
          :loading="updatingLoading"
          size="large"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="confirmDeleteDialog"
      max-width="450"
      transition="dialog-bottom-transition"
      persistent>
      <v-card class="py-2">
        <v-card-title class="text-h5">Are you sure?</v-card-title>
        <v-card-text class="px-4 py-0">
          <p>This action can't be undone.</p>
        </v-card-text>
        <v-card-actions class="mb-2 mt-4 d-flex align-center justify-center">
        <v-btn
          class="text-capitalize"
          variant="flat"
          color="secondary"
          size="large"
          @click="closeConfirmDelete()"
          >Cancel</v-btn
        >
        <v-btn
          class="text-capitalize"
          color="error"
          variant="flat"
          size="large"
          @click="doDeleteTask"
        >
          Delete Task
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
<script setup>
import { onMounted, defineComponent, ref, computed } from "vue";
defineComponent({
  name: "EditTaskDialog",
});
const emit = defineEmits(["cancel", "update", "delete"]);

const props = defineProps({
  task: {
    type: Object,
    default() {
      return {};
    },
  },
  taskGroups: {
    type: Array,
    default: [],
  },
  updatingLoading: {
    type: Boolean,
    default: false,
  },
  deletingLoading: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const confirmDeleteDialog = ref(false)

const cancel = () => {
  return emit("cancel");
};

const update = () => {
  return emit("update");
};

const confirmDeleteTask = () => {
  confirmDeleteDialog.value = true
};

const closeConfirmDelete = () => {
  confirmDeleteDialog.value = false
};

const doDeleteTask = () => {
  confirmDeleteDialog.value = false
  return deleteTask()
};

const deleteTask = () => {
  return emit("delete");
};

const selectedTask = props.task;

const selectedGroup = computed({
  get() {
    return selectedTask.data.group;
  },
  set(value) {
    let g = getGroup(value);
    selectedTask.data.group = g;
  },
});

const getGroup = (group) => {
  let groups = props.taskGroups;
  let g;
  for (let i = 0; i < groups.length; i++) {
    let gp = groups[i];
    if (gp.id === group) {
      g = gp;
      break;
    }
    continue;
  }
  return g;
};

const getColor = (item) => {
  if (!item.color) return item.raw.color;
  return item.color;
};

const borderedCard = computed(() => {
  let mobile = props.isMobile;
  return mobile ? null : "border-radius: 15px;";
});
</script>
<style scoped>
.title-select {
  border-radius: 2px;
  outline: solid;
  outline-color: #9acde0;
}

.text-input {
  width: 100%;
  border-radius: 2px;
  padding-left: 2px;
}

input[type="text"]:focus {
  outline: 3px solid #9acde0; /* oranges! yey */
}
</style>
