<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.prefix }}</div>
      <v-text-field v-model="settings.prefix" counter="20" :rules="rules.prefix" :label="content.subtitles.prefix" class="prefix"></v-text-field>
      <div class="subtitle">{{ content.subtitles.language }}</div>
      <v-select v-model="settings.language.commands" :items="languages" :label="content.subtitles.commands" class="language"></v-select>
      <v-select v-model="settings.language.interface" :items="languages" :label="content.subtitles.interface" class="language"></v-select>
      <v-btn :disabled="!valid" :loading="submitting" large color="secondary" class="submit" @click="submit">{{ content.submit }}</v-btn>
    </v-form>
    <v-snackbar v-model="result" :timeout="5000" color="secondary">
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
import config from "@/config.json";

let cookies = Cookies.parse()
let content = WebContent.GuildGeneral[cookies.language]

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
      prefix: '',
      language: {
        commands: '',
        interface: ''
      }
    },
    rules: {
      prefix: [
          prefix => !!prefix || content.errors.noPrefix,
          prefix => prefix.length <= 20 || content.errors.prefixLength,
          prefix => !prefix.match(/[`| ]/gmi) || content.errors.invalidChars
      ]
    },
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  methods: {
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/general`, {method: 'POST', headers: {
          Authorization: cookies.token,
          'Content-Type': 'application/json'
        }, body: JSON.stringify(this.settings)})
      let body = await response.json()
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
    this.settings.prefix = body.prefix;
    this.settings.language = body.language;
    this.loading = false;
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
  margin: 0;
}
.prefix {
  width: 80vw;
}
.language {
  width: 250px;
}
.submit {
  margin-top: 10px;
  font-size: 1.1em;
}
.result-text {
  font-size: 1.4em;
}
</style>