<template>
  <div style="text-align: -webkit-center" class="content">
    <div class="name"><b>{{ content.name }}</b></div>
    <div class="description" v-html="content.description"></div>
    <v-expansion-panels accordion dark focusable>
      <v-expansion-panel v-for="feature of content.features">
        <v-expansion-panel-header v-ripple class="feature-name">{{ feature.name }}</v-expansion-panel-header>
        <v-expansion-panel-content class="feature-description">{{ feature.description }}</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="cards-container">
      <v-card v-for="(card, i) in content.cards" dark :class="`donate-card donate-card-${i}`">
        <div>
          <div class="donate-name">{{ card.name }}</div>
          <v-divider class="donate-card-divider" dark></v-divider>
          <ul class="donate-bonuses">
            <li v-for="perk of card.perks" :class="`donate-bonus-${i} donate-bonus`" v-html="perk"></li>
          </ul>
        </div>
        <div>
          <v-divider class="donate-card-divider" dark></v-divider>
          <v-btn @click="donate(i)" :loading="loading" :color="i === 'premium' ? 'primary' : 'success'" class="donate-buy">{{ card.price }}₽<span class="per">{{ content.perMonth }}</span></v-btn>
        </div>
      </v-card>
      <v-snackbar v-model="error" dark :timeout="5000" color="secondary">
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
import CookieParser from '@/util/Cookies'
import config from '@/config.json';

let cookies = CookieParser.parse()
let content = WebContent.donate[cookies.language]

export default {
  name: "Donate",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    error: false,
    errorText: 'ты лох',
    loading: false,
    async donate(subscription) {
      this.loading = true
      let response = await fetch(`${config.API}/private/bill`, {method: 'POST', headers: {
          'Content-Type': 'application/json',
          'Authorization': cookies.token
        }, body: JSON.stringify({type: subscription})
      })
      let body = await response.json();
      if(response.ok) {
        window.location.replace(body.payUrl);
      }
      else {
        this.errorText = body.message;
        this.error = true;
        this.loading = false;
      }
    }
  })
}
</script>

<style scoped>
.content {
  padding-right: 20px;
  padding-left: 20px;
}
.name {
  color: white;
  font-size: 3.5em;
}
.description {
  font-size: 1.4em;
  color: #9c9c9c;
  text-align: left;
  margin-bottom: 10px;
}
.feature-name {
  font-size: 1.4em;
}
.feature-description {
  text-align: left;
  margin-top: 10px;
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
}
.donate-card {
  padding: 5px 15px 5px 15px;
  border-radius: 10px!important;
  border: solid 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 10px;
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
  color: white;
  font-size: 1.8em;
  margin-top: 3px;
}
.donate-bonuses {
  text-align: left;
  padding-left: 20px;
  list-style: red;
  list-style: none;
  color: #d2d2d2;
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
.donate-error {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  vertical-align: middle;
}
.error-text {
  font-size: 1.3em;
}
</style>