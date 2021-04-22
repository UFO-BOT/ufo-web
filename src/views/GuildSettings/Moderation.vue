<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-model="valid" v-if="!loading">
      <div class="subtitle">{{ content.subtitles.muterole }}</div>
      <v-select v-model="settings.muterole" :items="roles" :label="content.subtitles.selectRole"
                class="role-select"></v-select>
      <div class="subtitle">{{ content.subtitles.automoderation }}</div>
      <div class="settings-list">
        <v-progress-circular v-if="loadingAutomods" :size="40" :width="4" style="display: block"
                             indeterminate></v-progress-circular>
        <div v-if="!loadingAutomods" v-for="(name, automod, i) of content.subtitles.automods">
          <div class="settings-list-item">
            <div class="settings-list-item-name text-truncate">{{ name }}</div>
            <div>
              <Automoderation :automod="automods.find(a => a.type === automod) || defaultAutomod" :type="automod"
                              :name="name"></Automoderation>
            </div>
          </div>
          <v-divider v-if="Object.keys(content.subtitles.automods).length - 1 > i"></v-divider>
        </div>
      </div>
      <div class="subtitle">{{ content.subtitles.warnsPunishments }}</div>
      <div class="settings-list">
        <div v-for="(warnsPunishment, i) of settings.warnsPunishments">
          <div class="wp-flex">
            <div class="punishment-title">{{ content.subtitles.punishment }} {{ i + 1 }}</div>
            <v-btn icon @click="settings.warnsPunishments.splice(i, 1)">
              <v-icon color="red">delete</v-icon>
            </v-btn>
          </div>
          <v-text-field v-model="warnsPunishment.warns" class="warns-count mt-0" :rules="rules.warns"
                        :label="content.subtitles.warns"/>
          <v-select v-model="warnsPunishment.punishment.type" class="punishment-select"
                    :label="content.subtitles.punishment" :items="punishments"/>
          <DurationPicker v-if="punishments.find(p => p.value === warnsPunishment.punishment.type).duration"
                          v-model="warnsPunishment.punishment.duration"
                          class="duration-input"
                          :label="content.subtitles.duration"
                          :required="punishments.find(p => p.value === warnsPunishment.punishment.type).durationRequired"
          />
          <v-divider/>
        </div>
        <div v-if="settings.warnsPunishments.length" class="mb-3"></div>
        <v-btn color="primary" outlined
               v-if="settings.warnsPunishments.length < 10"
               @click="settings.warnsPunishments.push({warns: 0, punishment: {type: 'kick', duration: 0}})">
          <v-icon medium class="mr-1">add</v-icon>
          {{ content.subtitles.add }}
        </v-btn>
        <div v-else class="wpLimit">{{ content.errors.wpLimit }}</div>
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
import config from "@/config.json";
import ParseForSelect from "@/util/parseForSelect";

import Automoderation from "@/components/Automoderation";
import DurationPicker from "@/components/DurationPicker";

let content = WebContent.GuildModeration[localStorage.getItem('language')]

export default {
  name: 'General',
  components: {DurationPicker, Automoderation},
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    loading: true,
    valid: true,
    loadingAutomods: true,
    settings: {
      muterole: null
    },
    automods: [],
    defaultAutomod: {
      enabled: false,
      punishment: {},
      whitelist: {
        roles: [],
        channels: []
      }
    },
    punishments: [
      {text: content.subtitles.punishments.mute, value: 'mute', duration: true},
      {text: content.subtitles.punishments.kick, value: 'kick'},
      {text: content.subtitles.punishments.softban, value: 'softban'},
      {text: content.subtitles.punishments.ban, value: 'ban'},
      {text: content.subtitles.punishments.tempban, value: 'tempban', duration: true, durationRequired: true},
    ],
    rules: {
      warns: [
        warns => (warns > 0 && !(warns % 1)) || content.errors.invalidWarns
      ]
    },
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  computed: {
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.roles(guild.roles, {none: !this.settings.muterole})
    }
  },
  methods: {
    async loadAutomods() {
      this.loadingAutomods = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/automods`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      if (!response.ok) return this.automods = [];
      this.automods = await response.json();
      this.loadingAutomods = false;
    },
    async submit() {
      this.submitting = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/moderation`, {
        method: 'POST', headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          muterole: this.settings.muterole,
          warnsPunishments: this.settings.warnsPunishments
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
        Authorization: localStorage.getItem('token')
      }
    })
    let body = await response.json()
    if (!response.ok) return window.location.replace('/@me');
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

.settings-list {
  background-color: var(--v-block-base);
  box-shadow: 0 0 5px var(--v-blockShadow-base);
  padding: 15px 15px 15px 20px;
  margin-bottom: 15px;
  width: 90%;
  border-radius: 5px;
  margin-top: 5px;
}

.settings-list-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 8px;
}

.settings-list-item-name {
  font-size: 1.5em;
}

.wp-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 5px;
}

.punishment-title {
  font-size: 1.2em;
}

.warns-count {
  width: 95%;
}

.punishment-select {
  width: 200px;
  display: inline-block;
  margin-right: 20px !important;
}

.duration-input {
  display: inline-block;
  margin-bottom: 10px;
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

.wpLimit {
  font-size: 1.1em;
  color: var(--v-opacityColor-base);
  margin-top: 5px;
}
</style>