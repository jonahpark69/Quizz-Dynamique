<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const legacyImageSrc = ref('/legacy/images/mon-image.png')
const legacyAudioSrc = ref('/legacy/audio/mon-audio.mp3')
const audioMissing = ref(false)

const useImagePlaceholder = () => {
  legacyImageSrc.value = '/legacy/images/placeholder.svg'
}

const showAudioPlaceholder = () => {
  audioMissing.value = true
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />

  <section class="legacy-preview legacy-debug">
    <h2>Legacy assets test</h2>
    <img
      class="legacy-media"
      :src="legacyImageSrc"
      alt="Legacy image test"
      @error.once="useImagePlaceholder"
    />
    <audio class="legacy-media" controls preload="none" @error="showAudioPlaceholder">
      <source :src="legacyAudioSrc" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <p v-if="audioMissing" class="legacy-note">
      Placeholder: add your file at /public/legacy/audio/mon-audio.mp3
    </p>
  </section>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
