<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.muterole }}</div>
      <v-select v-model="settings.muterole" :items="roles" :label="content.subtitles.selectRole" class="role-select"></v-select>
      <div class="subtitle">{{ content.subtitles.automoderation }}</div>
      <div class="automods">
        <v-progress-circular v-if="loadingAutomods" :size="40" :width="4" color="white" style="display: block"
                             indeterminate></v-progress-circular>
        <div v-if="!loadingAutomods" v-for="(name, automod, i) of content.subtitles.automods">
          <div class="automod">
            <div class="automod-name text-truncate">{{ name }}</div>
            <div>
              <Automoderation :automod="automods.find(a => a.type === automod) || defaultAutomod" :type="automod" :name="name"></Automoderation>
            </div>
          </div>
          <v-divider v-if="Object.keys(content.subtitles.automods).length - 1 > i"></v-divider>
        </div>
      </div>
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
import ParseForSelect from "@/util/parseForSelect";

import Automoderation from "@/components/Automoderation";

let cookies = Cookies.parse()
let content = WebContent.GuildModeration[cookies.language]

export default {
  name: 'General',
  components: {Automoderation},
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    loadingAutomods: true,
    settings: {
    },
    automods: [],
    defaultAutomod: {
      enabled: false,
      punishment: {

      },
      whitelist: {
        roles: [],
        channels: []
      }
    },
    rules: {
    },
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  computed: {
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if(!guild) return [];
      return ParseForSelect.roles(guild.roles, {none: !this.settings.muterole})
    }
  },
  methods: {
    async loadAutomods() {
      this.loadingAutomods = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/automods`, {headers: {
          Authorization: cookies.token
        }})
      if(!response.ok) return this.automods = [];
      this.automods = await response.json();
      this.loadingAutomods = false;
    },
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/moderation`, {method: 'POST', headers: {
          Authorization: cookies.token,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          muterole: this.settings.muterole
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
    this.loadAutomods()
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
}

.role-select {
  width: 220px;
}

.automods {
  background-color: #1e1e1e;
  padding: 15px 15px 15px 20px;
  width: 90%;
  border-radius: 5px;
  box-shadow: 0 0 10px #343434;
  margin-top: 5px;
}

.automod {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 8px;
}

.automod-name {
  font-size: 1.5em;
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