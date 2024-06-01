<template>
  <div>
    <div style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));grid-gap: 8px">
      <div class="text-body-2">
        <div class="text-caption">
          City
        </div>
        <div class="font-weight-black">{{ t.leavingCity }}, {{ t.takeoffCity }}</div>
      </div>
      <div class="text-body-2">
        <div class="text-caption">
         Address
        </div>
        <div class="font-weight-black">{{ t.landingCity }} {{t.arriveCity}}</div>
      </div>
    </div>
    <div class="mt-4 text-body-2">
      <div>
        <div >
          📆  Check-in on {{ takeoffDate }}
        </div>
      </div>
       <div>
        <div >
          🗓  Check-out on {{ checkoutDate }}
        </div>
      </div>
      <div>
          <v-card style="width: 100%;border-radius: 5px" elevation="0">
            <v-img :src="t.ticketUrl"></v-img>
            
          </v-card>
        </div>
      
      <div class="mt-2">
        <div v-if="t.authed" class="text-h5 font-weight-bold">
          ✅ Ready For Use
        </div>
        <div v-else class="text-h5 font-weight-bold">
          ⚠️ Expired
        </div>
      </div>
      <div class="mt-2">
        <div>
          💎 NFT Address: {{ t.nft_addr }}
        </div>
      </div>
      <div class="mt-2 font-weight-bold">
        <div>
          💰 Deposit Staked: Earned {{ t.earned }} 
           <v-avatar size="20">
          <v-img :src="require('@/assets/toncoin.png')"></v-img>
        </v-avatar>
        </div>
      </div>
     
         
    </div>
  </div>

</template>

<script>
import dayjs from "dayjs"

export default {
  name: "OrderGeneralDisplay",
  computed: {
    takeoffDate() {
      return dayjs(this.t.takeoffDate).format('MMM-DD YYYY')
    },
    checkoutDate() {
      return dayjs(this.t.checkoutDate).format('MMM-DD YYYY')
    }
  },
  props: {
    t: {}
  },
}
</script>

<style scoped>

</style>
