<template>
  <v-container>
    <v-row>
      <v-col :cols="isMobile ? '6' : '9'" class="d-flex py-0">
        <h2 class="mt-4 mb-6">Your Plans</h2>
      </v-col>
      <v-col :cols="isMobile ? '6' : '3'" class="d-flex py-0" :class="isMobile ? 'justify-end' : 'justify-center'">
        <v-btn
          color="secondary"
          :elevation="0"
          size="large"
          class="text-capitalize text--white my-2"
          rounded
          @click="openAddDialog"
        >
          <p class="text-white">Add Plan</p>
        </v-btn>
      </v-col>
    </v-row>

    <v-row :class="isMobile ? '' : 'mr-8'">
      <v-col cols="12" class="plan-list-col">
        <div v-for="plan in plansList" :key="plan.id" class="plan-list-item">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-card @click="selectPlan(plan)" v-bind="props" class="custom-card" :class="{ 'card-bordered': isHovering && !isMobile, 'mobile-card': isMobile, 'web-card': !isMobile }">
                <v-card-title>{{ plan.data.title }}</v-card-title>
                <v-card-text>{{ plan.data.description }}</v-card-text>
              </v-card>
            </template>
          </v-hover>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog
    v-model="addPlanDialog"
    width="400"
    persistent
    :elevation="0"
  >
    <AddPlanComponent
      :is-mobile="isMobile"
      :loading="addingPlan.loading"
      @cancel="cancelAddPlan"
      @add="doAddPlan($event)"
    >
    </AddPlanComponent>
  </v-dialog>
</template>
<script setup>
import { usePlanStore } from '../stores/planStore';
import { useAppMainStore } from '../stores';
import { ref, computed } from "vue";
import router from "@/router/router";
import { useDisplay } from "vuetify";
import AddPlanComponent from "@/planner/components/task/addPlanDialog.vue";

const planStore = usePlanStore()
const appMainStore = useAppMainStore()

const { width, mobile } = useDisplay();
const isMobile = computed(() => {
  return width.value <= 600 ? mobile.value : false;
});

const plansList = computed({
  get() {
    return planStore.plans;
  },
  set(value) {
    planStore.plans = value;
  },
});

const addPlanDialog = ref(false)

const addingPlan = ref({
  loading: false,
  added: false,
});

const selectPlan = (plan) => {
  router.push(`/app/plans/${plan.id}`)
}

const openAddDialog = () => {
  addPlanDialog.value = true
}

const doAddPlan = async (newPlan) => {
  addingPlan.value.loading = true;
  let plan = {};
  if (newPlan.value.title !== "") plan.title = newPlan.value.title;
  plan.description = newPlan.value.description;
  let r = await planStore.addPlan(plan);
  if (r.status === "added") {
    addingPlan.value.loading = false;
    addingPlan.value.added = true;
    cancelAddPlan()
  }
};

const cancelAddPlan = () => {
  addPlanDialog.value = false;
};

const force = ref(false)

async function load() {
  await planStore.getPlans(appMainStore.id, force.value);
}

load();
</script>

<style scoped>
.custom-card {
  margin: auto;
  border-radius: 15px;
  border: 1px solid white;
}

.card-bordered {
  border: 1px solid #ff8ca9;
  transition: outline-color 0.3s ease;
}
.mobile-card {
  width: 100%;
}

.web-card {
  width: 90%;
}

.plan-list-col {
  height: 70vh;
  overflow-y: auto;
}

.plan-list-item {
  margin-bottom: 8px;
};
</style>