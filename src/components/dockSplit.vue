<template>
  <q-splitter
    v-model="size"
    ref="resizeRef"
    emit-immediately
    :horiztonal="direction == 'horizontal'"
    :limits="limits"
    unit="%"
    style="height: 100%"
  >
    <template #before>
      <div v-show="size <= limits[0] && collapseBar">
        <slot name="a_collapsed">
          <div
            style="background-color: darkgrey; width: 100%; height: 100%"
          ></div>
        </slot>
      </div>
      <div v-show="!(size <= limits[0] && collapseBar)" style="height: 100%">
        <slot name="a" :collapsePane="collapsePane"></slot>
      </div>
    </template>
    <template #after>
      <div v-show="size >= limits[1]">
        <slot name="b_collapsed">
          <div style="background-color: darkgrey"></div>
        </slot>
      </div>
      <div style="height: 100%">
        <slot name="b" :collapsePane="collapsePane"></slot>
      </div>
    </template>
  </q-splitter>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRefs,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  ComponentPublicInstance,
} from 'vue';
import { QSplitter } from 'quasar';

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
    direction: {
      type: String,
      default: 'vertical',
    },
    defaultSize: {
      type: Number,
      default: 50,
    },
    minSize: {
      type: String,
      default: '0%',
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

  setup(props) {
    const state = reactive({
      ...toRefs(props),
      size: ref(props.defaultSize),
      oldSize: ref(props.defaultSize),
      minSizePercent: ref(0),
      clientWidth: ref(10000),
      clientHeight: ref(10000),
    });

    const resizeRef = ref<ComponentPublicInstance<typeof QSplitter>>();

    const observer = new ResizeObserver((entries) => {
      // called initially and on resize
      entries.forEach((entry) => {
        state.clientWidth = entry.contentRect.width;
        state.clientHeight = entry.contentRect.height;
      });
    });

    onMounted(() => {
      // set initial dimensions right before observing: Element.getBoundingClientRect()
      if (resizeRef.value && resizeRef.value.$el) {
        const el = resizeRef.value.$el as HTMLElement;
        state.clientWidth = el.clientWidth;
        state.clientHeight = el.clientHeight;
        observer.observe(resizeRef.value.$el as Element);
      } else throw new Error('dockSplit.onMounted invalid resizeRef');
      watchEffect(() => {
        console.log(
          `${state.name}: [${limits.value[0]}, ${state.size}, ${limits.value[1]}], ${state.clientWidth}`
        );
      });
    });

    onBeforeUnmount(() => {
      if (resizeRef.value && resizeRef.value.$el)
        observer.unobserve(resizeRef.value.$el as Element);
    });

    const minSizePercent = computed(() => {
      if (state.minSize.includes('%'))
        return parseInt(state.minSize.replace('%', ''));
      const pixels = parseInt(state.minSize.replace('px', ''));
      return state.direction == 'vertical'
        ? Math.ceil((pixels / state.clientWidth) * 100)
        : Math.ceil((pixels / state.clientHeight) * 100);
    });

    const collapsePane = (x: string) => {
      state.oldSize = state.size;
      if (x == 'a') state.size = minSizePercent.value;
      else state.size = 100 - minSizePercent.value;
    };
    const expandPanes = () => {
      state.size = state.oldSize;
    };
    // const togglePane = (x: number) => {
    //   if (state.size == state.minSize) expandPane(x); else collapsePane(x);
    // }

    const limits = computed(() => [
      minSizePercent.value,
      100 - minSizePercent.value,
    ]);

    return {
      ...toRefs(state),
      collapsePane,
      expandPanes,
      limits,
      resizeRef,
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
