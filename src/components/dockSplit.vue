<template>
  <splitpanes :horiztonal="direction == 'horizontal'" @resize="onResize">
    <pane :size="sizes[0]" :min-size="minSizePercent">
      <slot name="a" style="height:100%"></slot>
    </pane>
    <pane :size="sizes[1]" :min-size="minSizePercent">
      <slot name="b"></slot>
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRefs,
  PropType,
} from 'vue';
import useWindowResize from '../composables/useWindowResize';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default defineComponent({
  props: {
    // name: {
    //   required: true,
    //   type: String,
    // },
    direction: {
      type: String,
      default: 'vertical',
    },
    sizes: {
      type: Array as PropType<Array<number>>,
      default: () => [50, 50],
    },
    collapsed: {
      type: Array,
      default: () => [false, false],
    },
    minSize: {
      type: Number,
      default: 48,
    },
  },
  components: { Splitpanes, Pane },

  setup(props) {
    const state = reactive({
      ...toRefs(props),
      // sizes: props.sizes,
      oldSizes: props.sizes,
    });

    const { windowWidth, windowHeight } = useWindowResize();

    const not = (x: number) => (x == 0 ? 1 : 0);

    const collapsePanel = (x: number) => {
      state.sizes[not(x)] += state.sizes[x];
      state.sizes[x] = 0;
    };
    const expandPanel = (x: number) => {
      state.sizes[x] = state.oldSizes[x];
      state.sizes[not(x)] = state.oldSizes[not(x)];
    };

    // const onLeftTabClick = (tabName: string) => {
    //   if (leftTab.value == tabName) {
    //     // click current tab
    //     if (panelSizes.value[0] == 0) expandPanel(0);
    //     else collapsePanel(0);
    //   } else {
    //     // click a new tab
    //     if (panelSizes.value[0] == 0) expandPanel(0);
    //   }
    // };

    const onResize = (e: { size: number }[]) => {
      state.sizes = [e[0].size, e[1].size];
      state.oldSizes = [e[0].size, e[1].size];
    };

    const minSizePercent = computed(() => {
      if (state.direction == 'vertical')
        return windowWidth && windowWidth.value
          ? (state.minSize / windowWidth.value) * 100
          : 10;
      else
        return windowHeight && windowHeight.value
          ? (state.minSize / windowHeight.value) * 100
          : 10;
    });

    return {
      ...toRefs(state),
      minSizePercent,
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
</style>
