<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.jm }}</div>
      <v-select v-model="settings.jmchan" :items="channels" :label="content.subtitles.channel" class="channel-select"></v-select>
      <v-textarea :disabled="settings.jmchan === 'none'" v-model="settings.jm" filled :label="content.subtitles.template" class="template"></v-textarea>
      <div class="subtitle">{{ content.subtitles.lm }}</div>
      <v-select v-model="settings.lmchan" :items="channels" :label="content.subtitles.channel" class="channel-select"></v-select>
      <v-textarea :disabled="settings.lmchan === 'none'" v-model="settings.lm" filled :label="content.subtitles.template" class="template"></v-textarea>
      <div class="subtitle">{{ content.subtitles.jdm }}</div>
      <v-textarea v-model="settings.jdm" filled :label="content.subtitles.template" style="margin-top: 5px" class="template"></v-textarea>
      <v-btn :disabled="!valid" :loading="submitting" large color="secondary" class="submit" @click="submit">{{ content.submit }}</v-btn>
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
import Cookies from '@/util/Cookies'
import ParseForSelect from "@/util/ParseForSelect";
import config from "@/config.json";

let cookies = Cookies.parse()
let content = WebContent.GuildGreetings[cookies.language]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    languages: [{text: content.ru, value: 'ru'}, {text: content.en, value: 'en'}],
    settings: {
      jmchan: 'none',
      jm: '',
      lmchan: 'none',
      lm: '',
      jdm: ''
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
      return ParseForSelect.channels(guild.channels)
    }
  },
  methods: {
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/greetings`, {method: 'POST', headers: {
          Authorization: cookies.token,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          jmchan: this.settings.jmchan,
          jm: this.settings.jm,
          lmchan: this.settings.lmchan,
          lm: this.settings.lm,
          jdm: this.settings.jdm
        })})
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
        Authorization: cookies.token
      }})
    let body = await response.json()
    if(!response.ok) return window.location.replace('/@me');
    this.settings = body;
    this.loading = false;
  }
}
</script>

<style scoped>
.channel-select {
  width: 250px;
}
.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
.result-text {
  font-size: 1.4em;
}
.template {
  width: 90%;
}
</style>