<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="secondary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ item.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :disabled="!item.valid" :loading="loading" @click="editItem(item)">
              <v-icon medium class="save-icon">save</v-icon>
              {{ content.submit }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="item-settings">
          <v-form ref="form" v-model="item.valid">
            <div class="subtitle">{{ content.subtitles.general }}</div>
            <v-text-field v-model="item.newName" counter="50" :rules="rules.name"
                          :label="content.subtitles.name" class="general-item-field"></v-text-field>
            <v-textarea v-model="item.description" counter="200" :rules="rules.description"
                        :label="content.subtitles.description" class="general-item-field"></v-textarea>
            <div class="subtitle">{{ content.subtitles.values }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.price" :rules="rules.positiveInteger"
                              class="number-input" type="number"
                              :label="content.subtitles.price"></v-text-field>
              </div>
              <div>
                <v-text-field v-model="item.xp" :rules="rules.positiveInteger" class="number-input"
                              type="number" :label="content.subtitles.xp"></v-text-field>
              </div>
            </div>
            <div class="subtitle">{{ content.subtitles.roles }}</div>
            <div class="item-flex">
              <div>
                <v-select v-model="item.addrole" :items="roles" :label="content.subtitles.addRole"
                          class="role-select"></v-select>
              </div>
              <div>
                <v-select v-model="item.removerole" :items="roles"
                          :label="content.subtitles.removeRole" class="role-select"></v-select>
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
import Cookies from '@/util/cookies'
import config from "@/config.json";
import ParseForSelect from "@/util/parseForSelect";

let cookies = Cookies.parse()
let content = WebContent.GuildEconomy[cookies.language]

export default {
  name: "EditItem",
  props: ['item'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    valid: true,
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
    async editItem(item) {
      this.loading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items/${encodeURIComponent(item.name)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        },
        body: JSON.stringify({
          name: item.newName,
          description: item.description,
          price: item.price,
          xp: item.xp,
          addrole: item.addrole,
          removerole: item.removerole
        })
      })
      this.loading = false;
      if(response.ok) {
        this.dialog = false;
        this.$emit('edited')
      }
    }
  },
  mounted() {
    this.item.newName = this.item.name
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

.save-icon {
  margin-right: 5px;
}
</style>