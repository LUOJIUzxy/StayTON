<template>
  <div>
    <v-app-bar app elevation="0" hide-on-scroll :dark="offsetTop > 0">
      <div>
        <logo-display/>
      </div>
      <v-spacer/>
      <v-card
          @click="showUserPanel = true"
          class="pa-1 d-flex align-center rounded-pill"
          elevation="0">
        <v-avatar size="30" class="mr-2">
          <v-img :src="'https://api.multiavatar.com/'+userId+'.svg'"></v-img>
        </v-avatar>
        <span class="text-body-2">
             {{ userName }}
        </span>

        <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </v-card>
      <template #extension>
        <div class="d-flex align-center" style="width: 100vw">
          <v-btn light
                 @click="startSearch"
                 elevation="0"
                 class="mr-2"
                 small
                 color="primary black--text lighten-4"
          >
            <v-icon left small>mdi-tune</v-icon>
            Search
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              class="mr-2"
              elevation="0"
              @click="gotoSalePage"
              color="warning black--text lighten-4"
              small>
            <v-icon left small>mdi-clipboard-list</v-icon>
            My Orders
          </v-btn>
          
          <div>
            <div id="connect-wallet"></div>
            <v-btn
              elevation="0"
              @click="connectToWallet"
              color="primary black--text lighten-4"
              small
            >
              <v-icon left small>mdi-plus-circle</v-icon>
              Connect Wallet
            </v-btn>
          </div>
          <v-btn
              elevation="0"
              @click="toNewOffer"
              color="success black--text lighten-4"
              small>
            <v-icon left small>mdi-plus-circle</v-icon>
            Publish Offer
          </v-btn>
        </div>
      </template>
    </v-app-bar>
    <v-main v-scroll="onScroll" class="overflow-y-auto" style="background: #f0f0f0;min-height: calc(100vh)">
      <div class="px-6 pb-12 pt-6">
        <div>
          <v-card style="width: 100%;border-radius: 16px" elevation="0">
            <v-img :aspect-ratio="16/9" :src="require('@/assets/banner.jpg')"></v-img>
          </v-card>
        </div>
        <div
            class="mt-4"
            style="display: grid;grid-template-columns: repeat(auto-fit,minmax(240px,1fr));grid-gap: 16px">
          <order-card
              @click="openOrderDetail(t)"
              v-for="t in orderList"
              :key="t.order_id"
              :t="t"
          />
        </div>
        <v-fab-transition>
          <div v-if="offsetTop>16" style="position: fixed; bottom: 36px;right: 36px;">
            <v-btn
                class="mx-2"
                fab
                elevation="1"
                color="primary lighten-4 black--text"
                @click="toTop()"
            >
              <v-icon dark>
                mdi-arrow-up
              </v-icon>
            </v-btn>
          </div>
        </v-fab-transition>

      </div>
    </v-main>
    <v-navigation-drawer width="340" app right v-model="showMyOrders">
      <order-list-page :show="showMyOrders"
                       @close="showMyOrders=false"/>
    </v-navigation-drawer>
    <v-bottom-sheet v-model="showSearchDialog">
      <v-card color="#f6f6f6">
        <search-page v-if="showSearchDialog" @close="showSearchDialog=false"
                     :showing="showSearchDialog"/>
      </v-card>
    </v-bottom-sheet>
    <v-dialog fullscreen v-model="showUserPanel">
      <v-card style="width: 100vw;height: 100vh">
        <my-page @close="showUserPanel=false"></my-page>
      </v-card>
    </v-dialog>
    <v-dialog fullscreen v-model="showDetailDialog">
      <v-card v-if="showDetailDialog">
        <check-out-page @close="showDetailDialog=false" :order-info="orderItem"/>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="showAdDialog">
      <v-card tile class="pa-4">
        <page-title>
           Special Offers
          <template #backButton>
            <v-btn outlined style="border-radius: 8px" icon @click="showAdDialog=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <template #subtitle>
            Description
          </template>
        </page-title>
        <v-card elevation="0" class="mt-2">
          <v-img src="https://picsum.photos/400/600"></v-img>
        </v-card>
        <v-card @click="toWechat"
                elevation="0" class="mt-4 pa-2 text-center" dark color="green lighten-4 black--text">
          <div>
            Contact Us
          </div>
          <div class="text-caption">
            Click to copy Telegram ID
          </div>
        </v-card>


      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import LogoDisplay from "@/views/widgets/LogoDisplay"
