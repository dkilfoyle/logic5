<template>
  <div class="tab-container">
    <div
      class="tabs"
      :id="name + '_tabs'"
      @drop="onDrop($event)"
      @dragover.prevent
      @dragenter.prevent="onDragEnter($event)"
      @dragleave.prevent="onDragLeave($event)"
    >
      <div
        v-for="(tab, i) in getTabs(name)"
        :key="tab.name"
        :id="tab.name + '_tab'"
        @click.prevent="onTabClick(tab.name)"
        @dragstart="onDragStart($event, tab.name, i)"
        :class="[
          'tab',
          tab.isDisabled ? 'tab-disabled' : '',
          tab.name == getSelectedTab(name) ? 'tab-active' : '',
        ]"
        draggable="true"
      >
        <q-icon
          v-if="tab.icon"
          :name="tab.icon"
          class="q-mr-xs tab-icon-left"
        ></q-icon>
        {{ tab.label }}
        <q-icon
          name="close"
          font-size="16pt"
          class="q-ml-sm tab-icon-right"
        ></q-icon>
      </div>
      <div :id="name + '_drop-zone'" class="col drop-zone"></div>
      <q-btn
        class="col-auto q-mr-sm"
        flat
        round
        color="primary"
        @click="onCollapseClick"
        icon="close"
        size="xs"
      ></q-btn>
    </div>
    <div class="tab-panels" :id="name">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, provide, toRefs } from 'vue';
import useDockTabs, { DragDropAction } from '../composables/useDockTabs';

interface DropData {
  tabName: string;
  tabsName: string;
  index: number;
}

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
  },

  emits: ['changed', 'clicked', 'collapse'],

  setup(props, { emit }) {
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
      getState,
    } = useDockTabs();

    const onTabClick = (tabName: string) => {
      setSelectedTab(state.name, tabName);
    };

    const onDrop = (e: DragEvent) => {
      const dropData = JSON.parse(
        e.dataTransfer?.getData('dropData') || ''
      ) as DropData;
      const target = e.target as HTMLElement;
      console.log('dropping onto: ', target, target.id, target.className);

      // addedIndex depends on whether drop target was tabs contained or existing tab
      let addedIndex: number;
      if (target.classList.contains('drop-zone')) {
        // dropped onto tabs drop zone
        addedIndex = getTabs(target.id.replace('_drop-zone', '')).length;
      } else if (target.classList.contains('tab')) {
        const parent = target.parentElement;
        if (!(parent && parent.className == 'tabs'))
          throw new Error('parent element is not tabs');
        const targetTabs = getTabs(parent.id);
        const targetIndex = targetTabs.findIndex(
          (x) => x.name + '_tab' == target.id
        );
        addedIndex = targetIndex;
      } else {
        return;
      }

      const dragDropAction = {
        sourceTabsId: dropData.tabsName,
        sourceTabIndex: dropData.index,
        targetTabsId: state.name,
        targetTabIndex: addedIndex,
      } as DragDropAction;
      doDragDrop(dragDropAction);

      target.classList.remove('drag-over');
      setSelectedTab(state.name, dropData.tabName);

      console.log(getState());
    };

    const onDragStart = (e: DragEvent, tabName: string, index: number) => {
      setSelectedTab(state.name, tabName);

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData(
          'dropData',
          JSON.stringify({ tabName, tabsName: state.name, index })
        );
      }
      console.log('onStartDrag', tabName);
    };

    const onDragEnter = (e: DragEvent) => {
      const element = e.target as HTMLElement;
      element.classList.add('drag-over');
    };

    const onDragLeave = (e: DragEvent) => {
      const element = e.target as HTMLElement;
      element.classList.remove('drag-over');
    };

    const onCollapseClick = () => {
      emit('collapse');
    };

    // provide tabProvider.state.name to each tab
    provide('tabsProvider', state);

    return {
      ...toRefs(state),

      onDragStart,
      onDragEnter,
      onDragLeave,
      onDrop,

      getTab,
      getTabs,
      setSelectedTab,
      getSelectedTab,
      tabBarNames,

      onTabClick,
      onCollapseClick,
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
  width: 100%;
}

.tab {
  background-color: #ececec;
  color: rgba(82, 82, 82, 0.658);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  white-space: nowrap;
  height: 100%;
  border-right: 1px solid white;
}

.tab-active {
  background-color: white;
  color: rgb(51, 51, 51);
  border-top: 2px solid #00b1fb;
}

.tab-icon-left {
  color: rgb(92, 187, 92);
}

.tab > .tab-icon-right {
  color: transparent;
}

.tab-active > .tab-icon-right {
  color: black;
}

.tab-panels {
  background-color: white;
  color: rgb(51, 51, 51);
  flex-grow: 1;
}

.tab-panel {
  height: 100%;
}

.drag-over {
  background-color: #add8e691;
}
</style>
