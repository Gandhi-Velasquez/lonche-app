<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="pt-4 pb-6">Your Profile</h2>
        <div :class="isMobile ? 'pt-2' : 'mx-8 px-8'">
          <v-form @submit.prevent="updateProfile" class="mt-4">
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <p class="text-body-2 mb-2">First Name</p>
                <v-text-field
                  type="text"
                  v-model="formData.firstname"
                  color="primary"
                  class="mb-2"
                  variant="outlined"
                  single-line
                  autocomplete="null"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="text-body-2 mb-2">Last Name</p>
                <v-text-field
                  type="text"
                  v-model="formData.lastname"
                  color="primary"
                  class="mb-2"
                  variant="outlined"
                  single-line
                  autocomplete="null"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <div class="d-flex mb-2 align-center">
                  <p class="text-body-2 mr-2">Email</p>
                  <div class="custom-checkbox">
                    <v-icon class="custom-checkmark">mdi-check</v-icon>
                    <span class="custom-checkbox-label">Verified</span>
                  </div>
                </div>
                <v-text-field
                  type="text"
                  v-model="formData.email"
                  color="primary"
                  class="mb-2"
                  variant="outlined"
                  single-line
                  disabled
                  autocomplete="null"
                ></v-text-field>
              </v-col>
              <!-- <v-col v-if="formData.verified" cols="12" sm="6" class="d-flex align-center py-0">
                <div class="custom-checkbox">
                  <v-icon class="custom-checkmark">mdi-check</v-icon>
                  <span class="custom-checkbox-label">Verified</span>
                </div>
              </v-col> -->
              <v-col cols="12" class="d-flex">
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="secondary"
                  variant="elevated"
                  size="large"
                  class="text-capitalize my-2"
                  :elevation="0"
                  rounded
                >
                  <p class="text-white">Update Profile</p>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppMainStore } from '../stores';
import { useDisplay } from "vuetify";

const { width, mobile } = useDisplay();
const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const appMainStore = useAppMainStore();
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  verified: false,
});

onMounted(() => {
  const userProfile = appMainStore.profile;
  formData.value = {
    firstname: userProfile.firstname,
    lastname: userProfile.lastname,
    email: userProfile.email,
    verified: userProfile.verified,
  };
});

const updateProfile = () => {
  console.log(formData.value);
};
</script>
<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
}

.custom-checkmark {
  font-size: 14px;
  color: #ffffff; /* White color for the checkmark */
  background-color: #4caf50; /* Green color for the circle */
  border-radius: 50%;
  padding: 6px;
  margin-right: 2px; /* Adjust the margin for spacing */
}

.custom-checkbox-label {
  color: #4caf50; /* Green color for the label text */
  font-size: 12px;
}
</style>