<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.work }}</div>
      <div class="subsubtitle">{{ content.subtitles.salary }}</div>
      <v-text-field :rules="rules.positiveInteger" v-model="settings.work.low" type="number" :label="content.subtitles.from" class="number-input"></v-text-field>
      <v-text-field :rules="rules.positiveInteger" v-model="settings.work.high" type="number" :label="content.subtitles.to" class="number-input"></v-text-field>
      <br>
      <div class="subsubtitle">{{ content.subtitles.cooldown }}</div>
      <v-text-field v-model="settings.work.cooldown" type="number" :label="content.subtitles.cooldown" class="number-input"></v-text-field>
      <v-select v-model="settings.work.cooldownUnit" :items="content.units" :label="content.subtitles.unit" class="unit-select"></v-select>
      <br>
      <div class="subtitle">{{ content.subtitles.moneybags }}</div>
      <div class="subsubtitle">{{ content.subtitles.money }}</div>
      <v-text-field :rules="rules.integer" v-model="settings.moneybags.low" type="number" :label="content.subtitles.from" class="number-input"></v-text-field>
      <v-text-field :rules="rules.integer" v-model="settings.moneybags.high" type="number" :label="content.subtitles.to" class="number-input"></v-text-field>
      <br>
      <div class="subsubtitle">{{ content.subtitles.cooldown }}</div>
      <v-text-field v-model="settings.moneybags.cooldown" type="number" :label="content.subtitles.cooldown" class="number-input"></v-text-field>
      <v-select v-model="settings.moneybags.cooldownUnit" :items="content.units" :label="content.subtitles.unit" class="unit-select"></v-select>
      <br>
      <div class="subtitle">{{ content.subtitles.commission }}</div>
      <v-text-field :rules="rules.commission" v-model="settings.commission" type="number" :label="content.subtitles.percent" prefix="%" class="number-input"></v-text-field>
      <div class="subtitle">{{ content.subtitles.minbets }}</div>
      <v-text-field v-for="minbet of content.subtitles.minbetsList" :rules="rules.positiveInteger" v-model="settings.minbets[minbet.prop]" type="number" :label="minbet.name" class="number-input"></v-text-field>
      <br>
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
let content = WebContent.GuildEconomy[cookies.language]

export default {
  name: 'Economy',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    settings: {
      work: {
        low: 0,
        high: 0,
        cooldown: 0,
        cooldownUnit: 'seconds'
      },
      moneybags: {
        low: 0,
        high: 0,
        cooldown: 0,
        cooldownUnit: 'seconds'
      },
      commission: 0
    },
    rules: {
      commission: [
          number => (number >= 0 && number <= 100 && !(number % 1)) || content.errors.invCommission
      ],
      positiveInteger: [
          number => (number >= 0 && !(number % 1)) || content.errors.invPosNumber
      ],
      integer: [
        number => !(number % 1) || content.errors.invNumber
      ]
    },
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  methods: {
    getTime(time, unit) {
      let multipliers = {
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000
      }
      return time * multipliers[unit]
    },
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/economy`, {
        method: 'POST', headers: {
          Authorization: cookies.token,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          work: {
            low: Math.min(this.settings.work.low, this.settings.work.high),
            high: Math.max(this.settings.work.low, this.settings.work.high),
            cooldown: this.getTime(this.settings.work.cooldown, this.settings.work.cooldownUnit)
          },
          moneybags: {
            low: Math.min(this.settings.moneybags.low, this.settings.moneybags.high),
            high: Math.max(this.settings.moneybags.low, this.settings.moneybags.high),
            cooldown: this.getTime(this.settings.moneybags.cooldown, this.settings.moneybags.cooldownUnit)
          },
          commission: this.settings.commission,
          minbets: this.settings.minbets
        })
      })
      if (response.ok) {
        this.error = false;
        this.resultText = content.submitted;
        this.result = true;
      } else {
        this.error = true;
        this.resultText = content.error;
        this.result = true;
      }
      this.submitting = false;
    },
  },
  async mounted() {
    let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/settings`, {
      headers: {
        Authorization: cookies.token
      }
    })
    let body = await response.json()
    if (!response.ok) return window.location.replace('/@me');
    this.settings = body;
    this.settings.work.cooldown = body.work.cooldown / 1000
    this.settings.work.cooldownUnit = 'seconds'
    this.settings.moneybags.cooldown = body.moneybags.cooldown / 1000
    this.settings.moneybags.cooldownUnit = 'seconds'
    this.loading = false;
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
}
.subsubtitle {
  font-size: 1.1em;
  color: grey;
}
.number-input {
  width: 100px;
  display: inline-block;
  margin-right: 20px;
}
.unit-select {
  width: 200px;
  display: inline-block;
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