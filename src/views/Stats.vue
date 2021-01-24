<template>
  <div style="text-align: -webkit-center">
    <div class="header"><b>{{ content.name }}</b></div>
    <div class="stats_container">
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ stats.stats.guilds }}
        </div>
        <div class="value-name">{{ content.servers }}</div>
      </div>
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ stats.stats.users }}
        </div>
        <div class="value-name">{{ content.users }}</div>
      </div>
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ stats.stats.channels }}
        </div>
        <div class="value-name">{{ content.channels }}</div>
      </div>
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ stats.stats.emojis }}
        </div>
        <div class="value-name">{{ content.emojis }}</div>
      </div>
    </div>
    <div class="header"><b>{{ content.ping }}</b></div>
    <div class="stats_container">
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else
             :style="{color: stats.ping.bot < 100 ? '#00f56e' : stats.ping.bot > 1000 ? '#e20000' : '#ffd70c'}">
          {{ stats.ping.bot }} ms
        </div>
        <div class="value-name">{{ content.bot }}</div>
      </div>
      <div class="stats_element">
        <v-progress-circular v-if="loading" :size="45" width="4" color="white" indeterminate></v-progress-circular>
        <div class="value" v-else
             :style="{color: stats.ping.bot < 100 ? '#00f56e' : stats.ping.database > 1000 ? '#e20000' : '#ffd70c'}">
          {{ stats.ping.database }} ms
        </div>
        <div class="value-name">{{ content.database }}</div>
      </div>
    </div>
    <div class="header"><b>{{ content.shards }}</b></div>
    <v-data-table dark :footer-props="{itemsPerPageText: content.shardsPerPage, itemsPerPageAllText: content.all}"
                  :headers="shardsHeaders"
                  :items="shards"
                  :items-per-page=5
                  class="elevation-1 blue-grey darken-3"
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
import CookieParser from '@/util/Cookies'
import config from "@/config.json";

let cookies = CookieParser.parse()
let content = WebContent.stats[cookies.language]

export default {
  name: "Stats",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    stats: {},
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
    shards: []
  }),
  async mounted() {
    async function loadStats() {
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
    await loadStats;
    this.loading = false;
    setInterval(loadStats, 30000)
  }
}
</script>

<style scoped>
.header {
  margin: 7px 0 12px 0;
  color: white;
  font-size: 2.5em;
}

.stats_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.stats_element {
  background-color: #37474f;
  padding: 15px 15px;
  text-align: center;
  margin: 10px 10px 10px 10px;
  border-radius: 4px;
  width: 230px;
  word-break: break-all;
  box-shadow: 0 0 20px #393939;
}

.value {
  color: white;
  font-size: 2em;
}

.value-name {
  color: rgb(190, 190, 190);
  font-size: 1.5em;
  opacity: 0.7;
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