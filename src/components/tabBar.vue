<template>
  <div class="tab-container">
    <Container
      :tag="{ value: 'div', props: { class: 'tabs' } }"
      orientation="horizontal"
      :get-child-payload="getDropPayload"
      @drop="onDrop"
      group-name="tabs"
    >
      <Draggable v-for="tab in getTabs(name)" :key="tab.name">
        <div
          @click="setSelectedTab(name, tab.name)"
          :class="[
            'tab',
            tab.isDisabled ? 'tab-disabled' : '',
            tab.name == getSelectedTab(name) ? 'tab-active' : '',
          ]"
        >
          {{ tab.label }}
        </div>
      </Draggable>
    </Container>
    <div class="tab-panels" :id="name">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, provide, toRefs } from 'vue';
// import { Container, Draggable } from 'vue3-smooth-dnd';
import useDockTabs, { DragResultInterface } from '../composables/useDockTabs';
import Container from './Container';
import Draggable from './Draggable';

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
  },

  components: { Container, Draggable },

  emits: ['changed', 'clicked'],

  setup(props) {
    const state = reactive({
      name: props.name,
    });

    const {
      getTab,
      getTabs,
      doDragDrop,
      setSelectedTab,
      getSelectedTab,
      tabBarNames,
    } = useDockTabs();

    const onDrop = (dropResult: DragResultInterface) => {
      // console.log('onDrop: ', dropResult);
      doDragDrop(state.name, dropResult);
    };

    const getDropPayload = (index: number) => {
      return getTabs(state.name)[index];
    };

    // provide tabProvider.state.name to each tab
    provide('tabsProvider', state);

    return {
      ...toRefs(state),
      onDrop,
      getTab,
      getTabs,
      getDropPayload,
      setSelectedTab,
      getSelectedTab,
      tabBarNames,
    };
  },
});
</script>

<style>
.tabs {
  display: flex !important;
  flex-direction: row;
  flex-shrink: 0;
  background-color: #f3f3f3;
  height: 35px;
  font-size: 13px;
}

.tab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab {
  background-color: #ececec;
  color: rgba(51, 51, 51, 0.7);
  min-width: 75px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 10px;
  white-space: nowrap;
  height: 100%;
}

.tab-active {
  background-color: white;
  color: rgb(51, 51, 51);
}

.tab-panels {
  background-color: white;
  color: rgb(51, 51, 51);
  flex-grow: 1;
}

.tab-panel {
  height: 100%;
}
</style>
