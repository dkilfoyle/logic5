<template>
  <div class="row items-stretch" style="flex: 1">
    <div class="col-auto">
      <q-tabs v-model="leftTab" vertical switch-indicator class="sidebar-tabs">
        <q-tab name="mails" icon="mail" @click="onLeftTabClick('mails')" />
        <q-tab name="alarms" icon="alarm" @click="onLeftTabClick('alarms')" />
        <q-tab name="movies" icon="movie" @click="onLeftTabClick('movies')" />
      </q-tabs>
    </div>
    <div class="col">
      <q-tab-panels v-model="leftTab" class="sidebar-panels">
        <q-tab-panel name="mails"
          ><div class="sidebar-panel">Mails</div>
        </q-tab-panel>
        <q-tab-panel name="alarms"
          ><div class="sidebar-panel">Alarms</div></q-tab-panel
        >
        <q-tab-panel name="movies"
          ><div class="sidebar-panel">Movies</div></q-tab-panel
        >
      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  setup() {
    const leftTab = ref('mails');
    const onLeftTabClick = (x: string) => {
      console.log('leftClick', x);
    };

    return {
      leftTab,
      onLeftTabClick,
    };
  },
});
</script>

<style>
.sidebar-tabs {
  background: #f3f3f3;
  color: #65666e;
  width: 48px;
  height: 100%;
}

.sidebar-panels {
  background: #ebebeb;
  height: 100%;
}

.sidebar-panel {
  padding: 5px;
  height: 100%;
}

.q-tab__indicator {
  color: #00b1fb;
}

.q-tab--inactive {
  color: #bdbdc0;
}
.q-tab--active {
  background-color: #fafafa;
}

.q-hoverable:hover > .q-focus-helper {
  opacity: 0 !important;
}

.q-tab__icon {
  display: block;
}
</style>
