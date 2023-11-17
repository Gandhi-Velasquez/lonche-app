<template>
    <v-sheet class="d-flex justify-center align-center h-screen">
      <div>
        <h1 v-if="loading && !isError">{{ message }}</h1>
        <h1 v-if="!loading && !isError">{{ message }}</h1>
        <v-card 
            v-else-if="isError"
            :class="isMobile ? '' : 'shadow-error'"
            :width="isMobile ? 'auto' : '440'"
            :elevation="isMobile ? 0 : null"
        >
            <v-card-text class="text-center">
                <div class="error-icon mt-4 mb-2">&#10007;</div>
                <p class="font-weight-medium text-h5 my-4">{{ message }}</p>
                <v-btn class="text-capitalize mt-4 mb-4" color="primary" variant="text">Back to home page</v-btn>
            </v-card-text>
        </v-card>
      </div>
    </v-sheet>
  </template>
  
<script setup>
import { ref, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import router from "@/router/router";
import { useSignUpStore } from "../../stores/SignUpStore.js";

const signUpStore = useSignUpStore();
const loading = ref(true);
const message = ref('Verifying account!');
const isError = ref(false)

const { width, mobile } = useDisplay();

const isMobile = computed(() => {
  return width.value <= 960 ? mobile.value : false;
});

onMounted(async () => {
  const payload = router.currentRoute.value.query;
  if (payload.code && payload.profileId) {
    try {
          console.log('Verifying Account in Progress')
          let r = await signUpStore.validateVerification(payload)
          if (r.isVerified) {
                loading.value = false
                message.value = r.text

                setTimeout(() => {
                    router.push("/app");
                }, 2000);
          } else {
            message.value = r.text;
            isError.value = true;
            loading.value = false;
          }
      } catch (e) {
          message.value = r.text;
          isError.value = true
          loading.value = false;
    }
  } else {
        message.value = r.text;
        isError.value = true
        loading.value = false;
  }
});
</script>
<style scoped>
.shadow-error {
  border-radius: 10px;
  box-shadow: rgba(160, 160, 165, 0.2) 0px 0px 30px;
}

.error-icon {
  display: inline-block;
  width: 60px; 
  height: 60px; 
  background-color: rgb(212, 0, 0);
  border-radius: 50%;
  color: white;
  font-size: 40px; 
  text-align: center;
  line-height: 60px;
}

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

h1 {
  display: inline-block;
  animation: wave 1s infinite;
}
</style>
  