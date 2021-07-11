<template>
  <div class="tab-container">
    <div class="tabs" :id="name + '_tabs'" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
      <div
        v-for="(tab,i) in getTabs(name)"
        :key="tab.name"
        :id="tab.name +'_tab'"
        @click.prevent="onTabClick(tab.name)"
        @dragstart="onDragStart($event, tab.name, i)"
        :class="[
          'tab',
          tab.isDisabled ? 'tab-disabled' : '',
          tab.name == getSelectedTab(name) ? 'tab-active' : '',
        ]"
        draggable="true"
      >
        {{ tab.label }}
      </div>
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
  tabName: string,
  tabsName: string,
  index: number
}

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
  },

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
      getState
    } = useDockTabs();

    const onTabClick = (tabName: string) => {
      setSelectedTab(state.name, tabName)
    }

    const onDrop = (e:DragEvent) => {
      const dropData = JSON.parse(e.dataTransfer?.getData('dropData') || '') as DropData;
      const target = e.target as HTMLElement;
      console.log('dropping onto: ', target.id, target.className)

      // addedIndex depends on whether drop target was tabs contained or existing tab
      let addedIndex: number;
      if (target.classList.contains('tabs')) {
        // dropped onto tabs
        addedIndex = getTabs(target.id.replace('_tabs','')).length;
      } else if (target.classList.contains('tab')) {
        const parent = target.parentElement;
        if (!(parent && parent.className == 'tabs')) throw new Error('parent element is not tabs')
        const targetTabs= getTabs(parent.id);
        const targetIndex = targetTabs.findIndex(x => x.name + '_tab' == target.id);
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

      setSelectedTab(state.name, dropData.tabName);
    };

    const onDragStart = (e:DragEvent, tabName: string, index: number) => {

      setSelectedTab(state.name, tabName);

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('dropData', JSON.stringify({tabName, tabsName: state.name, index}));
      }
      console.log('onStartDrag', tabName)
    }

    // provide tabProvider.state.name to each tab
    provide('tabsProvider', state);

    return {
      ...toRefs(state),
      onDrop,
      getTab,
      getTabs,
      setSelectedTab,
      getSelectedTab,
      tabBarNames,
      onDragStart,
      onTabClick
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
