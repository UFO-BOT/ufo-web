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
import Cookies from '@/util/cookies'
import config from "@/config.json";

let cookies = Cookies.parse()
let content = WebContent.GuildGeneral[cookies.language]

export default {
  name: 'General',
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
        }, body: JSON.stringify({
          prefix: this.settings.prefix,
          language: {
            commands: this.settings.language.commands,
            interface: this.settings.language.interface
          }
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
.subtitle {
  font-size: 1.2em;
}
.prefix {
  width: 80%;
}
.language {
  width: 250px;
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