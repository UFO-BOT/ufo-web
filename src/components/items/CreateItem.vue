<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="create-item-btn" color="primary" v-if="!limit" v-bind="attrs" v-on="on" outlined>
          <v-icon medium class="mr-1">add</v-icon>
          {{ content.subtitles.create }}
        </v-btn>
        <div v-else class="itemsLimit">{{ content.subtitles.itemsLimit }}</div>
      </template>
      <v-card color="modal">
        <v-toolbar dark color="primary">
          <v-btn icon dark :disabled="loading" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ content.subtitles.createItem }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :disabled="!valid" :loading="loading" @click="createItem">
              <v-icon medium class="save-icon">save</v-icon>
              {{ content.submit }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="item-settings">
          <v-form ref="form" v-model="valid">
            <div class="subtitle">{{ content.subtitles.general }}</div>
            <v-text-field v-model="createItemData.name" counter="50" :rules="rules.name"
                          :label="content.subtitles.name" class="general-item-field"></v-text-field>
            <v-textarea v-model="createItemData.description" filled counter="200" :rules="rules.description"
                        :label="content.subtitles.description" class="general-item-field"></v-textarea>
            <div class="subtitle">{{ content.subtitles.values }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="createItemData.price" :rules="rules.positiveInteger" class="number-input"
                              type="number" :label="content.subtitles.price"></v-text-field>
              </div>
              <div>
                <v-text-field v-model="createItemData.xp" :rules="rules.positiveInteger" class="number-input"
                              type="number" :label="content.subtitles.xp"></v-text-field>
              </div>
            </div>
            <div class="subtitle">{{ content.subtitles.roles }}</div>
            <div class="item-flex">
              <div>
                <v-select v-model="createItemData.addrole" :items="roles" :label="content.subtitles.addRole"
                          class="role-select"></v-select>
              </div>
              <div>
                <v-select v-model="createItemData.removerole" :items="roles" :label="content.subtitles.removeRole"
                          class="role-select"></v-select>
              </div>
            </div>
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

let content = WebContent.GuildEconomy[localStorage.getItem('language')]

export default {
  name: "CreateItem",
  props: ['limit'],
  data: () => ({
    content,
    createItemData: {
      name: '',
      description: '',
      price: 0,
      xp: 0,
      addrole: null,
      removerole: null
    },
    valid: true,
    loading: false,
    dialog: false,
    rules: {
      name: [
        name => (name.length > 0 && name.length <= 50) || content.errors.invItemName,
        name => !name.includes(" ") || content.errors.itemNameSpaces
      ],
      description: [
        description => (description.length <= 200) || content.errors.invItemDescription
      ]
    }
  }),
  computed: {
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.roles(guild.roles, {none: true})
    }
  },
  methods: {
    async createItem() {
      this.loading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        },
        body: JSON.stringify(this.createItemData)
      })
      if (response.ok) {
        this.dialog = false;
        this.$emit('created')
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

.number-input {
  width: 100px;
  display: inline-block;
  margin-right: 20px;
}

.create-item-btn {
  margin-top: 12px;
}

.item-settings {
  padding: 15px;
}

.general-item-field {
  padding-top: 7px !important;
}

.item-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.role-select {
  width: 180px;
}

.itemsLimit {
  font-size: 1.1em;
  color: var(--v-opacityColor-base);;
  margin-top: 5px;
}
</style>