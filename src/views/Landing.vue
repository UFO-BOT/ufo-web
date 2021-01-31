<template>
  <div style="text-align: -webkit-center">
    <div class="name">{{ content.name }}</div>
    <img alt="UFO Avatar" src="@/assets/avatar.png" class="icon">
    <div class="buttons-container">
      <v-btn color="primary" x-large class="action-button" to="/commands"><v-icon x-large class="button-icon">list</v-icon>Команды</v-btn>
      <v-btn color="grey" x-large class="action-button" href="https://discord.gg/qPrqVwR"><v-icon x-large class="button-icon">group</v-icon>Поддержка</v-btn>
    </div>
    <v-btn color="secondary" x-large v-if="user.username && $route.query.guild_id" :to="`/server/${$route.query.guild_id}/general`" class="action-button"><v-icon x-large class="button-icon">settings</v-icon>НАСТРОЙКИ</v-btn>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'

let cookies = Cookies.parse()
let content = WebContent.landing[cookies.language]

export default {
  name: "Landing",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  }),
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
}
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 3em;
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
.action-button {
  font-size: 1.6em;
  margin: 10px;
}
.button-icon {
  margin-right: 5px;
}
</style>