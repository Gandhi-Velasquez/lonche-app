<template>
  <v-app id="app">
    <LandingNavbar
      v-if="isHomePage"
      :is-mobile="isMobile"
      @go-to="goTo($event)"
      @scroll-to="scrollTo($event)"
      @toggle-drawer="toggleDrawer()"
    ></LandingNavbar>

    <v-navigation-drawer
      app
      v-model="drawer"
      v-if="isMobile"
      location="top"
      color="background"
    >
      <div
        v-if="isMobile"
        class="d-flex flex-column justify-center align-center"
      >
        <div class="d-flex flex-column justify-end">
          <v-btn
            color="secondary"
            variant="outlined"
            size="large"
            class="text-capitalize text-black my-4 cta-btn"
            @click="goTo('login')"
          >
            Log In
          </v-btn>
          <v-btn
            color="secondary"
            :elevation="0"
            size="large"
            class="text-capitalize my-2 cta-btn"
            rounded
            @click="goTo('sign-up')"
          >
            Sign Up
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main id="main">
      <v-container fluid style="padding: 0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { RouterView, useRoute } from "vue-router";
import router from "./router/router";
import LandingNavbar from "./components/common/LandingNavbar.vue";

const { width, mobile } = useDisplay();
const drawer = ref(false);

const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const navItems = computed(() => {
  let list = [];
  return list;
});

const isHomePage = computed(() => {
  let route = useRoute();
  return route.name === "Home";
});

const getPath = (item) => {
  if (!item.path) return `/${item}`;
  return `/${item.path}`;
};

const goTo = (item) => {
  let path = getPath(item);
  router.push(path);
};

const scrollTo = async (section) => {
  if (section === "") return scrollToTop();
};

const scrollToTop = () => {
  return window.scrollTo({ top: 0, behavior: "smooth" });
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>
<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Nunito", sans-serif;
}

#nav {
  padding: 30px;
}

.cta-btn {
  width: 260px;
}
</style>
