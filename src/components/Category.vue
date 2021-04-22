<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <v-card color="modal">
        <v-toolbar dark color="primary">
          <v-btn icon dark :disabled="loading" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ category }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :disabled="!valid" :loading="loading" @click="editCategory">
              <v-icon medium class="save-icon">save</v-icon>
              {{ content.submit }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="command-settings">
          <v-form ref="form" v-model="valid">
            <div class="subtitle">{{ content.subtitles.general }}</div>
            <v-switch v-model="settings.enabled" :label="content.subtitles.enabled" class="fit-content mt-1"></v-switch>
            <v-checkbox v-model="settings.deleteUsage" :disabled="!settings.enabled" :label="content.subtitles.deleteUsage" class="fit-content ma-0"></v-checkbox>
            <div class="subtitle">{{ content.subtitles.perms }}</div>
            <v-select
                v-for="perm of permsList"
                v-model="settings[perm]"
                class="perms-select mb-2"
                multiple chips deletable-chips
                :label="content.subtitles[perm].name"
                :hint="content.subtitles[perm].description"
                persistent-hint
                :disabled="!settings.enabled"
                :items="perm.toLowerCase().includes('roles') ? roles : channels">
            </v-select>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import config from "@/config.json";
import ParseForSelect from "@/util/parseForSelect";

let content = WebContent.GuildCommands[localStorage.getItem('language')]

export default {
  name: "Category",
  props: ['name', 'category'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    valid: true,
    settings: {
      enabled: true,
      deleteUsage: false,
      allowedRoles: [],
      forbiddenRoles: [],
      allowedChannels: [],
      forbiddenChannels: []
    },
    permsList: ['allowedRoles', 'forbiddenRoles', 'allowedChannels', 'forbiddenChannels']
  }),
  computed: {
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.roles(guild.roles, {checkBotManageable: false})
    },
    channels() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if(!guild) return [];
      return ParseForSelect.channels(guild.channels, {none: false})
    }
  },
  methods: {
    async editCategory() {
      this.loading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/categories/${this.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify(this.settings)
      })
      if(response.ok) {
        this.dialog = false;
        this.$emit('updated', this.name, this.settings)
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
}

.command-settings {
  padding: 15px;
}

.perms-select {
  width: 95%;
}

.save-icon {
  margin-right: 5px;
}
</style>