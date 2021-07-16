<template>
  <q-page class="column">
    <div class="row items-stretch" style="flex: 1">
      <div class="col">
        <dock-split name="d0" :default-size="20" min-size="48px">
          <template v-slot:a="splitprops_d0a">
            <dock-sidebar
              @toggle="splitprops_d0a.togglePane('a')"
              @expand="splitprops_d0a.expandPane('ifCollapsed')"
            ></dock-sidebar>
          </template>
          <template v-slot:b>
            <dock-split name="d1" collapse-bar>
              <template v-slot:a="splitprops_d1a">
                <dock-tabs name="middleTop" :splitprops="splitprops_d1a">
                  <dock-panel
                    name="yellow"
                    label="Yellow"
                    icon="window"
                    isSelected
                    ><div class="mypanel">
                      <h4>My yellow panel</h4>
                    </div></dock-panel
                  >
                  <dock-panel name="purple" label="Purple" icon="window"
                    ><div class="mypanel">
                      <h4>My purple panel</h4>
                    </div></dock-panel
                  >
                </dock-tabs>
              </template>
              <template v-slot:b>
                <dock-split name="d2" collapse-bar horizontal>
                  <template v-slot:a="splitprops_d2a">
                    <dock-tabs name="rightTop" :splitprops="splitprops_d2a">
                      <dock-panel
                        name="table"
                        label="Table"
                        icon="window"
                        isSelected
                        ><div class="mypanel">
                          <h4>My table</h4>
                        </div></dock-panel
                      >
                    </dock-tabs>
                  </template>
                  <template v-slot:b="splitprops_d2b">
                    <dock-tabs name="rightBottom" :splitprops="splitprops_d2b">
                      <dock-panel
                        name="graphs"
                        label="Graphs"
                        icon="window"
                        isSelected
                        ><div class="mypanel">
                          <h4>Graph here</h4>
                        </div></dock-panel
                      >
                    </dock-tabs>
                  </template>
                </dock-split>
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
import { defineComponent, ref } from 'vue';

// import tabBar from '../components/tabBar.vue';
import dockTabs from '../components/dockTabs.vue';
import dockPanel from '../components/dockPanel.vue';
import dockSplit from '../components/dockSplit.vue';
import dockSidebar from '../components/dockSidebar.vue';

export default defineComponent({
  name: 'PageIndex',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { dockTabs, dockPanel, dockSplit, dockSidebar },
  setup() {
    const leftTab = ref('mails');

    const onCollapse = (x: string) => {
      console.log('collapse', x);
    };

    return {
      leftTab,
      onCollapse,
    };
  },
});
</script>

<style>
.statusBar {
  background-color: #eeeeee;
  border-top: 1px solid #00b1fb;
  height: 22px;
}
.mypanel {
  padding: 5px;
  height: 100%;
}
</style>
