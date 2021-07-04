<template>
  <q-page class="column">
    <div class="row items-stretch" style="flex: 1">
      <div class="col-auto">
        <q-tabs v-model="leftTab" vertical switch-indicator class="leftBar">
          <q-tab name="mails" icon="mail" @click="onLeftTabClick('mails')" />
          <q-tab name="alarms" icon="alarm" @click="onLeftTabClick('alarms')" />
          <q-tab name="movies" icon="movie" @click="onLeftTabClick('movies')" />
        </q-tabs>
      </div>
      <div class="col">
        <splitpanes @resize="onResizeSplitPanes" style="height: 100%">
          <pane :size="panelSizes[0]"><div class="leftPanels">Left</div></pane>
          <pane :size="panelSizes[1]">
            <splitpanes horizontal>
              <pane
                ><div class="middlePanels">
                  <q-tabs v-model="middleTab" align="left">
                    <q-tab name="people" icon="people" />
                    <q-tab name="mails" icon="mails" />
                  </q-tabs>
                  <q-tab-panels v-model="middleTab">
                    <q-tab-panel name="mails"> <h5>Mails</h5> </q-tab-panel>
                  </q-tab-panels>
                </div></pane
              >
              <pane><div class="middlePanels"></div></pane>
            </splitpanes>
          </pane>
          <pane :min-size="sideBarWidthPercent" :size="panelSizes[2]">
            <splitpanes horizontal>
              <pane
                ><div class="rightPanels">
                  <tab-bar name="rightTop">
                    <tab-panel name="red" isSelected
                      ><div class="mypanel">
                        <h2>My red panel</h2>
                      </div></tab-panel
                    >
                    <tab-panel name="blue"
                      ><div class="mypanel">
                        <h2>My blue panel</h2>
                      </div></tab-panel
                    >
                  </tab-bar>
                </div></pane
              >
              <pane
                ><div class="rightPanels">
                  <tab-bar name="rightBottom">
                    <tab-panel name="green" isSelected
                      ><div class="mypanel">
                        <h2>My green panel</h2>
                      </div></tab-panel
                    >
                  </tab-bar>
                </div></pane
              >
            </splitpanes>
          </pane>
        </splitpanes>
      </div>
    </div>
    <div class="row statusBar"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import tabBar from '../components/tabBar.vue';
import tabPanel from '../components/tabPanel.vue';
import useWindowResize from './useWindowResize';

export default defineComponent({
  name: 'PageIndex',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { Splitpanes, Pane, tabBar, tabPanel },
  setup() {
    const { width } = useWindowResize();

    const leftTab = ref('mails');
    const middleTab = ref('mails');

    const oldPanelSizes = ref([20, 45, 35]);
    const panelSizes = ref([20, 45, 35]);
    const collapsePanel = (x: number) => {
      panelSizes.value[1] += panelSizes.value[x];
      panelSizes.value[x] = 0;
    };
    const expandPanel = (x: number) => {
      panelSizes.value[x] = oldPanelSizes.value[x];
      panelSizes.value[1] = oldPanelSizes.value[1];
    };
    const onLeftTabClick = (tabName: string) => {
      if (leftTab.value == tabName) {
        // click current tab
        if (panelSizes.value[0] == 0) expandPanel(0);
        else collapsePanel(0);
      } else {
        // click a new tab
        if (panelSizes.value[0] == 0) expandPanel(0);
      }
    };
    const onResizeSplitPanes = (e: { size: number }[]) => {
      panelSizes.value = [e[0].size, e[1].size, e[2].size];
      oldPanelSizes.value = [e[0].size, e[1].size, e[2].size];
    };

    const sideBarWidthPercent = computed(() => {
      if (width && width.value) return (48 / width.value) * 100;
      else return 10;
    });

    return {
      leftTab,
      middleTab,
      panelSizes,
      onLeftTabClick,
      onResizeSplitPanes,
      sideBarWidthPercent,
    };
  },
});
</script>

<style>
.leftBar {
  background: #f3f3f3;
  color: #65666e;
  width: 48px;
}

.leftPanels {
  background: #ebebeb;
  height: 100%;
}
.middlePanels {
  background: #fafafa;
  height: 100%;
}
.rightPanels {
  background: #ebebeb;
  height: 100%;
}
.splitpanes {
  background-color: #f8f8f8;
}

.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}
.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.8s;
  background-color: #06a6e9;
  opacity: 0;
  z-index: 1;
}
.splitpanes__splitter:hover:before {
  opacity: 1;
}
.splitpanes--vertical > .splitpanes__splitter:before {
  left: -2px;
  right: -2px;
  height: 100%;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -4x;
  bottom: -4px;
  width: 100%;
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
.statusBar {
  background-color: #eeeeee;
  border-top: 1px solid #00b1fb;
  height: 22px;
}
.editorTabPanel {
  background-color: #fafafa;
}
.editorTabPanels {
  height: 100%;
}
.mypanel {
  padding: 5px;
  height: 100%;
}
</style>
