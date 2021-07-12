<template>
  <q-page class="column">
    <div class="row items-stretch" style="flex: 1">
      <div class="col">
        <dock-split>
          <template #a>
           <side-bar></side-bar>
          </template>
          <template #b>
            <dock-split>
              <template #a>
                <dock-tabs name="middleTop">
                  <dock-panel name="yello" icon="window" isSelected
                    ><div class="mypanel">
                      <h2>My yellow panel</h2>
                    </div></dock-panel
                  >
                  <dock-panel name="purple" icon="window"
                    ><div class="mypanel">
                      <h2>My purple panel</h2>
                    </div></dock-panel
                  >
                </dock-tabs>
              </template>
              <template #b>
                <dock-tabs name="rightTop">
                  <dock-panel name="red" icon="window" isSelected
                    ><div class="mypanel">
                      <h2>My red panel</h2>
                    </div></dock-panel
                  >
                  <dock-panel name="blue" icon="window"
                    ><div class="mypanel">
                      <h2>My blue panel</h2>
                    </div></dock-panel
                  >
                </dock-tabs>
              </template>
            </dock-split>
          </template>
        </dock-split>
      </div>
    </div>
    <div class="row statusBar"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

// import tabBar from '../components/tabBar.vue';
import dockTabs from '../components/dockTabs.vue';
import dockPanel from '../components/dockPanel.vue';
import dockSplit from '../components/dockSplit.vue';
import sideBar from '../components/sideBar.vue';

export default defineComponent({
  name: 'PageIndex',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { dockTabs, dockPanel, dockSplit, sideBar },
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
.leftBar {
  background: #f3f3f3;
  color: #65666e;
  width: 48px;
  height: 100%;
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
