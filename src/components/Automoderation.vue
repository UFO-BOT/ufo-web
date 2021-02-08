<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :disabled="!valid" :loading="loading" @click="editAutomod">
              <v-icon medium class="save-icon">save</v-icon>
              {{ content.submit }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="item-settings">
          <v-form ref="form" v-model="valid">
            <div class="subtitle">{{ content.subtitles.general }}</div>
            <v-switch v-model="automod.enabled" class="fit-content mt-1" :label="content.subtitles.enabled"></v-switch>
            <v-select v-model="automod.punishment.type" :items="punishments" :disabled="!automod.enabled"
                      :label="content.subtitles.punishment" class="punishment-select"></v-select>
            <v-textarea v-model="automod.punishment.reason" filled :disabled="!automod.enabled" counter="512"
                        :rules="rules.reason" :label="content.subtitles.reason" class="general-automod-field pa-0"></v-textarea>
            <div v-if="automod.punishment.type && punishments.find(p => p.value === automod.punishment.type).duration">
              <div class="subtitle">{{ content.subtitles.duration }}</div>
              <v-text-field v-model="automod.punishment.duration" :disabled="!automod.enabled" type="number"
                            :rules="punishments.find(p => p.value === automod.punishment.type).durationRequired ? rules.duration : null"
                            :label="content.subtitles.duration"
                            :hint="!punishments.find(p => p.value === automod.punishment.type).durationRequired ? content.subtitles.infinityDuration : null"
                            class="number-input mt-0"></v-text-field>
              <v-select v-model="automod.punishment.durationUnit" :disabled="!automod.enabled"
                        :items="content.subtitles.units" :label="content.subtitles.unit"
                        class="unit-select mt-0"></v-select>
            </div>
            <div class="subtitle">{{ content.subtitles.whitelist }}</div>
            <div class="automod-flex">
              <div>
                <v-select v-model="automod.whitelist.roles" :disabled="!automod.enabled" :items="roles"
                          class="whitelist-select mt-0" :label="content.subtitles.roles" multiple chips
                          deletable-chips></v-select>
              </div>
              <div>
                <v-select v-model="automod.whitelist.channels" :disabled="!automod.enabled" :items="channels"
                          class="whitelist-select mt-0" :label="content.subtitles.channels" multiple chips
                          deletable-chips></v-select>
              </div>
            </div>
            <div class="subtitle">{{ content.subtitles.rest }}</div>
            <div v-if="type === 'invites'">
              <v-combobox v-model="automod.whitelistGuilds" :disabled="!automod.enabled" multiple chips deletable-chips
                          :label="content.subtitles.allowedServers"></v-combobox>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from "@/config.json";
import ParseForSelect from "@/util/parseForSelect";

let cookies = Cookies.parse()
let content = WebContent.GuildModeration[cookies.language]

export default {
  name: "Automoderation",
  props: ['automod', 'type', 'name'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    valid: true,
    punishments: [
      {text: content.subtitles.punishments.warn, value: 'warn'},
      {text: content.subtitles.punishments.mute, value: 'mute', duration: true},
      {text: content.subtitles.punishments.kick, value: 'kick'},
      {text: content.subtitles.punishments.softban, value: 'softban'},
      {text: content.subtitles.punishments.ban, value: 'ban'},
      {text: content.subtitles.punishments.tempban, value: 'tempban', duration: true, durationRequired: true},
    ]
  }),
  computed: {
    channels() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.channels(guild.channels, {
        none: false,
        checkBotManageable: false,
        checkMemberManageable: false
      })
    },
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.roles(guild.roles, {none: false, checkBotManageable: false, checkMemberManageable: false})
    },
    rules() {
      return {
        reason: [
          reason => reason.length <= 512 || content.errors.reasonLength
        ],
        duration: [
          duration => (duration >= 0 && !(duration % 1)) || content.errors.invalidDuration,
          () => (this.getTime(this.automod.punishment.duration, this.automod.punishment.durationUnit) <= 315360000000) || content.errors.tooLongDuration
        ]
      }
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
    async editAutomod() {
      this.loading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/automod/${this.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        },
        body: JSON.stringify({
          enabled: this.automod.enabled,
          punishment: {
            type: this.automod.punishment.type,
            duration: this.getTime(this.automod.punishment.duration, this.automod.punishment.durationUnit),
            reason: this.automod.punishment.reason
          },
          whitelist: {
            roles: this.automod.whitelist.roles,
            channels: this.automod.whitelist.channels
          },
          whitelistGuilds: this.automod.whitelistGuilds
        })
      })
      this.loading = false;
      if (response.ok) this.dialog = false;
    }
  },
  mounted() {
    this.automod.punishment.duration = (this.automod.punishment.duration || 0) / 1000
    this.automod.punishment.durationUnit = 'seconds'
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
}

.punishment-select {
  width: 200px;
  padding: 0;
}

.number-input {
  width: 120px;
  display: inline-block;
  margin-right: 20px;
}

.unit-select {
  width: 120px;
  display: inline-block;
}

.whitelist-select {
  width: 300px
}

.automod-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item-settings {
  padding: 15px;
}

.save-icon {
  margin-right: 5px;
}
</style>