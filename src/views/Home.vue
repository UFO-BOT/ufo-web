<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>UFO</b></div>
    <v-img src="../assets/logo.png" max-width="500px" max-height="500px" class="icon"></v-img>
    <div class="description">{{ content.descriptions[Math.floor(Math.random() * content.descriptions.length)] }}</div>
    <v-btn x-large color="#7777ff" class="invite" @click="invite">{{ content.invite }}</v-btn>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'

let cookies = Cookies.parse()
let content = WebContent.home[cookies.language]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  }),
  methods: {
    invite() {
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code&permissions=403549310&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}&scope=bot`
    }
  }
}
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 5em;
}

.description {
  margin: 10px;
  font-size: 2.2em;
  width: 80%;
}
.invite {
  font-size: 1.5em;
}
.icon {
  margin: 10px;
}
</style>