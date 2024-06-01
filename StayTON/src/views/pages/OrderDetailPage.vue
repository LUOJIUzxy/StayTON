<template>
  <div>
    <div class="px-6 py-4 pb-2 white" style="position: sticky;top: 0;">
      <page-title>
        Details
        <template #backButton>
          <v-btn outlined style="border-radius: 8px" icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #subtitle>
          <div @click="copy(orderInfo.id)">
            #{{ orderInfo.id }}
            <v-icon class="ml-2" small>mdi-content-copy</v-icon>
          </div>

        </template>
      </page-title>
    </div>
    <div class="px-6">
    <div class="mt-8 pb-16">
        <div class="font-weight-bold text-body-1 text-decoration-underline mb-6">
          QR Code to Check In
        </div>
        <div>
          <v-card style=" height: 800px; border-radius: 16px" elevation="0">
            <div id="qr-container"></div>
          </v-card>
        </div>
      </div>
       
     
    
      
      
      <div class="mt-8 pb-16">
        <div class="font-weight-bold text-body-1 text-decoration-underline mb-6">
          Iteanery
        </div>
        <info-line>
          <template #default>
            Check-in Date:
          </template>
          <template #value>
            {{ orderInfo.takeoffDate }}
          </template>
          </info-line>
        <info-line>
          <template #default>
            Check-out Date:
          </template>
          <template #value>
            {{ orderInfo.checkoutDate }}
          </template>
          </info-line>
       
        <info-line>
          <template #default>
            Country:
          </template>
          <template #value>
            {{ orderInfo.leavingCity }}
          </template>
        </info-line>
        <info-line>
          <template #default>
            City:
          </template>
          <template #value>
            {{ orderInfo.takeoffCity }}
          </template>
        </info-line>
        <info-line>
          <template #default>
            Address Line1:
          </template>
          <template #value>
            {{ orderInfo.landingCity }}
          </template>
        </info-line>
        <info-line>
          <template #default>
            Address Line2:
          </template>
          <template #value>
            {{ orderInfo.arriveCity }}
          </template>
        </info-line>
        <info-line-subheader>
          Price per Night
        </info-line-subheader>
        <info-line>
          <template #default>
            📑 Appartment Price:
          </template>
          <template #value>
            {{ orderInfo.filePrice | priceDisplay }}/ per Night
          </template>
        </info-line>
        <info-line>
          <template #default>
            📦 Deposit:
          </template>
          <template #append>
            We will refund the deposit after the trip
          </template>
          <template #value>
            {{ orderInfo.smallPackagePrice | priceDisplay }}/per Night
          </template>
        </info-line>
        <info-line>
          <template #default>
            📖 information
          </template>
          <template #append>
            {{ orderInfo.appendInfo }}
          </template>
        </info-line>
        <info-line-subheader>
          Contact Information
        </info-line-subheader>
        <template v-if="unlocked">
          <info-line>
            <template #default>
              📞 Contact
            </template>
            <template #value>
              ✅ Confirmed
            </template>
            <template #append>
              {{ orderInfo.contactInfo }}
            </template>
          </info-line>
        </template>
        <info-line v-else>
          <template #default>
            🔒 NFT used but remained as a Voucher
          </template>
          
          <template #append> 
            Congrats! You collected 10 points from this order. 
            Details will be shown after payment
          </template>
          <template #value>

            <v-chip @click="confirmDialog=true" class="my-1" small color="yellow lighten-4">
              Redeem now to have 20% off for your next booking
            </v-chip>
          </template>
        </info-line>
        <info-line-subheader>
          Plarform Information
        </info-line-subheader>
        <info-line>
          <template #default>
            📝 Statement
          </template>
          <template #append>
            We will refund the deposit after the trip
          </template>
        </info-line>
      </div>
      <div class="pa-2 pb-8 white elevation-3"
           style="position: fixed;bottom: 0px;left: 0;right: 0;width: 100%">
        <v-btn v-if="unlocked" block large color="green lighten-4 black--text" elevation="0">
          <v-icon left>mdi-shield-lock-outline</v-icon>
          This Info is ...
        </v-btn>
        <v-btn v-else-if="!unlocked" large color="primary lighten-4 black--text" elevation="0"
               block
               @click="confirmDialog=true">
          <v-icon left>mdi-lock</v-icon>
         Click to Redeem your voucher & save up to<span
            class="text-caption text-decoration-line-through">10%</span> 20% 
        </v-btn>
        <v-btn v-else-if="haveInsurance" block large color="green lighten-4 black--text" elevation="0">
          <v-icon left>mdi-shield-lock-outline</v-icon>
          Deposit is insured
        </v-btn>

        <v-btn v-else large color="green lighten-4 black--text" elevation="0"
               block
               @click="confirmDialog=true">
          <v-icon left>mdi-lock-open</v-icon>
          Locked, Click to Pay{{ insuranceFeeAmount | priceDisplay }} to unlock
        </v-btn>
      </div>
    </div>

    <v-bottom-sheet v-model="confirmDialog">
      <v-card class="pa-4 py-6 text-body-2">
        <template v-if="unlocked">
          <div class="text-subtitle-1 my-2 font-weight-bold d-flex align-center">
            secure
            <v-spacer></v-spacer>
          </div>
          <div>Pay{{ insuranceFeeAmount | priceDisplay }} and ...
          </div>
        </template>
        <template v-else>
          <div class="text-subtitle-1 font-weight-bold">Gas Fee:</div>
          <div class="mt-2">Check Personal Info</div>
          <div>☑️ Mint NFT as your Proof</div>
          <div>☑️ Transfer Money</div>
          <div class="text-subtitle-1 my-2 mt-8 font-weight-bold">Attention: </div>
          <div>Please agree with your host</div>
          <div>and be responsible for your own decisions</div>
          <div class="text-subtitle-1 my-2 mt-8 font-weight-bold">️Insurance:
          </div>
          <div>After agreement, you can have your refund{{ insuranceFeeAmount|priceDisplay }}with an extra punishment</div>
        </template>


        <div class="mt-8" ref="paypal-button"></div>
        <v-card @click="toWechat"
                elevation="0" class="mt-4 pa-4" dark color="green darken-4">
          <div>
            other payment methods
          </div>
          <div class="text-caption">
            Click here
          </div>
        </v-card>


      </v-card>
    </v-bottom-sheet>
    <v-dialog v-model="finished" max-width="400px">
      <v-card v-if="finished">
        <lottie-web-vue-esm
            :speed="0.5"
            @complete="finished=false"
            :animation-data="require('@/assets/unlock.json')"
        />
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import PageTitle from "@/views/widgets/PageTitle.vue"
import InfoLine from "@/views/widgets/items/InfoLine.vue"
import InfoLineSubheader from "@/views/widgets/items/InfoLineSubheader.vue"
import {addPayment, getMyPayments} from "@/dataLayer/service/firebase/payment"
import LottieWebVueEsm from "lottie-web-vue"
import {getCurrentUserId} from "@/dataLayer/service/firebase/user"
import {Toast} from "@/plugins/vuetify"