import MyPage from "@/views/pages/MyPage"
import {getCurrentUser, getCurrentUserId} from "@/dataLayer/service/firebase/user"
import OrderCard from "@/views/widgets/items/OrderCard"
import OrderListPage from "@/views/pages/MyOrderPage.vue"
import {collection, onSnapshot, query} from 'firebase/firestore'
import {GlobalDB} from "@/plugins/google-fire-base"
import {pickupOrderPath} from "@/dataLayer/service/firebase/pickupOrder"
import CheckOutPage from "@/views/pages/OrderDetailPage.vue"
import SearchPage from "@/views/pages/SearchPage.vue"
import PageTitle from "@/views/widgets/PageTitle.vue"
import {TonConnectUI} from '@tonconnect/ui'



export default {
  name: "HomePage",
  components: {PageTitle, SearchPage, CheckOutPage, MyPage, OrderCard, LogoDisplay, OrderListPage},
  async mounted() {
    onSnapshot(query(collection(GlobalDB, pickupOrderPath)), (snapshot) => {
      this.orderList = snapshot.docs.map(it => it.data())
      console.log(this.orderList)
    });
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.onload = () => {
      const tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://stay-ton-gm.vercel.app/tonconnect-manifest.json',
        buttonRootId: 'connect-wallet'
      });
      this.tonConnectUI = tonConnectUI;
    };
    document.body.appendChild(script);
  },
  computed: {
    userName() {
      return this.user.isAnonymous ? 'Guest' : this.user.displayName
    },
  },
  data: function () {
    return {
      showSearchDialog: false,
      showDetailDialog: false,
      showUserPanel: false,
      showMyOrders: false,

      offsetTop: 0,
      user: getCurrentUser(),
      userId: getCurrentUserId(),
      orderList: [],
      orderItem: null,

      showAdDialog: false
    }
  },

  methods: {
   async connectToWallet() {
      try {
          this.tonConnectUI.uiOptions = {
            language: 'en',
        };
        //const walletsList = await this.tonConnectUI.getWallets();
       // const connectedWallet = await this.tonConnectUI.openSingleWalletModal('telegram-wallet');
        const connectedWallet = await this.tonConnectUI.connectWallet();
        // Do something with connectedWallet if needed
        console.log(connectedWallet);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    },
    sendTransaction() {
        const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
                amount: "1",
            // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
            },
            {
                address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
                amount: "1",
                payload: "Double Room from June 13th to June 15th" // just for instance. Replace with your transaction payload or remove
            }
        ]
    };

      this.tonConnectUI.sendTransaction({
       transaction
        }).then((result) => {
        console.log('Transaction succeeded:', result);
      }).catch((error) => {

        console.error('Transaction failed:', error);
      });
    },
    handleClick() {
      this.connectToWallet();
    },
    
    openOrderDetail(orderItem) {
      this.orderItem = orderItem
      this.showDetailDialog = true
    },

    gotoSalePage() {
      this.showMyOrders = true
    },

    onScroll(e) {
      this.offsetTop = e.target.scrollingElement.scrollTop
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    toNewOffer() {
      this.$router.push('offerSubmit')
    },
    startSearch() {
      this.showSearchDialog = true
    },
    async toWechat() {
      await this.copy('bangdaikefu')
      window.open('weixin://dl/chat?bangdaikefu')
    }
  }
}
</script>

<style scoped>

</style>