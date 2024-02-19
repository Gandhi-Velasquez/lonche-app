<template>
  <v-container>
    <v-row class="mt-2" align="center">
        <v-btn icon="mdi-arrow-left" @click="goBack" variant="text"></v-btn>
        <h2>Details</h2>
    </v-row>
  </v-container>
</template>
<script setup>
import { usePlanStore } from "../../stores/planStore";
import { useAppMainStore } from "../../stores";
import { ref, computed } from "vue";
import router from "@/router/router";
import { useDisplay } from "vuetify";

const appMainStore = useAppMainStore()

const { width, mobile } = useDisplay();
const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const planId = computed(() => {
    return router.currentRoute.value.params.id || null
});

const goBack = () => {
  router.go(-1);
};
</script>
<style scoped>
</style>