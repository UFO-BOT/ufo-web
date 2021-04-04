<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.work }}</div>
      <div class="subsubtitle">{{ content.subtitles.salary }}</div>
      <v-text-field :rules="rules.positiveInteger" v-model="settings.work.low" type="number"
                    :label="content.subtitles.from" class="number-input"></v-text-field>
      <v-text-field :rules="rules.positiveInteger" v-model="settings.work.high" type="number"
                    :label="content.subtitles.to" class="number-input"></v-text-field>
      <br>
      <div class="subsubtitle">{{ content.subtitles.cooldown }}</div>
      <v-text-field v-model="settings.work.cooldown" type="number" :label="content.subtitles.cooldown" :rules="rules.positiveInteger"
                    class="number-input"></v-text-field>
      <v-select v-model="settings.work.cooldownUnit" :items="content.subtitles.units" :label="content.subtitles.unit"
                class="unit-select"></v-select>
      <br>
      <div class="subtitle">{{ content.subtitles.moneybags }}</div>
      <div class="subsubtitle">{{ content.subtitles.money }}</div>
      <v-text-field :rules="rules.integer" v-model="settings.moneybags.low" type="number"
                    :label="content.subtitles.from" class="number-input"></v-text-field>
      <v-text-field :rules="rules.integer" v-model="settings.moneybags.high" type="number" :label="content.subtitles.to"
                    class="number-input"></v-text-field>
      <br>
      <div class="subsubtitle">{{ content.subtitles.cooldown }}</div>
      <v-text-field v-model="settings.moneybags.cooldown" type="number" :label="content.subtitles.cooldown" :rules="rules.positiveInteger"
                    class="number-input"></v-text-field>
      <v-select v-model="settings.moneybags.cooldownUnit" :items="content.subtitles.units" :label="content.subtitles.unit"
                class="unit-select"></v-select>
      <br>
      <div class="subtitle">{{ content.subtitles.moneysymb }}</div>
      <v-text-field v-model="settings.moneysymb" :label="content.subtitles.symbol" outlined :hint="content.subtitles.moneysymbhint" persistent-hint
                class="monsymb-input mt-1 mb-1"></v-text-field>
      <div class="subtitle">{{ content.subtitles.commission }}</div>
      <v-text-field :rules="rules.commission" v-model="settings.commission" type="number"
                    :label="content.subtitles.percent" suffix="%" class="number-input"></v-text-field>
      <v-checkbox class="ma-0 pa-0 fit-content" v-model="settings.duelCommission" :label="content.subtitles.duelCommission"></v-checkbox>
      <div class="subtitle">{{ content.subtitles.minbets }}</div>
      <v-text-field v-for="(minbet, i) of content.subtitles.minbetsList" :key="i" :rules="rules.positiveInteger"
                    v-model="settings.minbets[minbet.prop]" type="number" :label="minbet.name"
                    class="number-input"></v-text-field>
      <br>
      <div class="subtitle">{{ content.subtitles.resetBalance }}</div>
      <ResetBalance :guild="guild"></ResetBalance>
      <br>
      <div class="subtitle">{{ content.subtitles.shop }}</div>
      <div class="items">
        <v-progress-circular v-if="loadingItems" :size="40" :width="4" style="display: block"
                             indeterminate></v-progress-circular>
        <div v-if="items.length <= 0 && !loadingItems">
          <div style="margin-bottom: 5px;font-size: 1.1em">¯\_(ツ)_/¯</div>
          <v-divider></v-divider>
        </div>
        <div v-if="items.length && !loadingItems" v-for="item of items">
          <div class="item">
            <div class="item-name text-truncate">{{ item.name }}</div>
            <div>
              <EditItem :item="item" @edited="loadItems" class="item-action"></EditItem>
              <DeleteItem :item="item" @deleted="loadItems" class="item-action"></DeleteItem>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
        <CreateItem v-if="!loadingItems" :limit="items.length >= (guild.boost ? 40 : 15)" @created="loadItems"></CreateItem>
      </div>
      <v-btn :disabled="!valid" :loading="submitting" large color="secondary" class="submit" @click="submit">
        <v-icon medium class="save-icon">save</v-icon>
        {{ content.submit }}
      </v-btn>
    </v-form>
    <v-snackbar v-model="result" color="secondary">
      <div class="result-text">{{ resultText }}</div>
      <template v-slot:action="{ attrs }">
        <v-btn :color="error ? 'pink' : 'success'" text v-bind="attrs" @click="result = false">{{
            content.close
          }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from "@/config.json";

import CreateItem from "@/components/items/CreateItem";
import EditItem from "@/components/items/EditItem";
import DeleteItem from "@/components/items/DeleteItem";
import ResetBalance from "@/components/ResetBalance";

let cookies = Cookies.parse()
let content = WebContent.GuildEconomy[cookies.language]

export default {
  name: 'Economy',
  metaInfo: {
    title: content.title
  },
  components: {
    ResetBalance,
    CreateItem,
    EditItem,
    DeleteItem
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
      moneysymb: '<:money:705401895019348018>',
      commission: 0,
      duelCommission: false
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
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  computed: {
    guild() {
      return this.$store.getters.guilds.find(g => g.id === this.$route.params.id) || {name: ''}
    }
  },
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
      this.items.forEach((item, i) => {
        this.items[i].newName = item.name
      })
      this.loadingItems = false;
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
          moneysymb: this.settings.moneysymb,
          commission: this.settings.commission,
          duelCommission: this.settings.duelCommission,
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
  width: 120px;
  display: inline-block;
  margin-right: 20px;
}

.monsymb-input {
  width: 280px;
  margin-right: 20px!important;
}

.unit-select {
  width: 120px;
  display: inline-block;
}

.items {
  background-color: var(--v-block-base);
  box-shadow: 0 0 5px var(--v-blockShadow-base);
  padding: 15px 15px 15px 20px;
  margin-bottom: 15px;
  width: 90%;
  border-radius: 5px;
  margin-top: 5px;
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

.item-action {
  display: inline;
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