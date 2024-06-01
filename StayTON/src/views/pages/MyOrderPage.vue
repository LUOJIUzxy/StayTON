<template>
  <div class="pa-4">
    <page-title>
      My Bookings
      <template #backButton>
        <v-btn outlined style="border-radius: 8px" icon @click="goBackPage">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
    </page-title>
    <div class="mt-12">
      <div v-if="!loading">
        <div class="pa-1 rounded"
             style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));
           background: #f0f0f0">
          <v-card
              @click="tab=0"
              :color="tab===0?'success black--text lighten-2':'transparent'"
              :elevation="0"
              class="pa-2 d-flex align-center text-caption justify-center"
          >
            Published by me
          </v-card>
          <v-card
              @click="tab=1"
              :color="tab===1?'success black--text lighten-2':'transparent'"
              :elevation="0"
              class="pa-2 d-flex align-center text-caption justify-center"
          >
            Ordered by me
          </v-card>
        </div>
        <template v-if="tab===0">
          <div class="py-2">
            <div :key="t.id" v-for="t in submittedOrders">
              <v-card @click="openDetail(t)" elevation="0" color="grey lighten-4"
                      class="pa-4 text-body-2 mb-2">
                <order-general-display :t="t"/>
                <div class="mt-4 d-flex align-center">
                  <v-btn v-if="!t.deleteAt" @click.stop="withdrawOrder(t)" elevation="0" color="primary lighten-4 black--text">
                    <v-icon left>mdi-checkbox-marked</v-icon>
                    Click to Confirm
                  </v-btn>
                  <v-btn disabled v-else @click.stop="withdrawOrder(t)" elevation="0" color="primary lighten-4 black--text">
                    <v-icon left>mdi-cancel</v-icon>
                    Order Cancelled
                  </v-btn>
                  <v-spacer></v-spacer>
                </div>
              </v-card>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="py-2">
            <div :key="t.id" v-for="t in purchasedOrders">
              <v-card @click="openDetail(t)" elevation="0" color="grey lighten-4"
                      class="pa-4 text-body-2 mb-2">
                <order-general-display :t="t"/>
                <div class="mt-4 d-flex align-center">
                  <v-btn v-if="!t.withInsurance" @click.stop="withdrawOrder(t)" elevation="0" color="primary lighten-4 black--text">
                    <v-icon left>mdi-shield-lock-outline</v-icon>
                    Buy Insurance
                  </v-btn>
                  <v-chip v-else  elevation="0" color="green lighten-4 black--text">
                    <v-icon left>mdi-shield-lock-outline</v-icon>
                    Already Insured
                  </v-chip>
                  <v-spacer></v-spacer>
                </div>
              </v-card>
            </div>
          </div>
        </template>
      </div>
      <div v-else>
        <div class="d-flex align-center justify-center" style="height: 600px">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {getCurrentUserId} from "@/dataLayer/service/firebase/user"
import PageTitle from "@/views/widgets/PageTitle"
import {getMyOrders, getMyPurchasedOrders, withdrawOrder} from "@/dataLayer/service/firebase/pickupOrder"
import OrderGeneralDisplay from "@/views/widgets/items/OrderGeneralDisplay.vue"

export default {
  components: {OrderGeneralDisplay, PageTitle},
  name: "OrderListPage",
  computed: {},
  data: () => {
    return {
      tab: 0,
      userId: getCurrentUserId(),
      submittedOrders: [],
      purchasedOrders: [],
      loading: false,
    }
  },
  props: {
    show: {}
  },
  watch: {
    show(val) {
      if (val) {
        this.refreshData()
      }
    }
  },
  async mounted() {
    await this.refreshData()
  },
  methods: {
    openDetail(t) {
      this.$emit('open', t)
    },
    async refreshData() {
      this.loading=true
      this.purchasedOrders = await getMyPurchasedOrders()
      console.log(this.purchasedOrders)
      this.submittedOrders = await getMyOrders()
      this.loading=false
    },
    async withdrawOrder(t){
      console.log(t)
      await withdrawOrder(t)
      await this.refreshData()
    },
    goBackPage() {
      this.$emit('close')
    }
  },
}
</script>

<style scoped>

</style>
