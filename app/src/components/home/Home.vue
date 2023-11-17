<template>
  <v-sheet>
    <LandingSection />
  </v-sheet>
</template>
<script setup>
import { ref, computed } from "vue";
import LandingSection from "@/components/home/LandingSection.vue";
import ServicesSection from "@/components/home/ServicesSection.vue";
import BookingSection from "@/components/home/BookingSection.vue";
import Footer from "@/components/common/Footer.vue";
</script>
