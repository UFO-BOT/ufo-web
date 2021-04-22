<template>
  <div style="text-align: -webkit-center">
    <div class="content">
      <div>
        <v-progress-circular v-if="!user.username" :size="100" :width="7"
                             indeterminate></v-progress-circular>
      </div>
      <div v-if="user.username">
        <v-img :lazy-src="user.avatarURL" :src="user.avatarURL" max-width="200px" max-height="200px" style="border-radius: 50%"></v-img>
        <div class="user-tag"><span class="username">{{ user.username }}</span><span
            class="discriminator">#{{ user.discriminator }}</span></div>
        <div>
          <v-tooltip top v-for="badge in badges" color="black">
            <template v-slot:activator="{ on, attrs }">
              <img :src="require(`@/assets/badges/${badge}.png`)" class="user-badge" v-bind="attrs" v-on="on" alt="">
            </template>
            <span>{{ content.badges[badge] }}</span>
          </v-tooltip>
        </div>
        <v-btn @click="logout" class="logout" color="error" :loading="loggingOut" outlined large><v-icon class="logout-icon" medium>logout</v-icon> {{ content.logout }}</v-btn>
        <br>
        <div class="guilds">
          <v-progress-circular v-if="loadingGuilds" :size="60" :width="5"
                               indeterminate></v-progress-circular>
          <v-select v-if="!loadingGuilds" :items="showItems" v-model="leaders" :label="content.show" class="show-select" color="primary"></v-select>
          <div class="guilds-container">
            <div class="guild" v-for="guild of guilds" v-if="guild.managePermission || (leaders && guild.invited)">
              <div>
                <v-avatar><img :src="guild.icon" alt="Icon"></v-avatar>
                {{ guild.name.length <= 25 ? guild.name : guild.name.slice(0, 25) + '...' }}
              </div>
              <div>
                <v-divider class="guild-divider"></v-divider>
                <div class="guild-buttons">
                  <v-btn :href="generateInvite(guild.id)" color="blue" outlined v-if="!guild.invited && guild.managePermission"
                         class="action-button">{{ content.invite }}
                  </v-btn>
                  <v-btn :to="`/server/${guild.id}/general`" color="grey" outlined v-if="guild.invited && guild.managePermission"
                         class="action-button">{{ content.settings }}
                  </v-btn>
                  <v-btn :to="`/leaderboard/${guild.id}`" color="warning" outlined v-if="leaders && guild.invited"
                         class="action-button">{{ content.leaders }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Oauth2 from "@/util/oauth2";

import WebContent from '@/content.json'
import config from '@/config.json';

let content = WebContent.me[localStorage.getItem('language')]
if (!localStorage.getItem('token')) window.location.replace('/')

export default {
  name: 'Home',
  data: () => ({
    content,
    loggingOut: false,
    loadingGuilds: true,
    guilds: [],
    showItems: [{text: content.settings,value:false}, {text: content.leaders, value:true}],
    leaders: false
  }),
  computed: {
    user() {
      document.title = this.$store.getters.user.username ? this.$store.getters.user.username : ''
      return this.$store.getters.user
    },
    badges() {
      return this.$store.getters.badges
    }
  },
  methods: {
    async logout() {
      this.loggingOut = true;
      await Oauth2.revokeToken(localStorage.getItem('token'));
      this.loggingOut = false;
      //window.location.replace('/')
    },
    generateInvite(guildID) {
      return `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code&permissions=403549310&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}&guild_id=${guildID}&scope=bot`
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserBadges').catch(() => {})
    let response = await fetch(`${config.API}/private/guilds`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    let body = await response.json()
    this.loadingGuilds = false;
    if (response.ok) this.guilds = body;
  }
}
</script>

<style scoped>
.content {
  margin-top: 15px;
}

.user-tag {
  font-size: 2em;
}

.username {
  word-break: break-all;

}

.discriminator {
  color: var(--v-opacityColor-base);
  opacity: 0.7;
}

.user-badge {
  width: 40px;
  height: 40px;
  margin-right: 3px;
  cursor: pointer;
}

.logout {
  font-size: 1.4em;
  margin-top: 5px;
}

.logout-icon {
  margin-right: 8px;
}

.guilds {
  margin-top: 15px;
}

.guilds-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.guild {
  background-color: var(--v-block-base);
  box-shadow: 0 0 3px var(--v-blockShadow-base);
  padding: 20px 20px 5px 20px;
  font-size: 1.5em;
  margin: 5px;
  border-radius: 10px;
  width: 400px;
  word-break: break-all;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  transition-duration: 200ms;
}

.guild:hover {
  box-shadow: 0 0 10px var(--v-blockShadow-base);
  transition-duration: 200ms;
}

.guild-divider {
  margin-top: 8px;
}

.guild-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 8px;
}

.action-button {
  margin-bottom: 6px;
}
.show-select {
  width: 300px;
  margin: 0 10px 0 10px;
}
</style>