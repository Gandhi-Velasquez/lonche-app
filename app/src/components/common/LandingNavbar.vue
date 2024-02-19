<template>
  <v-app-bar
    app
    color="white"
    :class="isMobile ? 'px-4' : 'px-16'"
    :elevation="0"
    fixed
    width="auto"
  >
    <v-layout
      class="d-flex align-center"
      :class="isMobile ? 'mx-0' : 'mx-16 px-8'"
    >
      <div
        class="d-flex align-center justify-center"
        style="cursor: pointer"
        @click="scrollTo('')"
      >
        <v-icon class="mr-1" size="x-large" color="secondary">mdi-basket</v-icon>
        <div class="text-secondary text-body-2 mt-1">
          <h1>Lonche</h1>
        </div>
      </div>
      <v-spacer></v-spacer>
      <div v-if="!isMobile" class="d-flex align-center">
        <div v-if="!isLoggedIn">
          <v-btn
            color="secondary"
            variant="text"
            class="text-capitalize mr-4"
            @click="goTo('login')"
          >
            Log In
          </v-btn>
          <v-btn
            color="secondary"
            variant="elevated"
            class="text-capitalize"
            :elevation="0"
            rounded
            @click="goTo('sign-up')"
          >
            <p class="text-white">Sign Up</p>
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            color="secondary"
            variant="elevated"
            class="text-capitalize"
            :elevation="0"
            rounded
            @click="goTo('app')"
          >
            <p class="text-white">Planner</p>
          </v-btn>
        </div>
      </div>
      <v-app-bar-nav-icon v-else @click="toggleDrawer()"></v-app-bar-nav-icon>
    </v-layout>
  </v-app-bar>
</template>
<script setup>
import { defineComponent, ref, computed, onMounted, watchEffect } from "vue";
import { useMainStore } from '@/stores/Store.js'
defineComponent({
  name: "LandingNavbar",
});

const emit = defineEmits(["goTo", "doLogin", "scrollTo", "toggleDrawer"]);

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const mainStore = useMainStore();

const isLoggedIn = computed(() => {
  return mainStore.isLoggedIn;
});

const goTo = (url) => {
  return emit("goTo", url);
};

const scrollTo = (event) => {
  return emit("scrollTo", event);
};

const toggleDrawer = () => {
  return emit("toggleDrawer");
};
</script>
