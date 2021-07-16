<template>
  <q-splitter
    v-model="size"
    emit-immediately
    :horizontal="horizontal"
    :limits="limits"
    unit="%"
    style="height: 100%"
  >
    <q-resize-observer @resize="onResize"></q-resize-observer>
    <template #before>
      <div v-show="showCollapseBar('a')" style="height: 100%">
        <slot name="a_collapsed">
          <div class="collapsebar">
            <q-btn
              @click="expandPane('a')"
              icon="add"
              flat
              round
              size="sm"
            ></q-btn>
          </div>
        </slot>
      </div>
      <div v-show="!showCollapseBar('a')" style="height: 100%">
        <slot
          name="a"
          :collapsePane="collapsePane"
          :expandPane="expandPane"
          :togglePane="togglePane"
          pane="a"
          :horizontal="horizontal"
          :collapsed="isCollapsed('a')"
        ></slot>
      </div>
    </template>
    <template #after>
      <div v-show="showCollapseBar('b')" style="height: 100%">
        <slot name="b_collapsed">
          <div class="collapseBar">
            <q-btn
              @click="expandPane('b')"
              icon="add"
              flat
              round
              size="sm"
            ></q-btn>
          </div>
        </slot>
      </div>
      <div v-show="!showCollapseBar('b')" style="height: 100%">
        <slot
          name="b"
          :collapsePane="collapsePane"
          :expandPane="expandPane"
          :togglePane="togglePane"
          pane="b"
          :horizontal="horizontal"
          :collapsed="isCollapsed('b')"
        ></slot>
      </div>
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs } from 'vue';

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    defaultSize: {
      type: Number,
      default: 50,
    },
    minSize: {
      type: String,
      default: 'default',
    },
    collapsed: {
      type: Array,
      default: () => [false, false],
    },
    collapseBar: {
      type: Boolean,
      default: false,
    },
  },

  // chevron_right expand_more expand_less unfold_more unfold_less settings folder
  // account_tree show_chart

  setup(props) {
    const state = reactive({
      ...toRefs(props),
      size: ref(props.defaultSize),
      oldSize: ref(props.defaultSize),
      minSizePercent: ref(0),
      clientWidth: ref(10000),
      clientHeight: ref(10000),
    });

    const onResize = (size: { width: number; height: number }) => {
      state.clientWidth = size.width;
      state.clientHeight = size.height;
    };

    const minSizePercent = computed(() => {
      if (state.minSize.includes('%'))
        return parseInt(state.minSize.replace('%', ''));
      let pixels;
      if (state.minSize == 'default') pixels = state.horizontal ? 35 : 32;
      else pixels = parseInt(state.minSize.replace('px', ''));
      return !state.horizontal
        ? (pixels / state.clientWidth) * 100
        : (pixels / state.clientHeight) * 100;
    });

    const isCollapsed = (x: string) => {
      if (x == 'a') return state.size <= limits.value[0];
      else return state.size >= limits.value[1];
    };

    const showCollapseBar = (x: string) =>
      isCollapsed(x) && state.collapseBar && !state.horizontal;

    const collapsePane = (x: string) => {
      state.oldSize = state.size;
      if (x == 'a') state.size = minSizePercent.value;
      else state.size = 100 - minSizePercent.value;
    };

    const expandPane = (reason = 'always') => {
      console.log('expandPane: ', state.oldSize);
      if (reason == 'ifCollapsed' && (isCollapsed('a') || isCollapsed('b'))) {
        state.size = state.oldSize;
        return;
      }
      state.size = state.oldSize;
    };

    const togglePane = (x: string) => {
      if (isCollapsed(x)) expandPane();
      else collapsePane(x);
    };

    const limits = computed(() => [
      minSizePercent.value,
      100 - minSizePercent.value,
    ]);

    return {
      ...toRefs(state),
      collapsePane,
      expandPane,
      togglePane,
      limits,
      isCollapsed,
      showCollapseBar,
      onResize,
    };
  },
});
</script>

<style>
.splitpanes {
  background-color: #f8f8f8;
}

.splitpanes__pane {
  display: flex;
}

.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}

.q-splitter__separator {
  transition: background-color 0.8s;
}
.q-splitter__separator:hover {
  background-color: #06a6e9;
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
.collapsebar {
  background: #f3f3f3;
  color: #65666e;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
