<template>
  <div class="pa-4">
    <page-title>
      My Offers
      <template #backButton>
        <v-btn outlined style="border-radius: 8px" icon @click="goBackPage">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
    </page-title>
    <div class="mt-12">
      <div class="py-1"
           style="display: grid;grid-template-columns: repeat(3,minmax(0,1fr));background: #f0f0f0;border-radius: 24px">
        <v-card
            @click="tab=0"
            style="border-radius: 24px"
            :color="tab===0?'success black--text lighten-2':'transparent'"
            :elevation="tab===0?1:0"
            class="pa-2 d-flex align-center text-caption justify-center"
        >
          Active
        </v-card>
        <v-card
            @click="tab=1"
            style="border-radius: 24px"
            :color="tab===1?'success black--text lighten-2':'transparent'"
            :elevation="tab===1?1:0"
            class="pa-2 d-flex text-caption align-center justify-center"
        >
          Complete
        </v-card>
        <v-card
            @click="tab=2"
            style="border-radius: 24px"
            :color="tab===2?'success black--text lighten-2':'transparent'"
            :elevation="tab===2?1:0"
            class="pa-2 d-flex align-center text-caption justify-center"
        >
          Logs
        </v-card>
      </div>
      <template v-if="tab===0">
        <div class="py-2">
          <v-list three-line>
            <order-list-item
                :item="t" v-for="t in activeOrder"
                :key="t.item_id"
            >
              <v-list-item-action>
                <v-btn @click="startEditNumber(t.item_id,t.price)" icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </order-list-item>
          </v-list>
        </div>
      </template>
      <template v-else-if="tab===1">
        <div class="py-2">
          <v-list three-line>
            <order-list-item :item="t" v-for="t in transactions" :key="t.transaction_id">
              <template>
                <v-list-item-action-text>
                  <div>
                    <div>
                      from
                      <v-avatar size="16">
                        <v-img :src="'https://api.multiavatar.com/'+t.user_sell_id+'.svg'"></v-img>
                      </v-avatar>
                    </div>
                    <div>
                      <div>
                        to
                        <v-avatar size="16">
                          <v-img :src="'https://api.multiavatar.com/'+t.user_buy_id+'.svg'"></v-img>
                        </v-avatar>
                      </div>
                    </div>
                  </div>

                </v-list-item-action-text>
              </template>
            </order-list-item>
          </v-list>
        </div>
      </template>
      <template v-else>
        <div class="py-2">
          <v-list three-line>
            <order-list-item :item="t" v-for="t in logs" :key="t.order_id">
              <template>
                <template>
                  <v-list-item-action-text>
                    <span class="success--text text--darken-2">{{ t.type }}</span>
                  </v-list-item-action-text>
                </template>
              </template>
            </order-list-item>
          </v-list>
        </div>
      </template>
    </div>
    <v-dialog
        max-width="400px"
        v-model="showChangeNumberDialog"
    >
      <v-card elevation="0" class="pa-4">
        <div v-if="loading" style="height: 400px;" class="d-flex align-center justify-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <template v-else>
          <v-card
              dark
              class="pa-4 d-flex align-center justify-center text-h5"
              elevation="0"
              height="72"
              color="black darken-2"
          >
            {{ input || 'Please input New Quantity' }}
          </v-card>
          <div
              class="mt-2"
              style="display: grid;
        grid-template-columns: repeat(4,minmax(0,1fr));
        grid-gap: 4px;">
            <v-card
                @click="inputK(key)"
                elevation="0"
                color="#f6f6f6"
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
        </template>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {getCurrentUserId} from "@/dataLayer/service/firebase/user";
import PageTitle from "@/views/widgets/PageTitle";
import OrderListItem from "@/views/widgets/items/OrderListItem";
import {addOrder, getUserActiveOrderList, getUserOrderList, reduceOrder} from "@/dataLayer/service/firebase/order";
import {keyBy} from "lodash-es";
import {getItems} from "@/dataLayer/service/firebase/item";
import {getTransByUser} from "@/dataLayer/service/firebase/transaction";

const keys = [
  "7", "8", "9", "C",
  "4", "5", "6", "",
  "1", "2", "3", "",
  "", "0", "", "OK"
]
export default {
  components: {OrderListItem, PageTitle},
  name: "OrderListPage",
  computed: {},
  data: () => {
    return {
      tab: 0,
      userId: getCurrentUserId(),
      logs: [],
      activeOrder: [],
      transactions: [],
      itemDict: {},
      keys,
      input: '',
      showChangeNumberDialog: false,
      selectedItemId: null,
      selectedPrice: null,
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
    async confirmEdit() {
      this.loading = true
      const newNumber = parseInt(this.input)
      const target = this.activeOrder.find(it => it.item_id === this.selectedItemId)
      const change = newNumber - target.quantity
      if (change > 0) {
        addOrder(target.item_id, target.price, change, target.side)
      } else {
        if (change + target.quantity >= 0) {
          reduceOrder(target.item_id, target.price, change, target.side)
        }
      }
      this.input = ''
      await this.refreshData()
      this.loading = false

      this.showChangeNumberDialog = false
    },
    startEditNumber(itemId, price) {
      this.selectedPrice = price
      this.selectedItemId = itemId
      this.showChangeNumberDialog = true
    },
    inputK(key) {
      switch (key) {
        case 'OK':
          this.confirmEdit()
          break
        case 'C':
          this.input = ''
          break
        default:
          this.input += key
      }
    },
    async refreshData() {
      this.itemDict = keyBy(await getItems(), 'item_id')
      this.logs = (await getUserOrderList()).map(it => {
        return {
          ...(this.itemDict[it.item_id]),
          ...it
        }
      })
      this.transactions = (await getTransByUser()).map(it => {
        return {
          ...(this.itemDict[it.item_id]),
          ...it
        }
      })
      this.activeOrder = (await getUserActiveOrderList()).map(it => {
        return {
          ...(this.itemDict[it.item_id]),
          ...it
        }
      })
      console.log(this.transactions)
    },
    goBackPage() {
      this.$emit('close')
    }
  },
}
</script>

<style scoped>

</style>