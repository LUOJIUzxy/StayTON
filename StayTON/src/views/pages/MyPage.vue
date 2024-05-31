<template>
  <div class="pa-6
   d-flex align-center flex-column justify-center
   fill-height">
    <v-avatar size="80">
      <v-img :src="'https://api.multiavatar.com/'+userId+'.svg'"></v-img>
    </v-avatar>
    <div class="text-body-1 font-weight-bold mt-8">
      {{ userName || 'Guest' }}
    </div>
    <div class="text-caption">
      {{ userId }}
    </div>
    <div class="mt-8"
         style="display: grid;grid-gap:8px;grid-template-columns: repeat(2,minmax(0,1fr))">
      <v-card
          width="80"
          class="pa-2" elevation="0" color="#f6f6f6">
        <v-responsive :aspect-ratio="1">
          <div style="width: 100%;height: 100%" class="d-flex flex-column justify-center align-center">
            <v-icon>mdi-face-agent</v-icon>
            <div class="d-flex mt-1">
              <div class="text-caption text-truncate">
                Contact Us
              </div>
            </div>
          </div>
        </v-responsive>
      </v-card>
      <v-card @click="logout" class="pa-2" elevation="0" color="#f6f6f6">
        <v-responsive :aspect-ratio="1">
          <div style="width: 100%;height: 100%" class="d-flex flex-column justify-center align-center">
            <v-icon>mdi-logout</v-icon>
            <div class="d-flex mt-1">
              <div class="text-caption">
                logout
              </div>
            </div>
          </div>
        </v-responsive>
      </v-card>
    </div>
    <div class="mt-12">
      <v-btn outlined icon @click="saveUserInfo">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-dialog transition="dialog-bottom-transition"
              max-width="400" min-height="450" v-model="rechargeDialog">
      <v-card dark class="px-5 py-6 d-flex align-center justify-center flex-column">
        <template v-if="success">
          <div class="text-body-1">
            Payment Success
          </div>
          <div class="text-body-2 mb-4">
            Redem your voucher NFT now!
          </div>
          <v-btn icon @click="finish">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <div style="width: 100%" class="d-flex align-center flex-column justify-center">
            <template v-if="success">
              <v-icon size="64">mdi-check</v-icon>
            </template>
            <template v-else>
              <div ref="solona"></div>
            </template>

          </div>

          <div class="mt-0 d-flex align-center justify-center flex-column" style="width: 350px">
            <div class="text-caption">
              Input amount for SOL
            </div>
            <v-card
                class="pa-4 d-flex align-center justify-center text-h3"
                elevation="0"
            >
              {{ rechargeAmount || '0' }}
            </v-card>
            <div
                class="mt-2"
                style="display: grid;
        grid-template-columns: repeat(4,minmax(0,1fr));
        grid-gap: 12px;width: 300px">
              <v-card
                  style="border-radius: 50%"
                  @click="inputK(key)"
                  elevation="0"
                  color="#424242"
                  :key="index"
                  v-for="(key,index) in keys"
              >
                <v-responsive :aspect-ratio="1">
                  <div style="height: 100%;width: 100%"
                       class="d-flex align-center justify-center text-h5">
                    {{ key }}
                  </div>
                </v-responsive>
              </v-card>
            </div>
          </div>
        </template>

      </v-card>
    </v-dialog>
    <v-dialog v-model="celebrate" max-width="400px">
      <v-card>
        <lottie-web-vue-esm
            loop
            :animation-data="require('@/assets/firework.json')"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {getCurrentUser} from "@/dataLayer/service/firebase/user";
import {FireBaseAuth} from "@/plugins/google-fire-base";


import LottieWebVueEsm from "lottie-web-vue";



const keys = [
  "7", "8", "9", "C",
  "4", "5", "6", "",
  "1", "2", "3", "",
  ".", "0", "X", "OK"
]
export default {
  components: {

    LottieWebVueEsm,
  },
  name: "MyPage",
  computed: {
    userId() {
      return this.user.uid
    },
    userName() {
      return this.user.isAnonymous ? 'Guest' : this.user.displayName
    },

  },
  data: function () {
    return {
      keys,
      myWallet: 3,
      initialed: false,
      rechargeAmount: '',
      rechargeDialog: false,
      user: getCurrentUser(),
      nftList: [],
      success: false,
      store: null,
      celebrate: false
    };
  },
  methods: {
    inputK(key) {
      switch (key) {
        case 'OK':
          this.refreshQrCode()
          break
        case 'C':
          this.rechargeAmount = ''
          break
        case 'X':
          this.rechargeDialog = false
          break
        default:
          this.rechargeAmount += key
      }
    },
    finish() {
      this.celebrate = true
      setTimeout(() => {
        this.celebrate = false
        this.createNFT()
      }, 300)
    },




    logout() {
      FireBaseAuth.signOut()
      this.$router.push('/login')
    },
    saveUserInfo() {
      this.$emit('close')
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
