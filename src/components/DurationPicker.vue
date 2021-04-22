<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">
          {{ label || content.input }}
        </v-btn>
      </template>
      <v-card color="modal">
        <v-card-title class="modalHeader">{{ content.durationInput }}</v-card-title>
        <v-card-text class="mt-4">
          <v-form v-model="valid">
            <div class="input-header">{{ content.enterDuration }}</div>
            <v-text-field v-for="unit in units" v-model="values[unit]" type="number" class="value-input" :rules="rules.number" :label="content.unitsList[unit]"/>
          </v-form>
          <div>{{ hint }}</div>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :disabled="!valid || (required ? countDuration() <= 0 : false)" @click="updateDuration">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'

let content = WebContent.DurationPicker[localStorage.getItem('language')]

export default {
  name: "DurationPicker",
  props: {
    required: Boolean,
    value: Number,
    limit: Number,
    label: String,
    hint: String
  },
  model: {
    prop: "value",
    event: "value-change"
  },
  data: () => ({
    content,
    units: ['days', 'hours', 'minutes', 'seconds'],
    dialog: false,
    valid: true,
    values: {
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0
    }
  }),
  computed: {
    rules() {
      return {
        number: [
            number => (number >= 0 && !(number % 1)) || content.invalidNumber,
            number => this.countDuration() <= (this.limit || Infinity) || content.tooLongDuration
          ]
      }
    }
  },
  methods: {
    countDuration() {
      return Number(this.values.seconds) * 1000
          + Number(this.values.minutes) * 6e4
          + Number(this.values.hours) * 36e5
          + Number(this.values.days) * 864e5
    },
    updateDuration() {
      this.$emit('value-change', this.countDuration())
      this.dialog = false;
    }
  },
  mounted() {
    const dividers = {
      seconds: 1000,
      minutes: 60000,
      hours: 3600000,
      days: 86400000
    }
    let value = this.value;
    this.units.forEach(unit => {
      if(Math.floor(value / dividers[unit]) > 0) {
        let number = Math.floor(value / dividers[unit]);
        this.values[unit] = number;
        value -= number * dividers[unit];
      }
    })
  }
}
</script>

<style scoped>
.input-header {
  font-size: 1.2em;
}
.value-input {
  max-width: 120px;
  display: inline-block;
  margin-right: 30px;
}
</style>