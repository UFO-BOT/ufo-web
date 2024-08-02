<template>
  <div style="text-align: -webkit-center">
    <div class="content">
      <div class="name"><b>{{ content.name }}</b></div>
      <div class="description" v-html="content.description"></div>
      <v-expansion-panels accordion focusable>
        <v-expansion-panel v-for="feature of content.features">
          <v-expansion-panel-header v-ripple class="feature-name" color="block">{{ feature.name }}</v-expansion-panel-header>
          <v-expansion-panel-content class="feature-description" color="block">{{ feature.description }}</v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="other-info">
        <div>{{ content.otherInfo1 }}</div>
        <span>{{ content.otherInfo2 }} </span>
        <a class="link" href="https://discord.gg/qPrqVwR" target="_blank">{{ content.supportServer }}</a>
      </div>
    </div>
    <div class="cards-container">
      <v-card v-for="(card, i) in content.cards" :class="`donate-card donate-card-${i}`">
        <div>
          <div class="donate-name">{{ card.name }}</div>
          <v-divider class="donate-card-divider"></v-divider>
          <ul class="donate-bonuses">
            <li v-for="perk of card.perks" :class="`donate-bonus-${i} donate-bonus`">
              <span v-if="!perk.includes('role')">{{ perk }}</span>
              <span v-if="perk.includes('{role}')">{{ perk.split('{role}')[0] }}
                <v-chip v-if="i !== 'premium'" ripple outlined color="#4caf50">Donator</v-chip>
                <v-chip v-if="i === 'premium'" ripple outlined color="#007bff">Premium Donator</v-chip>
                {{ perk.split('{role}')[1] }}
              </span>
            </li>
          </ul>
        </div>
        <div>
          <v-divider class="donate-card-divider"></v-divider>
          <v-btn @click="donate(i)" dark :loading="loading" :color="i === 'premium' ? '#007bff' : '#4caf50'" class="donate-buy">{{ card.price }}₽<span class="per">{{ content.perMonth }}</span></v-btn>
        </div>
      </v-card>
      <v-snackbar v-model="error" :timeout="5000" color="secondary">
          <div class="error-text">{{ errorText }}</div>
          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="error = false">{{ content.close }}</v-btn>
          </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import config from '@/config.json';

let content = WebContent.donate[localStorage.getItem('language')]

export default {
  name: "Donate",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    error: false,
    errorText: '',
    loading: false,
    async donate(subscription) {
      this.loading = true
      let response = await fetch(`${config.API}/private/bill`, {method: 'POST', headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }, body: JSON.stringify({type: subscription})
      })
      let body = await response.json();
      if(response.ok) {
        window.location.replace(body.payUrl);
      }
      else {
        this.errorText = response.status === 401 ? content.unauthorized : body.message;
        this.error = true;
        this.loading = false;
      }
    }
  })
}
</script>

<style scoped>
.content {
  max-width: 1100px;
  padding: 0 20px;
}
.name {
  font-size: 3.5em;
}
.description {
  font-size: 1.4em;
  text-align: left;
  margin-bottom: 10px;
}
.other-info {
  margin-top: 10px;
  font-size: 1.1em;
}
.link {
  color: var(--v-primary-base);
  text-decoration: none;
}
.feature-name {
  font-size: 1.4em;
}
.feature-description {
  text-align: left;
  padding-top: 10px;
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.donate-card {
  background-color: var(--v-block-base)!important;
  padding: 5px 15px 5px 15px;
  border-radius: 10px!important;
  border: solid 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px 20px;
}
.donate-card-standard {
  border-color: #4caf50;
}
.donate-card-premium {
  border-color: #1976d2;
}
.donate-card-divider {
  margin: 5px 5px;
}
.donate-name {
  font-size: 1.8em;
  margin-top: 3px;
}
.donate-bonuses {
  color: var(--v-opacityColor-base);
  text-align: left;
  padding-left: 20px;
  list-style: none;
}
.donate-bonus {
  word-break: break-word;
  font-size: 1.3em;
}
.donate-bonus::before {
  content: "\2022";
  font-weight: bold;
  display: inline-block;
  width: 0.7em;
  margin-left: -1em;
}
.donate-bonus-standard::before {
  color: #28a745;
}
.donate-bonus-premium::before {
  color: #007bff;
}
.donate-buy {
  width: 80%;
  margin: 5px 5px;
  font-size: 1.2em;
  letter-spacing: 0!important;
  text-transform: none!important;
}
.per {
  font-size: 0.7em;
}
.error-text {
  font-size: 1.3em;
}
</style>