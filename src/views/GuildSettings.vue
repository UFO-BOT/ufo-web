<template>
  <div>
    <div class="guild-name" v-if="loadingGuild">{{ content.loading }}</div>
    <div class="guild-name">{{ guild.name }}</div>
    <v-tabs show-arrows fixed-tabs class="guild-menu">
      <v-tab v-for="link of links" :to="link.path.replace(':id', $route.params.id || '0')">{{ link.name}}</v-tab>
    </v-tabs>
    <v-window>
      <v-tab-item v-for="link of links">
        <div class="settings">
          <router-view></router-view>
        </div>
      </v-tab-item>
    </v-window>
  </div>
</template>

<script>
import Cookies from '@/util/Cookies'
let cookies = Cookies.parse()

import WebContent from '@/content.json'
let content = WebContent.guild[cookies.language]
let links = content.list;

export default {
  name: "GuildSettings",
  data: () => ({
    loadingGuild: false,
    links,
    content
  }),
  computed: {
    guild() {
      return this.$store.getters.guilds.find(g => g.id === this.$route.params.id) || {}
    }
  },
  async mounted() {
    if(!this.guild.id) {
      this.loadingGuild = true;
      await this.$store.dispatch('getGuild', this.$route.params.id).catch(() => window.location.replace('/@me'))
      this.loadingGuild = false;
    }
    else {
      await this.$store.dispatch('updateGuild', this.$route.params.id).catch(() => window.location.replace('/@me'))
    }
  }
}
</script>

<style scoped>
.guild-name {
  font-size: calc(1rem + 3.5vw);
  background-color: #1b1e23;
  padding: 5px 5px 5px 15px;
}
.guild-menu {
  box-shadow: 0 5px 15px #14161a;
}
.settings {
  padding: 20px 0 0 30px;
}
</style>