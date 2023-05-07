<template>
  <router-view />
</template>

<script>
import { ref, provide } from 'vue'

import Editor from './packages/editor.jsx'
import Login from './packages/user/login.jsx'

import { editorConfig as config } from './utils/editor-config'

export default {
  components: { Editor, Login },
  setup() {
    provide('config', config)
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
