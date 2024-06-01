<template>
  <div class="pa-6">
    <template v-if="!loading">
      <page-title>
        Search & Filter
        <template #backButton>
          <v-btn outlined style="border-radius: 8px" icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #subtitle>
          Find your NFT to Check In
        </template>
      </page-title>

      <div class="mt-8">
        <div class="text-subtitle-1 font-weight-black my-4 mb-2">
          Date
        </div>
        <div
            class="pb-4"
            style="display: grid;grid-auto-flow: column;
            grid-auto-columns: max-content;grid-gap: 8px;overflow-x: scroll">
          <v-card :color="currentSelectTimeRange===null?'primary':''"
                  @click="currentSelectTimeRange=null"
                  :dark="currentSelectTimeRange===null"
                  elevation="0" class="pa-2 px-4">
            Past NFTs
          </v-card>
          <v-card
              :color="currentSelectTimeRange==='week'?'primary':''"
              @click="currentSelectTimeRange='week'"
              :dark="currentSelectTimeRange==='week'"
              elevation="0" class="pa-2 px-4">
            In 1 week
          </v-card>
          <v-card
              :color="currentSelectTimeRange==='month'?'primary':''"
              @click="currentSelectTimeRange='month'"
              :dark="currentSelectTimeRange==='month'"
              elevation="0" class="pa-2 px-4">
            in 1 month
          </v-card>
        </div>
        <div class="text-subtitle-1 font-weight-black my-4 mb-2">
          Location
        </div>
        <v-text-field
            class="mt-2"
            v-model="searchTextModel"
            hide-details
            dense
            label="City"
            autofocus
            filled
        />

      </div>
      <div class="text-caption mt-2 text--secondary">
        {{ message }}
      </div>

      <div class="d-flex mt-6">
        <v-btn :loading="loading" @click="confirmSearch"
               block
               large
               color="primary"
               elevation="0"
        >
          <v-icon left>mdi-magnify</v-icon>
          Search
        </v-btn>
      </div>
    </template>
    <template v-else>
      <div class="d-flex flex-column align-center justify-center"
           style="height:400px">
        <div class="text-h5">
          Learching 🌋 ...
        </div>
        <v-btn class="mt-6" :loading="loading" @click="confirmSearch" elevation="0" rounded>
          <v-icon left>mdi-magnify</v-icon>
          Search
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import PageTitle from "@/views/widgets/PageTitle.vue"

export default {
  name: "SearchPage",
  components: {PageTitle},
  props: {
    showing: {}
  },
  watch: {
    showing(val) {
      if (val) {
        this.searchTextModel = ''
        this.message = ''
      }
    }
  },
  data() {
    return {
      searchText: '',
      loading: false,
      searchTextModel: '',
      message: '',
      currentSelectTimeRange: null,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirmSearch() {
      if (this.searchTextModel) {
        this.searchText = this.searchTextModel
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.close()
        }, 2000)
      } else {
        this.message = 'please input some text'
      }

    }
  }
}
</script>

<style scoped>

</style>
