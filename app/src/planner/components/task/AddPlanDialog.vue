<template>
    <v-card :elevation="0" style="border-radius: 15px;">
      <v-card-title><p class="text-h5 mt-2">New Plan</p></v-card-title>
      <v-card-text>
        <p>Title:</p>
        <v-text-field
          v-model="newPlan.title"
          placeholder="Add task name."
          variant="outlined"
        ></v-text-field>
        <p>Description:</p>
        <v-textarea
          v-model="newPlan.description"
          variant="outlined"
          placeholder="Write a description..."
          auto-grow
          rows="4"
          row-height="30"
          shaped
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="mb-1">
        <v-spacer></v-spacer>
        <v-btn
          class="text-capitalize mr-1"
          variant="outlined"
          color="secondary"
          size="large"
          rounded
          @click="cancel"
          >Cancel</v-btn
        >
        <v-btn
          color="secondary"
          variant="flat"
          rounded
          size="large"
          class="text-capitalize mr-4"
          :loading="loading"
          :disabled="!newPlan.title"
          @click="add"
        >
          <p class="text-white">Add</p>
        </v-btn>
      </v-card-actions>
    </v-card>
</template>
<script setup>
import { onMounted, defineComponent, ref, computed } from "vue";
defineComponent({
  name: "AddTaskDialog",
});
const emit = defineEmits(["add", "cancel"]);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const newPlan = ref({
  title: "",
  description: "",
});

const borderedCard = computed(() => {
  let mobile = props.isMobile;
  return mobile ? null : "border-radius: 15px;";
});

const add = () => {
  return emit("add", newPlan);
};

const cancel = () => {
  newPlan.value = {
    title: "",
    description: "",
  }
  return emit("cancel");
};
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
  outline: 3px solid #009ed7;
}
</style>
