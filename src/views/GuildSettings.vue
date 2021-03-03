<template>
  <div style="height: 100%">
    <!-- <div class="guild-name" v-if="loadingGuild">{{ content.loading }}</div>
    <div class="guild-name"></div> -->
    <div class="guild-content">
      <v-list class="guild-menu">
        <v-subheader class="guild-name" v-if="loadingGuild">{{ content.loading }}</v-subheader>
        <v-subheader class="guild-name" v-else :style="{wordBreak: guild.name.length > 25 ? 'break-all' : 'break-word'}">{{ guild.name.length <= 25 ? guild.name : guild.name.slice(0, 25) + '...'}}</v-subheader>
        <v-divider></v-divider>
        <v-list-item-group color="primary">
          <v-list-item v-for="link of links" :to="link.path">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ link.name }}</v-list-item-content>
          </v-list-item>
          <v-list-item :to="content.boost.path" color="#7777ff" v-if="guild.boost">
            <v-list-item-icon>
              <v-icon>{{ content.boost.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ content.boost.name }}</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-window class="guild-settings">
        <div class="settings">
          <router-view></router-view>
        </div>
      </v-window>
    </div>
  </div>
</template>

<script>
import Cookies from '@/util/cookies'
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
      return this.$store.getters.guilds.find(g => g.id === this.$route.params.id) || {name: ''}
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

<style>
.guild-name {
  font-size: 1.2em!important;
  padding: 5px 5px 5px 15px;
  margin-bottom: 8px;
}
@media screen and (min-width: 900px){
  .guild-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
  }
  .guild-menu {
    /* box-shadow: 0 5px 15px #14161a; */
    width: 250px;
    height: 100%;
  }
  .guild-settings {
    width: calc(100% - 250px);
  }
}
.settings {
  padding: 20px 0 0 20px;
}
</style>