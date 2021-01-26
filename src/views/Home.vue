<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>UFO</b></div>
    <img alt="UFO Logo" src="../assets/logo.png" class="icon">
    <div class="description">{{ content.descriptions[Math.floor(Math.random() * content.descriptions.length)] }}</div>
    <v-btn x-large color="info" class="invite" to="/invite">{{ content.invite }}</v-btn>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/Cookies'

let cookies = Cookies.parse()
let content = WebContent.home[cookies.language]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  })
}
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  color: white;
  font-size: 5em;
}

.description {
  color: white;
  margin: 10px;
  font-size: 2.2em;
  width: 80%;
}
.invite {
  font-size: 1.5em;
}
.icon {
  max-width: 100%;
  max-height: 50%;
}
</style>