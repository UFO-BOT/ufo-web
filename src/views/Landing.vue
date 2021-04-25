<template>
  <div style="text-align: -webkit-center">
    <div class="name">{{ content.name }}</div>
    <v-img src="@/assets/avatar.png" max-width="260px" max-height="260px" class="icon"></v-img>
    <div class="buttons-container">
      <v-btn color="primary" x-large class="action-button" to="/commands"><v-icon large class="button-icon">list</v-icon>{{ content.commands }}</v-btn>
      <v-btn color="info" x-large class="action-button" href="https://discord.gg/qPrqVwR"><v-icon large class="button-icon">mdi-discord</v-icon>{{ content.support }}</v-btn>
    </div>
    <v-btn color="secondary" x-large v-if="user.username && $route.query.guild_id" :to="`/server/${$route.query.guild_id}/general`" class="action-button"><v-icon large class="button-icon">settings</v-icon>{{ content.settings }}</v-btn>
  </div>
</template>

<script>
import WebContent from '@/content.json'

let content = WebContent.landing[localStorage.getItem('language')]

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
  border-radius: 50%;
  margin: 10px;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.action-button {
  font-size: 1.3em;
  margin: 10px;
}
.button-icon {
  margin-right: 5px;
}
</style>