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
          link
          :key="i"
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

const { width, mobile } = useDisplay();

const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const widthStyle = computed(() => {
  let w = width.value * 0.8
  return isMobile.value ? w : '280';
});

const loginStore = useLoginStore();
const appMainStore = useAppMainStore()

const drawer = ref(true);

const getTabPath = (item) => {
  return `/app/${item.path}`
}

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

const addingPlan = ref({
  loading: false,
  added: false,
});

const updatingTask = ref({
  loading: false,
  added: false,
});

const deletingTask = ref({
  loading: false,
  deleted: false,
});

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
