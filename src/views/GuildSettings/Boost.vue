<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.messageMoney }}</div>
      <v-text-field v-model="settings.messagemoney.chance" type="number" :rules="rules.messagemoney.chance" :label="content.subtitles.chance" suffix="%" class="number-input"></v-text-field>
      <v-text-field v-model="settings.messagemoney.amount" type="number" :rules="rules.messagemoney.amount"  :label="content.subtitles.amount" class="number-input"></v-text-field>
      <div class="subtitle">{{ content.subtitles.moneyBonuses }}</div>
      <v-text-field v-model="settings.moneybonuses.daily" type="number" :rules="rules.moneybonuses" :label="content.subtitles.dailyBonus" class="number-input"></v-text-field>
      <v-text-field v-model="settings.moneybonuses.weekly" type="number" :rules="rules.moneybonuses" :label="content.subtitles.weeklyBonus" class="number-input"></v-text-field>
      <br>
      <div class="subtitle">{{ content.subtitles.punishmentsDM }}</div>
      <v-textarea counter="1500" v-model="settings.kickdm" :rules="rules.template" filled :label="content.subtitles.kickdm" :placeholder="content.subtitles.template" class="template"></v-textarea>
      <v-textarea counter="1500" v-model="settings.bandm" :rules="rules.template" filled :label="content.subtitles.bandm" :placeholder="content.subtitles.template" class="template"></v-textarea>
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
import config from "@/config.json";

let content = WebContent.GuildBoost[localStorage.getItem('language')]

export default {
  name: 'Boost',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    settings: {
      messagemoney: {
        chance: 0,
        amount: 0
      },
      moneybonuses: {
        daily: 0,
        weekly: 0
      },
      kickdm: '',
      bandm: ''
    },
    rules: {
      messagemoney: {
        chance: [
          chance => (chance >= 0 && chance <= 5 && !(chance % 1)) || content.errors.invChance
        ],
        amount: [
          amount => (amount >= 0 && !(amount %  1)) || content.errors.invAmount
        ]
      },
      moneybonuses: [
          moneybonus => (moneybonus >= 0 && !(moneybonus % 1)) || content.errors.invMoneyBonus
      ],
      template: [
          template => template.length <= 1500 || content.errors.invLength
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
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/boost`, {method: 'POST', headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          messagemoney: {
            chance: this.settings.messagemoney.chance,
            amount: this.settings.messagemoney.amount
          },
          moneybonuses: {
            daily: this.settings.moneybonuses.daily,
            weekly: this.settings.moneybonuses.weekly
          },
          kickdm: this.settings.kickdm,
          bandm: this.settings.bandm
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
.number-input {
  width: 200px;
  display: inline-block;
  margin-right: 50px;
}
.template {
  width: 90%;
  margin-top: 5px!important;
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