var qrcode = require('qrcode');

export default {
  components: {
    InfoLineSubheader,
    InfoLine,
    PageTitle,
    LottieWebVueEsm,
  },
  props: {
    orderInfo: {}
  },
  computed: {
    isMyOrder() {
      return this.orderInfo.userId === getCurrentUserId()
    },
    unlocked() {
    return this.orderInfo.authed
      //return this.myOrders.some(it => it.pickupOrderId === this.orderInfo.id)
    },
    haveInsurance() {
      return this.unlocked && this.myOrders.find(it => it.pickupOrderId === this.orderInfo.id)?.withInsurance
    },
    finalAmount() {
      return (this.unlocked ? this.insuranceFeeAmount : this.informationFeeAmount)
    }
  },
  data: function () {
    return {
      buttonStyle: {
        size: 'responsive'
      },
      myOrders: [],
      finished: false,
      confirmDialog: false,
      informationFeeAmount: 3.5,
      insuranceFeeAmount: 5,
      useInsurance: false,
      paypal: null,
    }
  },
  watch: {
    finalAmount() {
      if (this.confirmDialog) {
        this.renderButton()
      }
    },
    confirmDialog(val) {
      if (val) {
        this.useInsurance = false
        this.$nextTick(() => {
          this.renderButton()
        })
      }
    }
  },
  methods: {
    generateQRCode() {
      const deployLink = "EQDqlpmctNOXmEq6ohCvD7_LdFmCKTeCXIQe7TI9FnXc_aFd"
      qrcode.toDataURL(deployLink, { small: true }, (err, url) => {
        if (err) {
          console.error(err);
          console.log('error');
          return;
        }
        const img = document.createElement('img');
        console.log(img);
        img.src = url;
        console.log(url);
        document.getElementById('qr-container').appendChild(img);
      });
    },
    async toWechat() {
      await this.copy('bangdaikefu')
      window.open('weixin://dl/chat?bangdaikefu')
    },
    async copy(text) {
      await navigator.clipboard.writeText(text)
      await Toast.fire({
        icon: "success",
        text: text + "Saved to Clipboard"
      })
    },
    async sendOrder() {
      await addPayment(this.orderInfo.id)
      this.finished = true
      this.confirmDialog = false
      await this.refreshData()
    },
    async refreshData() {
      this.myOrders = await getMyPayments()
    },
    paymentOk() {
      this.sendOrder()
    },
    async renderButton() {
      this.$refs["paypal-button"].innerHTML = ""
      await this.paypal.Buttons({
        style: {
          color: 'gold',
          layout: 'horizontal'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.finalAmount.toString()
                }
              }
            ]
          })
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(() => {
            this.paymentOk()
          })

        }
      }).render(this.$refs["paypal-button"])
    }
  },
  async mounted() {
    await this.refreshData()
    await this.generateQRCode()

  },
  name: "CheckOutPage"
}
</script>

<style scoped>

</style>
