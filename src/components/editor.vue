<template>
  <div
    id="codemirror1"
    ref="wrapperRef"
    :style="{
      height: wrapperHeight + 'px',
    }"
  ></div>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, reactive, watch } from 'vue';

import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import useWindowResize from '../composables/useWindowResize';

export default {
  // name: 'ComponentName',
  setup() {
    const state = reactive({
      wrapperHeight: 10,
    });

    const { width, height } = useWindowResize();

    const wrapperRef = ref<HTMLElement>();

    const onResize = (size: { height: number }) => {
      console.log(size);
      state.wrapperHeight = size.height;
    };

    let startState = EditorState.create({
      doc: 'Hello World',
      extensions: [basicSetup, javascript()],
    });
    onMounted(() => {
      state.wrapperHeight =
        (wrapperRef?.value?.parentElement?.clientHeight || 111) - 10;
      let view = new EditorView({
        state: startState,
        parent: document.getElementById('codemirror1') as Element,
      });
      watch(
        () => height.value,
        (newHeight = 1, oldHeight = 1) => {
          state.wrapperHeight += newHeight - oldHeight;
        }
      );
    });

    return {
      ...toRefs(state),
      wrapperRef,
      onResize,
    };
  },
};
</script>

<style>
#codemirror1 {
}
.cm-editor {
  height: inherit;
}
.cm-scroller {
  overflow: auto;
}
</style>
