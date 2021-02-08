<template>
  <div style="text-align: -webkit-center">
  <div class="name text-truncate">{{ guildName }}</div>
  <v-simple-table>
    <thead>
    <tr>
      <th>
        #
      </th>
      <th>
        {{ content.user }}
      </th>
      <th>
        {{ content[sortBy] }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="loading" v-for="i in new Array(skeletonsCount || 10)">
      <td><v-skeleton-loader max-width="5vw" type="text"></v-skeleton-loader></td>
      <td><v-skeleton-loader max-width="35vw" type="text"></v-skeleton-loader></td>
      <td><v-skeleton-loader max-width="10vw" type="text"></v-skeleton-loader></td>
    </tr>
    <tr v-if="!loading" v-for="leader in leaders">
      <td>{{ leader.number }}</td>
      <td><v-avatar width="40px" height="40px" class="mr-3"><img :src="leader.user.avatar" alt=""></v-avatar><span>{{ leader.user.tag }}</span></td>
      <td>{{ leader[sortBy] === null ? 'Infinity' : leader[sortBy] }}</td>
    </tr>
    </tbody>
  </v-simple-table>
  <div class="leaderboard-menu">
    <v-pagination v-model="page" :length="pageCount" :total-visible="windowWidth >= 600 ? 3 : 0" :disabled="loading" @input="loadLeaderboard"></v-pagination>
    <div>
      <v-select v-model="sortBy" :items="sortValues" :label="content.sort" @input="loadLeaderboard" class="sort-select"></v-select>
    </div>
  </div>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'

let cookies = Cookies.parse()
let content = WebContent.leaderboard[cookies.language]

export default {
  name: 'Leaderboard',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    windowWidth: 0,
    loading: true,
    guildName: content.loading,
    leaders: [],
    skeletonsCount: 10,
    pageCount: 0,
    page: 1,
    sortBy: 'balance',
    sortValues: [{text: content.balance, value: 'balance'}, {text: content.xp, value: 'xp'}]
  }),
  methods: {
    async loadLeaderboard() {
      this.skeletonsCount = this.leaders.length
      this.loading = true;
      let response = await fetch(`${config.API}/public/guild/${this.$route.params.id}/leaderboard?page=${this.page}&sort=${this.sortBy}`, {
        headers: {
          Authorization: cookies.token
        }
      })
      let body = await response.json()
      if (!response.ok) return window.location.replace('/@me');
      this.guildName = body.name;
      this.leaders = body.leaders;
      this.pageCount = body.pageCount;
      this.loading = false;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  async mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.loadLeaderboard()
  }
}
</script>

<style scoped>
.name {
  font-size: calc(2.5vw + 1rem);
  max-width: 80%;
}

.leaderboard-menu {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
  width: 96%;
}

.sort-select {
  width: 150px!important;
  margin: 8px 0 0 0!important;
  padding: 0!important;
}
</style>