<template>
  <div style="text-align: -webkit-center">
    <v-card class="member-card">
      <v-progress-circular v-if="loading" :size="80" :width="6" color="white"
                           indeterminate></v-progress-circular>
      <div v-else>
        <v-img :lazy-src="member.user.avatar" :src="member.user.avatar" max-width="150px" max-height="150px" style="border-radius: 50%"></v-img>
        <div class="member-tag">{{ member.user.tag }}</div>
        <div class="mb-1">
          <div class="subtitle">{{ content.server }}</div>
          <div class="guild-name">{{ guildName }}</div>
        </div>
        <div v-if="member.number !== null" class="mb-1">
          <div class="subtitle">{{ content.rank }}</div>
          <div class="guild-name">{{ member.number }}</div>
        </div>
        <div class="member-flex">
          <div>
            <div class="subtitle">{{ content.balance }}</div>
            <div>{{ member.balance === null ? 'Infinity' : member.balance }}</div>
          </div>
          <div>
            <div class="subtitle">{{ content.xp }}</div>
            <div>{{ member.xp }}</div>
          </div>
        </div>
        <div v-if="manageable">
          <v-divider class="mt-2 mb-2"></v-divider>
          <div class="icons-flex">
            <EditMember :member="member" @edited="loadMember"></EditMember>
            <DeleteMember :member="member" @deleted="toLeaderboard"></DeleteMember>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'

import EditMember from "@/components/member/EditMember";
import DeleteMember from "@/components/member/DeleteMember";

let cookies = Cookies.parse()
let content = WebContent.LeaderboardMember[cookies.language]

export default {
  name: 'Leaderboard',
  components: {DeleteMember, EditMember},
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    guildName: null,
    member: {
      balance: 0,
      xp: 0,
      number: null,
      user: {}
    },
    manageable: false
  }),
  methods: {
    async loadMember() {
      this.loading = true;
      let response = await fetch(`${config.API}/private/leaderboard/${this.$route.params.id}/${this.$route.params.user}`, {
        headers: {
          Authorization: cookies.token
        }
      })
      let body = await response.json()
      if (!response.ok) return window.location.replace('/@me');
      this.guildName = body.name;
      this.member = body.member;
      let guildResponse = await fetch(`${config.API}/private/guild/${this.$route.params.id}/info`, {headers: {
          Authorization: cookies.token
        }})
      if(guildResponse.ok) {
        this.manageable = true;
      }
      document.title = (content.title + ' — ' + body.member.user.tag.split('#')[0])
      this.loading = false;
    },
    toLeaderboard() {
      window.location.replace(`/leaderboard/${this.$route.params.id}`)
    }
  },
  async mounted() {
    this.loadMember()
  }
}
</script>

<style scoped>
.member-card {
  width: 600px;
  margin-top: 20px;
  padding: 15px;
}
.member-tag {
  margin-top: 5px;
  font-size: 1.3em;
  margin-bottom: 5px;
}
.member-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
}
.icons-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 86%;
}
.subtitle {
  color: #b1b1b1;
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 5px;
}
.guild-name {
  font-size: 1.2em;
}
</style>