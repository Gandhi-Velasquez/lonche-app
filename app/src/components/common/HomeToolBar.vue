<template>
  <v-app-bar
    app
    color="white"
    :class="isMobile ? 'px-4' : 'px-16'"
    scroll-behavior="elevate"
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
      <v-app-bar-nav-icon v-else @click="toggleDrawer()"></v-app-bar-nav-icon>
    </v-layout>
  </v-app-bar>
</template>
<script setup>
import { defineComponent, ref, computed } from "vue";
defineComponent({
  name: "HomeToolBar",
});

const emit = defineEmits(["goTo", "doLogin", "scrollTo", "toggleDrawer"]);

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
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
