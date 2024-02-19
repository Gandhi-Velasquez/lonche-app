<template>
  <v-container>
    <v-row>
      <v-col :cols="isMobile ? '6' : '9'" class="d-flex align-center py-0">
        <h2 :class="isMobile ? '' : 'pt-4 pb-6'">Profile Settings</h2>
      </v-col>
      <v-col :cols="isMobile ? '6' : '3'" class="d-flex py-0" :class="isMobile ? 'justify-end' : 'justify-center'">
        <v-btn
            type="submit"
            color="secondary"
            variant="elevated"
            size="large"
            class="text-capitalize my-2"
            :elevation="0"
            rounded
          >
            <p class="text-white">Update</p>
        </v-btn>
      </v-col>
    </v-row>
    <v-row :class="isMobile ? '' : 'mr-8'">
      <v-col cols="12" class="over-list">
        <div :class="isMobile ? 'pt-2' : 'mx-8 px-8'">
          <p class="text-body-1 font-weight-bold pb-4">Your Personal Info</p>
          <v-form @submit.prevent="updateProfile" class="my-4">
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <p class="text-body-2 mb-2">First Name</p>
                <v-text-field
                  density="compact"
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
                  density="compact"
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
                  density="compact"
                  v-model="formData.email"
                  color="primary"
                  class="mb-2"
                  variant="outlined"
                  single-line
                  disabled
                  autocomplete="null"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <div>
            <ProfilePictureEditor
              :user="user"
            ></ProfilePictureEditor>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppMainStore } from '../stores';
import { useDisplay } from "vuetify";
import ProfilePictureEditor from "../components/profile/ProfilePictureEditor.vue";

const { width, mobile } = useDisplay();
const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const appMainStore = useAppMainStore();
const user = ref(null);
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  verified: false,
});
const activeTab = ref('personal');

onMounted(() => {
  const userProfile = appMainStore.profile;
  user.value = userProfile;
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

const handleTabChange = (tab) => {
  activeTab.value = tab;
};

const userDataChange = ref({});

const handleInputChange = (field, value) => {
  userDataChange.value[field] = value;
};

const handleImageChange = (newImage) => {
  console.log('New Image:', newImage);
};
</script>

<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
}

.custom-checkmark {
  font-size: 14px;
  color: #ffffff; 
  background-color: #4caf50;
  border-radius: 50%;
  padding: 6px;
  margin-right: 2px; 
}

.custom-checkbox-label {
  color: #4caf50; 
  font-size: 12px;
}

.over-list {
  height: 75vh;
  overflow-y: auto;
}
</style>
