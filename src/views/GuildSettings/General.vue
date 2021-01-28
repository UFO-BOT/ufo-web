<template>
  <div>
    <GuildSettings></GuildSettings>
  </div>
</template>

<script>
import GuildSettings from "@/components/GuildSettings";

import WebContent from '@/content.json'
import Cookies from '@/util/Cookies'

let cookies = Cookies.parse()
let content = WebContent.GuildGeneral[cookies.language]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  components: {
    GuildSettings
  },
  data: () => ({
    content
  })
}
</script>

<style scoped>

</style>