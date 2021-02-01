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
      <div class="subtitle" style="margin-bottom: 5px">Магазин</div>
      <v-progress-circular v-if="loadingItems" :size="40" :width="4" color="white" style="display: block" indeterminate></v-progress-circular>
      <div class="items" v-if="!loadingItems">
        <div v-for="item of items">
          <div class="item">
            <div class="item-name">{{ item.name }}</div>
            <div>
              <v-btn icon class="item-action"><v-icon class="item-action">settings</v-icon></v-btn>
              <v-dialog v-model="deleteDialogs[item.name]" width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon class="item-action" v-bind="attrs" v-on="on"><v-icon color="red">delete</v-icon></v-btn>
                </template>
                <v-card>
                  <v-card-title>Удалить товар</v-card-title>
                  <v-card-text>
                    Вы действительно хотите удалить товар <code>{{ item.name }}</code>? Это действие не может быть отменено
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="deleteItem(item.name)" :loading="deleteLoading" text>Удалить</v-btn>
                    <v-btn text @click="deleteDialogs[item.name] = false">Отмена</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
        <v-btn class="create-item-btn" color="primary" outlined>Создать товар</v-btn>
      </div>
      <!-- <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Open Dialog
          </v-btn>
        </template>
        <v-card> <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card>
      </v-dialog> -->
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
    loadingItems: true,
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
    items: [],
    deleteDialogs: {},
    deleteLoading: false,
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
    async loadItems() {
      this.loadingItems = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items`, {
        headers: {
          Authorization: cookies.token
        }
      })
      let body = await response.json()
      if (!response.ok) return this.items = [];
      this.items = body;
      this.loadingItems = false;
    },
    async deleteItem(name) {
      this.deleteLoading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: {
          Authorization: cookies.token
        }
      })
      this.deleteLoading = false;
      if(response.ok) {
        this.deleteDialogs[name] = false;
        this.loadItems()
      }
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
    this.loadItems()
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
.items {
  background-color: #1e1e1e;
  padding: 15px 15px 15px 20px;
  width: 90%;
}
.item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 8px;
}
.item-name {
  font-size: 1.5em;
}
.create-item-btn {
  margin-top: 12px;
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