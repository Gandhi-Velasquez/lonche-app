<template>
  <v-sheet
    class="d-flex justify-center transparent"
    style="padding-top: 6rem"
  >
    <div class="d-flex flex-column justify-center align-center">
      <div
        class="d-flex flex-column justify-center align-center"
        style="padding-bottom: 2rem"
      >
        <p class="text-black text-center font-weight-bold text-h2 mb-8">
          Plan with ease, have fun<br />
          and be intentional.
        </p>
        <p class="text-black text-center text-h5 mb-8">
          The date planner that helps you plan <br />
          and enjoy your date night
        </p>
        <v-btn
          color="secondary"
          size="large"
          class="text-capitalize mt-2 cta-btn"
          rounded
          :elevation="0"
          @click="goTo('sign-up')"
        >
          <p class="text-white">Free Trial</p>
        </v-btn>
        <p class="text-body-2 text-medium-emphasis pt-4">
          Join the waitlist and try our app.
        </p>
      </div>
      <v-card
        class="d-flex justify-center align-center rounded-background"
        :elevation="0"
        :style="
          isMobile
            ? 'width: 350px; height: 300px'
            : 'width: 585px; height: 485px'
        "
      >
        <v-img
          :src="heroImage"
          aspect-ratio="16/9"
          :max-width="isMobile ? 350 : 585"
          :max-height="isMobile ? 300 : 485"
          cover
        ></v-img>
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import heroImage from "@/resources/Hero 1.png";
import { useDisplay } from "vuetify/lib/framework.mjs";
import router from "../../router/router";

const { width, mobile } = useDisplay();

const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const goTo = (item) => {
  let path = `/${item}`;
  router.push(path);
};
</script>
<style>
.rounded-background {
  background: white;
  border-radius: 5%;
}
.cta-btn {
  width: 260px;
}
</style>
