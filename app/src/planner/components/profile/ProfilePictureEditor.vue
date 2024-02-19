<template>
  <p class="text-body-1 font-weight-bold pb-4">Your Profile Picture</p>
  <v-row class="d-flex align-center">
    <v-col>
      <v-avatar size="120" class="cursor-pointer bg-secondary">
        <v-img
          v-if="user && userPicture"
          :src="userPicture"
          alt="Profile"
          style="object-fit: cover; width: 100%; height: 100%;"
        ></v-img>
        <v-container v-else class="d-flex align-center justify-center">
          <span class="text-h3 text-white">{{ initials }}</span>
        </v-container>
      </v-avatar>
      <v-btn class="ml-8 text-capitalize" variant="outlined" @click="openDialog">Edit</v-btn>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card class="d-flex pa-4" style="border-radius: 20px;">
          <v-card-title class="pt-4">
            <span class="headline">Upload Profile Picture</span>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center my-4">
            <div class="d-flex align-center justify-center" style="width: 100%; height: 50vh; max-width: 80%; max-height: 80%">
              <div v-if="!selectedPicture">
                <v-btn @click="handleUploadPicture" class="text-capitalize">upload pic</v-btn>
                <input
                  type="file"
                  accept="image/*"
                  ref="fileInputRefDialog"
                  style="display: none;"
                  @change="handleFileChangeDialog"
                />
              </div>
              <div class="d-flex align-center justify-center" v-else>
                <VuePictureCropper
                  :boxStyle="{
                    width: '100%',
                    height: '100%',
                    margin: 'auto',
                  }"
                  :img="selectedPicture"
                  :options="{
                    viewMode: 1,
                    dragMode: 'crop',
                    aspectRatio: 10 / 10,
                  }"
                  :presetMode="{
                    mode: 'round',
                    width: 150,
                    height: 150,
                  }"
                />
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" size="large" class="text-capitalize mr-4" variant="text" rounded="xl">Cancel</v-btn>
            <v-btn color="primary" size="large" @click="saveSelectedImage" class="text-capitalize" variant="outlined" rounded="xl">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

const props = defineProps(['user']);

const fileInputRefDialog = ref(null);
const userPicture = ref(null);
const selectedPicture = ref(null);

const initials = computed(() => `${props?.user?.firstname[0]}${props?.user?.lastname[0]}`);

const dialog = ref(false);

const openDialog = () => {
  dialog.value = true;
};

const handleUploadPicture = () => {
    fileInputRefDialog.value.click();
  };

const closeDialog = () => {
  dialog.value = false;
  selectedPicture.value = null;
};

const handleFileChangeDialog = (event) => {
  const selectedFile = event.target.files[0];
  const imageUrl = URL.createObjectURL(selectedFile);
  selectedPicture.value = imageUrl;
};

const saveSelectedImage = async () => {
  if (!cropper) return
  const base64 = cropper.getDataURL()
  const blob = await cropper.getBlob()
  if (!blob) return
  const file = await cropper.getFile()
  console.log({ base64, blob, file })
  userPicture.value = base64
  closeDialog();
};
</script>