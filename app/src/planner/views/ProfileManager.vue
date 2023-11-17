<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="mt-4 mb-6">Your Profile</h2>
        </v-col>
      </v-row>
    </v-container>
</template>
<script setup>
import { useAppMainStore } from '../stores';
import { ref, computed } from "vue";
import router from "@/router/router";

const appMainStore = useAppMainStore()

</script>