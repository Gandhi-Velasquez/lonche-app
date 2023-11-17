<template>
  <v-sheet
    class="mt-8 d-block justify-center align-center transparent"
    style="height: 840px"
  >
    <v-row class="d-flex justify-center align-center pt-16 px-8 mx-8">
      <v-col cols="12" class="d-flex justify-center align-center">
        <div class="d-block justify-cente align-center">
          <p class="text-center text-h6 mb-4">The Online Experience Manager</p>
          <p class="text-center text-h4 mb-4">
            Serving you from beginning to success.
          </p>
          <p class="text-center text-h6">
            Lonche gives 24/7 tools full-access to best support owners and teams
            <br />
            need for success in every area of their business.
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="d-flex justify-center align-center pt-16 px-8 mx-8">
      <v-col cols="12" class="d-flex justify-center align-center mx-auto">
        <template v-for="service in servicesList">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-card
              :key="service.id"
              width="385"
              height="315"
              color="#D95980"
              class="mx-4"
              style="border-radius: 5%"
              v-bind="props"
              :elevation="isHovering ? 4 : 0"
            >
              <v-card-text>
                <div class="d-flex justify-center align-center pt-4 mt-8 mb-8">
                  <v-icon :size="65" color="white">
                    {{ service.icon }}
                  </v-icon>
                </div>
                <p class="text-h4 text-white text-center mt-4">
                  {{ service.title }}
                </p>
                <p class="text-h6 text-white text-center mt-2">
                  {{ service.text }}
                </p>
              </v-card-text>
            </v-card>
          </v-hover>
        </template>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";

const servicesList = ref([
  {
    title: "Stand Out",
    icon: "mdi-star",
    text: "An online experience to catch people’s attention.",
    id: "stand-out",
  },
  {
    title: "Operate",
    icon: "mdi-note",
    text: "Take your business to the direction you want it to go.",
    id: "operate",
  },
  {
    title: "Sell",
    icon: "mdi-cart",
    text: "Online ordering 24/7 just how we like it, commission-free.",
    id: "sell",
  },
]);
</script>
