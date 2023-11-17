<template>
  <v-sheet
    class="d-flex justify-center align-center transparent"
    color="primary"
    style="height: 340px"
  >
    <v-col cols="4" class="d-flex justify-center align-center">
      <div>
        <p>Contact</p>
      </div>
    </v-col>
    <v-divider
      color="white"
      length="230"
      class="d-flex align-center justify-center mt-12"
      inset
      vertical
    ></v-divider>
    <v-col cols="4" class="d-flex justify-center align-center">
      <div>
        <p>Support</p>
      </div></v-col
    >
    <v-divider
      color="white"
      length="230"
      class="d-flex align-center justify-center mt-12"
      inset
      vertical
    ></v-divider>
    <v-col cols="4" class="d-flex justify-center align-center">
      <div>
        <p>Connect</p>
      </div></v-col
    >
  </v-sheet>
</template>
<script setup>
import { ref, computed } from "vue";
</script>
