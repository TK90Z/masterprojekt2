<template>
  <p v-if="rights == 1 || rights == 4">Meds</p>
  <NotAvailable v-else />
</template>

<script>
  import NotAvailable from "../../components/NotAvailable"
  export default {
    data() {
      return {
        
      }
    },
    components: {
      NotAvailable,
    },
    computed: {
      rights() {
        return this.$store.getters.getRights
      }
    },
  }
</script>