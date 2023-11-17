<template>
  <v-sheet
    class="d-flex justify-center transparent background"
    style="padding-top: 1.75rem; height: 100vh;"
  >
    <v-row class="d-flex flex-column" no-gutters>
      <v-col class="py-0 d-flex justify-center" cols="12">
        <v-card class="pb-0" :elevation="0" :width="isMobile ? 'auto' : '440'">
          <v-card-title
            class="d-flex"
            @click="goTo('')"
            style="cursor: pointer"
          >
            <v-icon class="mr-1" size="large" color="primary"
              >mdi-basket</v-icon
            >
            <v-app-bar-title
              class="text-black font-weight-medium text-h5 mt-1 mb-2"
            >
              Lonche</v-app-bar-title
            >
          </v-card-title>
          <v-card-text class="pb-0 pt-4">
            <div class="text-h3 mt-8 mb-4">Log In</div>
            <p class="mt-4 text-h6">Log In with your preferred method.</p>
            <v-form v-model="form" @submit.prevent="initiateLogin" class="mt-8">
              <p class="text-body-2">Email</p>
              <v-text-field
                v-model="loginInputs.email"
                type="email"
                :rules="[required]"
                color="primary"
                class="mb-0"
                variant="outlined"
                clearable
                single-line
                label="email@example.com"
              ></v-text-field>

              <p class="text-body-2 pt-0">Password</p>
              <v-text-field
                v-model="loginInputs.password"
                :type="passwordType"
                :rules="[required]"
                color="primary"
                variant="outlined"
                clearable
                single-line
                label="min. 8 characters"
                :append-icon="passwordIconType"
                @click:append="toggleShowPassword"
              ></v-text-field>
            </v-form>
            <v-btn
              :disabled="!form"
              :loading="loading"
              block
              :color="!form ? undefined : 'secondary'"
              :elevation="0"
              size="large"
              type="submit"
              variant="elevated"
              class="text-capitalize mt-4 login-btn"
              @click="initiateLogin"
            >
              <p :class="!form ? 'text-gray' : 'text-white'">Log In</p>
            </v-btn>
            <p class="d-flex justify-center mt-1 text-h6 text-medium-emphasis">
              or
            </p>
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-btn
                  v-bind="props"
                  :color="isHovering ? 'secondary' : undefined"
                  :loading="loginWithGoogle"
                  flat
                  block
                  variant="outlined"
                  size="large"
                  type="submit"
                  class="text-capitalize mt-0 login-btn"
                >
                  Log In With Google
                </v-btn>
              </template>
            </v-hover>
            <br />
          </v-card-text>
          <v-card-actions class="d-flex justify-center pt-4 pb-0 mb-0">
            <div class="d-flex flex-column justify-center align-center">
              <p class="text-body-2 mt-0 mb-2 text-secondary">
                Forgot Password
              </p>
              <p class="text-body-2 mb-4">
                Don't have an account?
                <a
                  class="text-secondary"
                  @click="goTo('sign-up')"
                  style="cursor: pointer"
                  >Sing up</a
                >
              </p>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import router from "@/router/router";
import { useLoginStore } from "../../stores/LoginStore.js";

const { width, mobile } = useDisplay();

const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const loginStore = useLoginStore();

const initiateLogin = async () => {
  if (!form.value) return;
  loading.value = true;
  const r = await loginStore.loginWithEmail(loginInputs.value);
  if (!r.status) return;
  console.log(r.message);
  loading.value = false;
  router.push("/app")
};

const form = ref(false);

const required = (v) => {
  return !!v || "Field is required";
};

const loading = ref(false);

const loginWithGoogle = ref(false);

const loginInputs = ref({ email: null, password: null });

const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const passwordType = computed(() => {
  return showPassword.value ? "text" : "password";
});

const passwordIconType = computed(() => {
  return showPassword.value ? "mdi-eye-off" : "mdi-eye";
});

const getPath = (item) => {
  if (!item.path) return `/${item}`;
  return `/${item.path}`;
};

const goTo = async (item) => {
  let path = getPath(item);
  router.push(path);
};
</script>
<style scoped>
a {
  text-decoration: none !important;
}
.login-btn {
  height: 55px;
  width: 50px;
}
</style>
