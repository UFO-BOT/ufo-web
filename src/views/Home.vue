<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>UFO</b></div>
    <img alt="UFO Logo" src="../assets/logo.png" class="icon">
    <div class="description">{{ content.descriptions[Math.floor(Math.random() * content.descriptions.length)] }}</div>
    <v-btn depressed x-large color="info" class="invite" to="/invite">{{ content.invite }}</v-btn>
  </div>
</template>

<script>
import CookieParser from '@/util/Cookies'

let cookies = CookieParser.parse()
import content from '@/content.json'

export default {
  name: 'Home',
  data: () => ({
    content: content.home[cookies.language]
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