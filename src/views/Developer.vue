<template>
  <div style="padding: 10px 15px">
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
                           indeterminate></v-progress-circular>
    </div>
    <div v-if="!loading">
      <div class="subtitle">{{ content.subtitles.eval }}</div>
      <v-textarea v-model="input" filled :label="content.subtitles.input" class="textarea ma-0 pa-0"></v-textarea>
      <v-textarea v-model="output" readonly filled :label="content.subtitles.output" class="textarea ma-0 pa-0"></v-textarea>
      <v-checkbox v-model="shell" :label="content.subtitles.shell" class="ma-0 pa-0 fit-content"></v-checkbox>
      <v-checkbox v-model="noAwait" :label="content.subtitles.noAwait" class="ma-0 pa-0  fit-content"></v-checkbox>
      <v-btn color="secondary" :loading="evaling" large @click="evalInput" class="submit">{{ content.subtitles.eval }}</v-btn>
      <div class="subtitle">{{ content.subtitles.reload }}</div>
      <v-checkbox v-model="gitpull" :label="content.subtitles.gitpull" class="mt-1 pa-0  fit-content"></v-checkbox>
      <v-select v-model="scopes" class="scopes-select ma-0 pa-0" :label="content.subtitles.scopes" multiple chips deletable-chips :items="content.subtitles.reloadScopes"></v-select>
      <v-btn color="secondary" :loading="reloading" large @click="reload" class="submit">{{ content.subtitles.reload }}</v-btn>
      <v-snackbar v-model="reloadResult" color="secondary">
        <div class="result-text">{{ reloadResultText }}</div>
        <template v-slot:action="{ attrs }">
          <v-btn :color="reloadError ? 'pink' : 'success'" text v-bind="attrs" @click="reloadResult = false">{{ content.close }}</v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'

let cookies = Cookies.parse()
let content = WebContent.developer[cookies.language]

export default {
  name: 'Leaderboard',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    evaling: false,
    reloading: false,
    input: '',
    output: '',
    shell: false,
    noAwait: false,
    gitpull: false,
    scopes: [],
    reloadResult: false,
    reloadError: false,
    reloadResultText: ''
  }),
  methods: {
    async evalInput() {
      this.evaling = true;
      let res = await fetch(`${config.API}/private/dev/eval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        }, body: JSON.stringify({
          noAwait: this.noAwait,
          shell: this.shell,
          input: this.input
        })
      })
      let body = await res.json();
      if(res.ok) {
        this.output = `${content.subtitles.doneIn}: ${body.time} ms\n${content.subtitles.type}: ${body.type}\n${body.output}`
      }
      else {
        this.output = `${body.name}\n${body.message}`
      }
      this.evaling = false;
    },
    async reload() {
      this.reloading = true;
      let res = await fetch(`${config.API}/private/dev/reload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        }, body: JSON.stringify({
          gitpull: this.gitpull,
          scopes: this.scopes
        })
      })
      let body = await res.json();
      if(res.ok) {
        this.reloadError = false;
        this.reloadResultText = content.reloaded;
        this.reloadResult = true;
      }
      else {
        this.reloadError = true;
        this.reloadResultText = content.error;
        this.reloadResult = true;
      }
      this.reloading = false;
    }
  },
  async mounted() {
    let res = await fetch(`${config.API}/private/dev/eval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies.token
      }, body: JSON.stringify({
        input: '1'
      })
    })
    if(res.ok) this.loading = false;
    else window.location.replace('/')
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.4em;
}

.textarea {
  width: 90%;
}

.scopes-select {
  width: 200px;
}

.submit {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.result-text {
  font-size: 1.4em;
}
</style>