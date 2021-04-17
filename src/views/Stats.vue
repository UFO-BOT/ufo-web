<template>
  <div style="text-align: -webkit-center">
    <div class="header">{{ content.name }}</div>
    <div class="stats_container">
      <div class="stats-element" v-for="value of values">
        <v-progress-circular v-if="loading" :size="45" width="4" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ stats.stats[value] }}
        </div>
        <div class="value-name">{{ content[value] }}</div>
      </div>
    </div>
    <div class="header">{{ content.ping }}</div>
    <div class="stats_container">
      <div class="stats-element">
        <v-progress-circular v-if="loading" :size="45" width="4"  indeterminate></v-progress-circular>
        <div class="value" v-else
             :style="{color: stats.ping.bot < 100 ? '#00f56e' : (stats.ping.bot > 1000 ? '#e20000' : '#ffd70c')}">
          {{ stats.ping.bot }} ms
        </div>
        <div class="value-name">{{ content.bot }}</div>
      </div>
      <div class="stats-element">
        <v-progress-circular v-if="loading" :size="45" width="4" indeterminate></v-progress-circular>
        <div class="value" v-else
             :style="{color: stats.ping.bot < 100 ? '#00f56e' : (stats.ping.database > 1000 ? '#e20000' : '#ffd70c')}">
          {{ stats.ping.database }} ms
        </div>
        <div class="value-name">{{ content.database }}</div>
      </div>
    </div>
    <div class="header">{{ content.shards }}</div>
    <v-data-table :footer-props="{itemsPerPageText: content.shardsPerPage, itemsPerPageAllText: content.all}"
                  :headers="shardsHeaders"
                  :items="shards"
                  :items-per-page=5
                  class="shards-table elevation-1"
                  sort-by="id">
      <template v-slot:item.ready="{ item }">
        <div v-if="item.ready" class="status-circle status-circle-green"></div>
        <div v-else class="status-circle status-circle-yellow"></div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from "@/config.json";

let cookies = Cookies.parse()
let content = WebContent.stats[cookies.language]

export default {
  name: "Stats",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    stats: {
      stats: {},
      ping: {},
      shards: []
    },
    shards: [],
    shardsHeaders: [
      {
        text: '#',
        align: 'start',
        value: 'id',
      },
      {text: content.status, value: 'ready'},
      {text: content.servers, value: 'guilds'},
      {text: content.users, value: 'users'},
      {text: content.ping, value: 'ping'}],
    values: ['guilds', 'users', 'channels', 'emojis']
  }),
  methods: {
    async loadStats() {
      let stats = await fetch(`${config.API}/public/stats`)
      this.stats = await stats.json()
      this.shards = [];
      this.stats.shards.forEach(shard => {
        this.shards.push({
          id: shard.id,
          ready: shard.ready,
          guilds: shard.guilds,
          users: shard.users,
          ping: shard.ping + ' ms'
        })
      })
    }
  },
  async mounted() {
    await this.loadStats()
    this.loading = false;
    setInterval(this.loadStats, 5000)
  }
}
</script>

<style scoped>
.header {
  margin: 5px 0 5px 0;
  font-size: 2em;
}

.stats_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.stats-element {
  background-color: var(--v-block-base)!important;
  padding: 15px 15px;
  text-align: center;
  margin: 10px 10px 10px 10px;
  border-radius: 4px;
  width: 230px;
  word-break: break-all;
  box-shadow: 3px 3px 3px -3px var(--v-blockShadow-base);
}

.value {
  font-size: 2em;
}

.value-name {
  color: var(--v-opacityColor-base);
  font-size: 1.5em;
}

.shards-table {
  width: 1100px;
  border-radius: 20px;
  padding: 10px;
  background-color: var(--v-block-base)!important;
}

.status-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  content: '⁣';
}
.status-circle-green {
  background-color: #00f56e;
}
.status-circle-yellow {
  background-color: #ffd70c;
}
</style>