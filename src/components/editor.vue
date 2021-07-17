<template>
  <div id="codemirror1">My component</div>
</template>

<script>
import { onMounted } from 'vue';

import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

export default {
  // name: 'ComponentName',
  setup() {
    let startState = EditorState.create({
      doc: 'Hello World',
      extensions: [basicSetup, javascript()],
    });
    onMounted(() => {
      let view = new EditorView({
        state: startState,
        parent: document.getElementById('codemirror1'),
      });
    });
    return {};
  },
};
</script>
