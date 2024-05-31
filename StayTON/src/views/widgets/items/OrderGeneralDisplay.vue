<template>
  <div>
    <div style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));grid-gap: 8px">
      <div class="text-body-2">
        <div class="text-caption">
          Location
        </div>
        <div class="font-weight-black">{{ t.leavingCity }}->{{ t.takeoffCity }}</div>
      </div>
      <div class="text-body-2">
        <div class="text-caption">
          Date
        </div>
        <div class="font-weight-black">{{ t.landingCity }}->{{t.arriveCity}}</div>
      </div>
    </div>
    <div class="mt-4 text-body-2">
      <div>
        <div >
          🛫 : Check-in {{ takeoffDate }}
        </div>
      </div>
      <div>
          <v-card style="width: 100%;border-radius: 5px" elevation="0">
            <v-img :src="t.ticketUrl"></v-img>
            
          </v-card>
        </div>
      
      <div class="mt-2">
        <div v-if="t.authed">
          ✅ Confirmed
        </div>
        <div v-else>
          ⚠️ Waiting for confirmation
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
      return dayjs(this.t.takeoffDate).format('MMMDo')
    }
  },
  props: {
    t: {}
  },
}
</script>

<style scoped>

</style>
