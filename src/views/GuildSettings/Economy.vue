<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5" color="white"
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
      <v-text-field v-model="settings.work.cooldown" type="number" :label="content.subtitles.cooldown"
                    class="number-input"></v-text-field>
      <v-select v-model="settings.work.cooldownUnit" :items="content.units" :label="content.subtitles.unit"
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
      <v-text-field v-model="settings.moneybags.cooldown" type="number" :label="content.subtitles.cooldown"
                    class="number-input"></v-text-field>
      <v-select v-model="settings.moneybags.cooldownUnit" :items="content.units" :label="content.subtitles.unit"
                class="unit-select"></v-select>
      <br>
      <div class="subtitle">{{ content.subtitles.commission }}</div>
      <v-text-field :rules="rules.commission" v-model="settings.commission" type="number"
                    :label="content.subtitles.percent" prefix="%" class="number-input"></v-text-field>
      <div class="subtitle">{{ content.subtitles.minbets }}</div>
      <v-text-field v-for="minbet of content.subtitles.minbetsList" :rules="rules.positiveInteger"
                    v-model="settings.minbets[minbet.prop]" type="number" :label="minbet.name"
                    class="number-input"></v-text-field>
      <br>
      <div class="subtitle" style="margin-bottom: 5px">{{ content.subtitles.shop }}</div>
      <v-progress-circular v-if="loadingItems" :size="40" :width="4" color="white" style="display: block"
                           indeterminate></v-progress-circular>
      <div class="items" v-if="!loadingItems">
        <div v-if="items.length <= 0">¯\_(ツ)_/¯</div>
        <div v-else v-for="item of items">
          <div class="item">
            <div class="item-name text-truncate">{{ item.name }}</div>
            <div>
              <v-dialog v-model="item.editDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>settings</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar dark color="secondary">
                    <v-btn icon dark @click="item.editDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ item.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn dark text :disabled="!item.valid" :loading="editLoading" @click="editItem(item)">
                        <v-icon medium class="save-icon">save</v-icon>
                        {{ content.submit }}
                      </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <div class="item-settings">
                    <v-form ref="form" v-model="item.valid">
                      <div class="subtitle">{{ content.subtitles.general }}</div>
                      <v-text-field v-model="item.newName" counter="50" :rules="rules.item.name"
                                    :label="content.subtitles.name" class="general-item-field"></v-text-field>
                      <v-textarea v-model="item.description" counter="200" :rules="rules.item.description"
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
              <v-dialog v-model="item.deleteDialog" width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon  v-bind="attrs" v-on="on">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>{{ content.subtitles.deleteItem }}</v-card-title>
                  <v-card-text
                      v-html="content.subtitles.deleteConfirm.replace('{{item}}', `<code>${item.name}</code>`)">
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="deleteItem(item)" :loading="deleteLoading" text>
                      {{ content.subtitles.delete }}
                    </v-btn>
                    <v-btn text :disabled="deleteLoading" @click="item.deleteDialog = false">{{ content.subtitles.cancel }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
        <v-dialog v-model="createDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="create-item-btn" color="primary" v-if="items.length < 15" v-bind="attrs" v-on="on" outlined>
              <v-icon medium class="save-icon">add</v-icon>{{ content.subtitles.createItem }}
            </v-btn>
            <div v-else class="itemsLimit">{{ content.subtitles.itemsLimit }}</div>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark :disabled="createLoading" @click="createDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ content.subtitles.createItem }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text :disabled="!createItemValid" :loading="createLoading" @click="createItem">
                  <v-icon medium class="save-icon">save</v-icon>
                  {{ content.submit }}
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <div class="item-settings">
              <v-form ref="form" v-model="createItemValid">
                <div class="subtitle">{{ content.subtitles.general }}</div>
                <v-text-field v-model="createItemData.name" counter="50" :rules="rules.item.name"
                              :label="content.subtitles.name" class="general-item-field"></v-text-field>
                <v-textarea v-model="createItemData.description" counter="200" :rules="rules.item.description"
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
import ParseForSelect from "@/util/parseForSelect";

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
      ],
      item: {
        name: [
          name => (name.length > 0 && name.length <= 50) || content.errors.invItemName,
          name => !name.includes(" ") || content.errors.itemNameSpaces
        ],
        description: [
          description => (description.length <= 200) || content.errors.invItemDescription
        ]
      }
    },
    items: [],
    createItemData: {
      name: '',
      description: '',
      price: 0,
      xp: 0,
      addrole: 'none',
      removerole: 'none'
    },
    createItemValid: true,
    createLoading: false,
    createDialog: false,
    editLoading: false,
    deleteLoading: false,
    submitting: false,
    result: null,
    resultText: '',
    error: false
  }),
  computed: {
    roles() {
      let guild = this.$store.getters.guilds.find(g => g.id === this.$route.params.id)
      if (!guild) return [];
      return ParseForSelect.roles(guild.roles, {none: true})
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
    async createItem() {
      this.createLoading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        },
        body: JSON.stringify(this.createItemData)
      })
      this.createLoading = false;
      if (response.ok) {
        this.createDialog = false;
        this.loadItems()
      }
    },
    async editItem(item) {
      this.editLoading = true;
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
      this.editLoading = false;
      item.editDialog = false;
      if(response.ok) {
        this.loadItems()
      }
    },
    async deleteItem(item) {
      this.deleteLoading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items/${encodeURIComponent(item.name)}`, {
        method: 'DELETE',
        headers: {
          Authorization: cookies.token
        }
      })
      this.deleteLoading = false;
      if (response.ok) {
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
  color: grey;
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