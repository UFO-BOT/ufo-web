<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.logs }}</div>
      <v-expansion-panels class="logs mt-1" accordion hover focusable>
        <v-expansion-panel v-for="(category, i) of categories" :key="i">
          <v-expansion-panel-header class="category" color="block" ripple>
            <span>
              <v-icon large left>{{ content.subtitles.categories[category].icon }}</v-icon>
              {{ content.subtitles.categories[category].name }}
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="block">
            <div v-for="(log, j) of logs[category]">
              <div class="log" v-if="settings.logs.list[log]">
                <div class="log-name">{{ content.subtitles.logsList[log] }}</div>
                <div class="log-settings">
                  <v-select v-model="settings.logs.list[log].channel" :disabled="!settings.logs.list[log].enabled" :items="channels" :label="content.subtitles.channel" hide-details class="channel-select mr-3"/>
                  <v-switch v-model="settings.logs.list[log].enabled" class="switch"/>
                </div>
              </div>
              <v-divider v-if="j < logs[category].length-1"></v-divider>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="subtitle mt-3">{{ content.subtitles.ignoredChannels }}</div>
      <v-select v-model="settings.logs.ignore.channels"
                :label="content.subtitles.channels"
                :hint="content.subtitles.ignoredChannelsHint"
                persistent-hint multiple chips deletable-chips
                :items="channels"
                class="channels-select mb-2"/>
      <v-btn :disabled="!valid" :loading="submitting" large color="secondary" class="submit" @click="submit"><v-icon medium class="save-icon">save</v-icon>{{ content.submit }}</v-btn>
    </v-form>
    <v-snackbar v-model="result" color="secondary">
      <div class="result-text">{{ resultText }}</div>
      <template v-slot:action="{ attrs }">
        <v-btn :color="error ? 'pink' : 'success'" text v-bind="attrs" @click="result = false">{{ content.close }}</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import ParseForSelect from "@/util/parseForSelect";
import config from "@/config.json";

let content = WebContent.GuildLogs[localStorage.getItem('language')]

export default {
  name: 'Logs',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    categories: ['messages', 'roles', 'moderation'],
    logs: {
      messages: ['messageDelete', 'messageEdit', 'messageDeleteBulk'],
      roles: ['roleCreate', 'roleEdit', 'roleDelete'],
      moderation: ['moderationWarn', 'moderationMute', 'moderationKick', 'moderationBan',
      'moderationUnmute', 'moderationUnban']
    },
    settings: {
      logs: {
        list: {}
      },
      ignore: {
        channels: []
      }
    },
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  computed: {
    channels() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if(!guild) return [];
      return ParseForSelect.channels(guild.channels, {none: false})
    }
  },
  methods: {
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/logs`, {method: 'POST', headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }, body: JSON.stringify(this.settings.logs)})
      if(response.ok) {
        this.error = false;
        this.resultText = content.submitted;
        this.result = true;
      }
      else {
        this.error = true;
        this.resultText = content.error;
        this.result = true;
      }
      this.submitting = false;
    },
  },
  async mounted() {
    let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/settings`, {headers: {
        Authorization: localStorage.getItem('token')
      }})
    let body = await response.json()
    if(!response.ok) return window.location.replace('/@me');
    this.settings = body;
    this.loading = false;
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
}
.channels-select {
  width: 95%;
}
.channel-select {
  max-width: 229px;
  display: inline-block;
}
.switch {
  display: inline-block;
}
.category {
  font-size:  1.5em;
  padding: 26px 26px!important;
}
.logs {
  width: 95%;
}
.log {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-top: 4px;
  word-break: break-all;
}
.log-name {
  font-size: 1em;
}
.save-icon {
  margin-right: 5px;
}
.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
.result-text {
  font-size: 1.4em;
}
</style>