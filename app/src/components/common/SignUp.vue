<template>
  <!-- <v-alert
      v-model="signingUp.error"
      type="error"
      title="Alert title"
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!"
      variant="tonal"
  ></v-alert> -->
  <v-sheet class="d-flex justify-center h-screen pt-2" transparent>
    <v-row
      v-if="!verificationSent"
      no-gutters
      class="justify-center align-center mx-auto pt-0"
      :class="isMobile ? 'd-block' : 'd-flex'"
    >
      <v-col
        sm="12"
        md="6"
        :order="isMobile ? '1' : '6'"
        class="d-flex justify-center align-center"
      >
        <v-card
          :class="isMobile ? '' : 'shadow'"
          :width="isMobile ? 'auto' : '440'"
          :elevation="isMobile ? 0 : null"
        >
          <v-card-title
            class="d-flex pt-4"
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
          <v-card-text>
            <p class="text-h3 mt-4">Get started now</p>
            <v-form v-model="form" @submit.prevent="onSubmit" class="mt-8 mb-0">
              <p class="text-body-2">First Name</p>
              <v-text-field
                type="text"
                v-model="newUser.firstname"
                color="primary"
                class="mb-2"
                variant="outlined"
                clearable
                single-line
                autocomplete="null"
              ></v-text-field>
              <p class="text-body-2">Last Name</p>
              <v-text-field
                type="text"
                v-model="newUser.lastname"
                color="primary"
                class="mb-2"
                variant="outlined"
                clearable
                single-line
                autocomplete="null"
              ></v-text-field>
              <p class="text-body-2">Email</p>
              <v-text-field
                v-model="newUser.email"
                type="email"
                :rules="[required]"
                color="primary"
                class="mb-2"
                variant="outlined"
                clearable
                single-line
                label="email@example.com"
              ></v-text-field>
              <p class="text-body-2">Password</p>
              <v-text-field
                v-model="newUser.password"
                :type="passwordType"
                :rules="[required]"
                color="primary"
                class="mb-2"
                variant="outlined"
                clearable
                single-line
                label="minimun 8 characters"
                :append-icon="passwordIconType"
                @click:append="toggleShowPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions
            class="d-flex flex-column justify-center align-center mb-8 mx-2"
          >
            <v-btn
              :disabled="!form"
              :loading="signingUp.loading"
              block
              :color="!form ? undefined : 'secondary'"
              :elevation="0"
              size="large"
              type="submit"
              variant="elevated"
              class="text-capitalize mt-4 login-btn"
              @click="initiateSignUp"
            >
              <p :class="!form ? 'text-gray' : 'text-white'">Sign Up</p>
            </v-btn>
            <!-- This is the code for the later when google auth is enabled! -->
            <!-- <p class="d-flex justify-center my-1 text-h6 text-medium-emphasis">
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
            </v-hover> -->
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        v-if="!isMobile"
        sm="12"
        md="6"
        class="d-flex justify-center align-center"
        :class="{ 'mt-8': isMobile }"
      >
        <div class="mx-2">
          <p class="text-center text-h3">
            A better way <p class="text-primary font-weight-bold">TO-DATE</p> and plan your date.
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row 
      v-else
      no-gutters
      class="d-flex justify-center align-center mx-auto pt-0"
    >
      <v-card 
        :class="isMobile ? '' : 'shadow-success'"
        :width="isMobile ? 'auto' : '440'"
        :elevation="isMobile ? 0 : null"
      >
        <v-card-text class="text-center">
          <div class="success-icon mt-4">&#10003;</div>
          <p class="font-weight-medium text-h5 my-4">Verification email sent! Please proceed and check your email.</p>
          <!-- <v-btn class="text-capitalize mt-4 mb-4" color="primary" variant="text">Resend Email</v-btn> -->
        </v-card-text>
      </v-card>
    </v-row>
    <v-snackbar v-model="signingUp.error" variant="tonal" color="error" timeout="5000">
      <div class="d-flex align-center">
        <p class="text-body-1 ml-2">{{ signingUp.message }}</p>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="signingUp.error = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import router from "@/router/router";
import * as validator from "@/utils/validator.js";
import { useSignUpStore } from "../../stores/SignUpStore.js";

const signUpStore = useSignUpStore();

const { width, mobile } = useDisplay();

const onSubmit = () => {
  console.log("Form Submitted!");
};

const form = ref(true);

const showPassword = ref(false);

const isMobile = computed(() => {
  return width.value <= 960 ? mobile.value : false;
});

const getPath = (item) => {
  if (!item.path) return `/${item}`;
  return `/${item.path}`;
};

const goTo = async (item) => {
  let path = getPath(item);
  router.push(path);
};

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: ""
});

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const passwordType = computed(() => {
  return showPassword.value ? "text" : "password";
});

const passwordIconType = computed(() => {
  return showPassword.value ? "mdi-eye-off" : "mdi-eye";
});

const required = (v) => {
  return !!v || "Field is required";
};

const signingUp = ref({
  loading: false,
  error: false,
  message: ''
});

const initiateSignUp = async () => {
  if (!form.value) {
    blankFormError();
    return;
  }
  try {
    signingUp.value.loading = true;
    let payload = { userData: {}, action: "sign-up" };
    payload.userData = newUser.value;
    let validatedEmail = validator.email(newUser.value.email);
    if (validatedEmail.result) {
      payload.userData.email = validatedEmail.value;
    } else {
      signingUp.value.error = true;
      signingUp.value.loading = false;
      signingUp.value.message = 'Invalid Email';
      return;
    }
    let r = await signUpStore.signUpWithEmail(payload);
    if (r.emailInUse) {
      signingUp.value.loading = false;
      signingUp.value.error = true;
      signingUp.value.message = r.errorMessage
    }
    if (r.isSignedUp) signingUp.value.loading = false;

    if (r.isVerified) {
      router.push('/app')
    }
  } catch(e) {
    console.error(e)
  }
};

const verificationSent = computed(() => {
  return signUpStore.verificationSent;
});

const loginWithGoogle = ref(false);
</script>
<style scoped>
.login-btn {
  height: 55px;
  width: 50px;
}

.shadow {
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 50px 40px;
}

.shadow-success {
  border-radius: 10px;
  box-shadow: rgba(160, 160, 165, 0.2) 0px 0px 30px;
}

.success-icon {
  display: inline-block;
  width: 60px; 
  height: 60px; 
  background-color: rgb(22, 223, 119);
  border-radius: 50%;
  color: white;
  font-size: 40px; 
  text-align: center;
  line-height: 60px;
}
</style>
