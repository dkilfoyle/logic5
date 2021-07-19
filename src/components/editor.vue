<template>
  <div
    id="codemirror1"
    ref="wrapperRef"
    :style="{ height: wrapperHeight + 'px' }"
  ></div>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, watchEffect, reactive } from 'vue';

import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

export default {
  // name: 'ComponentName',
  setup() {
    const state = reactive({
      wrapperHeight: 10,
    });

    const wrapperRef = ref<HTMLElement>();

    const onResize = (size: { height: number }) =>
      (state.wrapperHeight = size.height);

    let startState = EditorState.create({
      doc: 'Hello World',
      extensions: [basicSetup, javascript()],
    });
    onMounted(() => {
      debugger;
      state.wrapperHeight =
        wrapperRef?.value?.parentElement?.clientHeight || 111;
      let view = new EditorView({
        state: startState,
        parent: document.getElementById('codemirror1') as Element,
      });
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
.cm-editor {
  height: inherit;
}
</style>
