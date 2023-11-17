<template>
  <v-app>
    <v-navigation-drawer 
      app
      v-model="drawer" 
      :temporary="isMobile" 
      :permanent="!isMobile" 
      :width="widthStyle"
    >
    <div class="d-flex align-center justify-center" style="height: 64px">
      <div class="d-flex align-center justify-center">
        <v-icon class="mr-2" size="large" color="secondary">mdi-basket</v-icon>
        <div>
          <h1>Lonche</h1>
        </div>
      </div>
    </div>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="(item, i) in allNav"
          :key="i"
          link 
          color="secondary"
          rounded="shaped"
          class="mx-2 my-2"
          :to="getTabPath(item)"
        >
          <template v-slot:prepend>
            <v-icon class="mx-0" :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title class="mr-2 text-body-1 font-weight-medium" v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="0" prominent>
      <v-app-bar-nav-icon
        v-if="isMobile"
        :icon="drawer ? 'mdi-close' : 'mdi-menu'"
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn variant="text">
        <v-icon>mdi-dots-vertical</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ userFullname }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="doLogout">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>
    <!--  -->
    <v-main id="main-app">
      <v-container fluid>
        <router-view v-if="!appMainStore.loading"/>
      
        <div class="d-flex justify-center align-center" v-if="appMainStore.loading">
          <h2 class="mt-16">Loading...</h2>
        </div>
      </v-container>
    </v-main>
    <!--  -->
    <v-dialog
      v-model="addPlanDialog"
      width="400"
      transition="dialog-bottom-transition"
      persistent
      :fullscreen="isMobile"
    >
      <AddPlanComponent
        :is-mobile="isMobile"
        :loading="addingPlan.loading"
        @cancel="cancelAddPlan"
        @add="doAddPlan($event)"
      >
      </AddPlanComponent>
    </v-dialog>
    <v-dialog
      v-model="editTaskDialog"
      width="400"
      transition="dialog-bottom-transition"
      persistent
      :fullscreen="isMobile"
    >
      <EditTaskComponent
        :task="selectedTask"
        :task-groups="null"
        :is-mobile="isMobile"
        :updating-loading="updatingTask.loading"
        :deleting-loading="deletingTask.loading"
        @cancel="cancelEditTask"
        @update="updateTask(selectedTask, 'update')"
        @delete="doDeleteTask(selectedTask)"
      ></EditTaskComponent>
    </v-dialog>
    <v-snackbar v-model="addingPlan.added" color="success" timeout="3000">
      <div class="d-flex align-center">
        <v-icon>mdi-check-circle</v-icon>
        <p class="text-body-1 ml-2">Task added!</p>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="addingPlan.added = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="updatingTask.added" color="success" timeout="3000">
      <div class="d-flex align-center">
        <v-icon>mdi-check-circle</v-icon>
        <p class="text-body-1 ml-2">Task updated succesfully!</p>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="updatingTask.added = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="deletingTask.deleted" color="error" timeout="3000">
      <div class="d-flex align-center">
        <v-icon>mdi-delete</v-icon>
        <p class="text-body-1 ml-2">Task deleted.</p>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="deletingTask.deleted = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import router from "@/router/router";
import { usePlanStore } from "./stores/planStore.js";
import { useLoginStore } from "../stores/LoginStore";
import { useAppMainStore} from "./stores/index.js";
import { useMainStore } from "../stores/Store";
import { useDisplay } from "vuetify";
import { RouterView } from "vue-router";
import EditTaskComponent from "@/planner/components/task/EditTaskDialog.vue";
import AddPlanComponent from "@/planner/components/task/addPlanDialog.vue";

const { width, mobile } = useDisplay();

const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const widthStyle = computed(() => {
  let w = width.value * 0.8
  return isMobile.value ? w : '300';
});

const selectedPlan = ref({
  id: '',
  data: {}
});

const hasPlan = computed(() => {
  return selectedPlan.value.id === '' ? false : true;
});

const planStore = usePlanStore();
const loginStore = useLoginStore();
const appMainStore = useAppMainStore()

const breadcrumbs = computed(() => {
  return appMainStore.breadcrumbs
})

const drawer = ref(true);

const getTabPath = (item) => {
  //appMainStore.setBreadcrumbs(item.title, true)
  return `/app/${item.path}`
}

const addPlanDialog = ref(false);

const allNav = ref([
  {
    path: 'plans',
    title: 'Plans',
    icon: 'mdi-format-list-bulleted'
  },
  {
    path: 'profile',
    title: 'Profile Settings',
    icon: 'mdi-cog-outline'
  },
]);

const openTaskDialog = () => {
  addPlanDialog.value = true;
};

const addingPlan = ref({
  loading: false,
  added: false,
});

const cancelAddPlan = () => {
  addPlanDialog.value = false;
};

const doAddPlan = async (newPlan) => {
  addingPlan.value.loading = true;
  let plan = {};
  if (newPlan.value.title !== "") plan.title = newPlan.value.title;
  plan.description = newPlan.value.description;
  let r = await planStore.addPlan(plan);
  if (r.status === "added") {
    addingPlan.value.loading = false;
    addPlanDialog.value = false;
    addingPlan.value.added = true;
  }
};

const editTaskDialog = ref(false);

const selectedTask = ref({});

const editTask = (task) => {
  selectedTask.value = task;
  editTaskDialog.value = true;
};

const cancelEditTask = () => {
  editTaskDialog.value = false;
};

// const updateTask = async (item, action) => {
//   updatingTask.value.loading = true;
//   let r = await taskStore.updateTask(item.id, action);
//   if (r.status === "updated") {
//     updatingTask.value.loading = false;
//     editTaskDialog.value = false;
//     updatingTask.value.added = true;
//   }
// };

const updatingTask = ref({
  loading: false,
  added: false,
});

// const doDeleteTask = async (item) => {
//   deletingTask.value.loading = true;
//   let r = await taskStore.deleteTask(item.id);
//   if (r.status === "deleted") {
//     deletingTask.value.loading = false;
//     editTaskDialog.value = false;
//     deletingTask.value.deleted = true;
//   }
// };

const deletingTask = ref({
  loading: false,
  deleted: false,
});

//const processingAction = (item) => {
//  return (
//    updatingTask.value.processing[getProcessingKey(item)] ||
//    deletingTask.value.processing[getProcessingKey(item)]
//  );
//};
//
//const getProcessingKey = (item) => {
//  let key = item.id + "/" + item.data.title;
//  return key;
//};

// const setSelectedPlan = (plan) => {
//   if (isMobile.value) {
//     drawer.value = false
//   }
//   selectedPlan.value = plan
// }

const getSelectedTab = (item) => {
  console.log(item.path)
}

const doLogout = async () => {
  console.log('Login out')
  await loginStore.logOut()
}

const mainStore = useMainStore();

const userFullname = computed(() => {
  let fullname = mainStore.fullname || null
  return fullname
})

async function load() {
  await appMainStore.initialize();
  if (!appMainStore.currentUser) {
    router.push('/login');
  }
}

load();
</script>
<style scoped>

@keyframes wave {
  0%, 20%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

h2 {
  display: inline-block;
  animation: wave 1s infinite;
}
</style>
