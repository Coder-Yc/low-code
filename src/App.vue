<template>
  <Editor v-model="state" :formData="formData"></Editor>
</template>

<script>
import { ref, provide } from 'vue'

import Editor from './packages/editor.jsx'
import data from './data.json'
import { editorConfig as config } from './utils/editor-config'

export default {
  components: { Editor },
  setup() {
    provide('config', config)

    const formData = ref({
      username: 'abc',
      password: '123456',
      start: 0,
      end: 100
    })

    const state = ref(data)
    return {
      state,
      formData
    }
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
#app {
  margin: 18px;
}
</style>
