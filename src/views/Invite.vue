<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>{{ content.name }}</b></div>
    <img alt="UFO Avatar" src="@/assets/avatar.png" class="icon">
    <div class="buttons-container">
      <v-btn color="error" x-large class="invite-btn" :href="`https://discord.com/api/oauth2/authorize?client_id=705372408281825350&response_type=code&permissions=0&redirect_uri=${encodeURIComponent(location + '/landing')}&scope=bot`">{{ content.noPerms }}</v-btn>
      <v-btn color="secondary" x-large class="invite-btn" :href="`https://discord.com/api/oauth2/authorize?client_id=705372408281825350&response_type=code&permissions=403549302&redirect_uri=${encodeURIComponent(location + '/landing')}&scope=bot`">{{ content.neededPerms }}</v-btn>
      <v-btn color="primary" x-large class="invite-btn" :href="`https://discord.com/api/oauth2/authorize?client_id=705372408281825350&response_type=code&permissions=403549310&redirect_uri=${encodeURIComponent(location + '/landing')}&scope=bot`">{{ content.allPerms }}</v-btn>
    </div>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/Cookies'

let cookies = Cookies.parse()
let content = WebContent.invite[cookies.language]

export default {
  name: "Invite",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    location: window.location.origin
  })
}
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 3.5em;
}
.icon {
  width: 250px;
  height: 250px;
  border-radius: 100%;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.invite-btn {
  font-size: 1.5em;
  margin: 10px;
}
</style>