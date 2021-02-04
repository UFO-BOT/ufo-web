<template>
  <div style="text-align: -webkit-center">
    <div class="content">
      <v-progress-circular v-if="!user.username" :size="100" :width="7" color="white"
                           indeterminate></v-progress-circular>
      <div v-if="user.username">
        <v-img :src="user.avatarURL" max-width="200px" max-height="200px" style="border-radius: 50%"></v-img>
        <div class="user-tag"><span class="username">{{ user.username }}</span><span
            class="discriminator">#{{ user.discriminator }}</span></div>
        <v-btn @click="logout" class="logout" color="error" outlined large><v-icon class="logout-icon" medium>logout</v-icon> {{ content.logout }}</v-btn>
        <br>
        <div class="guilds">
          <v-progress-circular v-if="loadingGuilds" :size="60" :width="5" color="white"
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
                  <v-btn :href="generateInvite(guild.id)" color="primary" outlined v-if="!guild.invited && guild.managePermission"
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
import WebContent from '@/content.json'
import Cookies from "@/util/cookies";
import config from '@/config.json';

let cookies = Cookies.parse()
let content = WebContent.me[cookies.language]
if (!cookies.token) window.location.replace('/')

export default {
  name: 'Home',
  data: () => ({
    content,
    loadingGuilds: true,
    guilds: [],
    showItems: [{text: content.settings,value:false}, {text: content.leaders, value:true}],
    leaders: false
  }),
  computed: {
    user() {
      document.title = this.$store.getters.user.username ? this.$store.getters.user.username : ''
      return this.$store.getters.user
    }
  },
  methods: {
    logout() {
      Cookies.set('token', '')
      Cookies.set('refreshToken', '')
      Cookies.set('tokenExpiresTimestamp', '')
      window.location.replace('/')
    },
    generateInvite(guildID) {
      return `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code&permissions=403549310&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}&guild_id=${guildID}&scope=bot`
    }
  },
  async mounted() {
    let response = await fetch(`${config.API}/private/guilds`, {
      headers: {
        Authorization: cookies.token
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
  color: white;
  word-break: break-all;

}

.discriminator {
  opacity: 0.3;
  color: white;
}

.user-badges {
  margin-bottom: 5px;
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
  color: white;
  background-color: #131313;
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
  box-shadow: 0 0 20px #131313;
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