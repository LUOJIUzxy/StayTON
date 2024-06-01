<template>
  <v-container style="background: #f6f6f6;width: 100%" class="fill-height align-start">
    <div class="pa-6" style="width: 100%">
      <page-title>
        Upload Your Appartment
        <template #backButton>
          <v-btn outlined style="border-radius: 8px" icon @click="$router.back()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <template #subtitle>
          Fill in the form to upload your appartment
        </template>
      </page-title>
      <v-form v-model="formValid" ref="form">
        <div class="mt-16" style="width: 100%">
          <div>
            <div class="text-subtitle-1 font-weight-black text-decoration-underline">Offer a Place</div>
            <fly-to-china-selector v-model="flyToChina"></fly-to-china-selector>
            <div class="mt-8">
              <v-dialog style="width: min-content;" max-width="286px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-bind="attrs"
                                required
                                v-on="on" label="Date*"
                                filled v-model="takeoffDate"
                                :rules="nameRules"
                                readonly>

                  </v-text-field>

                </template>
                <v-card>
                  <div>
                    <v-date-picker :min="today" v-model="takeoffDate"></v-date-picker>
                  </div>
                </v-card>
              </v-dialog>

            </div>
            <div style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));grid-gap: 16px">
              <div>
                <v-text-field
                    :rules="nameRules"
                    label="Country*"
                    filled
                    v-model="leavingCity"
                />
              </div>
              <div>
                <v-text-field v-model="takeoffCity"
                              :rules="nameRules"
                              label="City*"
                              filled></v-text-field>
              </div>
            </div>
            <div style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));grid-gap: 16px">

              <div>
                <v-text-field
                    v-model="landingCity"
                    :rules="nameRules"
                    label="Address*"
                    filled></v-text-field>
              </div>
              <div>
                <v-text-field
                    :rules="nameRules"
                    label="Date*"
                    filled
                    v-model="arriveCity"
                />
              </div>
            </div>


            <div>
              <v-card
                  width="100%" elevation="0"
                  color="white lighten-2"
                  style="position: relative"
                  class="mb-4">
                <div style="position: absolute;z-index: 1;width: 100%">
                  <v-file-input
                      style="opacity: 0;"
                      height="96"
                      full-width
                      filled
                      :rules="nameRules"
                      rounded
                      v-model="file"
                      prepend-icon=""
                      prepend-inner-icon="mdi-image"
                      accept="image/*"
                  />
                </div>
                <div v-if="uploadUrl">
                  <v-img width="100%"
                         height="96"
                         style="border-radius: 12px"
                         :src="uploadUrl"/>
                  <div class="text-body-2 mt-1 pa-1">✅ Flat Picture Uploaded</div>
                </div>

                <v-card
                    elevation="0"
                    color="transparent"
                    v-else
                    class="pa-4 d-flex align-center"
                >
                  <div class="mr-4">
                    <v-icon large>mdi-image</v-icon>
                  </div>
                  <div>
                    <div class="text-body-2">Click to upload appartment picture</div>
                    <div class="text-caption">
                      Please upload your appartment picture, we will verify your appartment and protect your privacy.
                    </div>
                  </div>

                </v-card>
              </v-card>


            </div>
            <div>
              <v-card
                  width="100%" elevation="0"
                  color="white lighten-2"
                  style="position: relative"
                  class="mb-4">
                <div style="position: absolute;z-index: 1;width: 100%">
                  <v-file-input
                      style="opacity: 0;"
                      height="96"
                      full-width
                      filled
                      :rules="nameRules"
                      rounded
                      v-model="idFile"
                      prepend-icon=""
                      prepend-inner-icon="mdi-image"
                      accept="image/*"
                  />
                </div>
                <div v-if="fileUrl">
                  <v-img width="100%"
                         height="96"
                         style="border-radius: 12px"
                         :src="fileUrl"/>
                  <div class="text-body-2 mt-1 pa-1">✅ Identity Uploaded</div>
                </div>

                <v-card
                    elevation="0"
                    color="transparent"
                    v-else
                    class="pa-4 d-flex align-center"
                >
                  <div class="mr-4">
                    <v-icon large>mdi-image</v-icon>
                  </div>
                  <div>
                    <div class="text-body-2">Click here to upload your identity</div>
                    <div class="text-caption">
                      Please upload your identity card, we will verify your identity and protect your privacy.
                    </div>
                  </div>

                </v-card>
              </v-card>
            </div>
            <div class="pa-2 text-body-2">
              Privacy Protection: According to the EU GDPR data protection, we will adhere to protect your information privacy.<br>
        
            </div>


          </div>
          <div class="mt-8">
            <div class="text-subtitle-1 font-weight-black text-decoration-underline">Price Info</div>
            <div class="mt-2">
              <v-text-field :rules="nameRules" label="Price per Night*" filled
                            type="number" step="0.01" min="0"
                            v-model="smallPackagePrice"
                            messages="Total Amount"
                            append-icon="mdi-currency-eur"/>
            </div>
            <div class="mt-2">
              <v-text-field :rules="nameRules"
                            step="0.01"
                            v-model="filePrice"
                            min="0"
                            label="Price per Night*"
                            filled
                            type="number"
                            append-icon="mdi-currency-eur"/>
            </div>
            <div class="mb-2 mt-n2 text-capt  ion">
              Total Price: {{ (smallPackagePrice + filePrice).toFixed(2) }}€
            </div>
          </div>
          <div class="mt-8">
            <div class="text-subtitle-1 font-weight-black text-decoration-underline">Descriptions</div>
            <div class="text-caption">Extra Information you want your guests to know</div>
            <div class="mt-2">
              <v-textarea label="Extra Info" v-model="appendInfo" filled></v-textarea>
            </div>
          </div>
          <div class="mt-8">
            <div class="text-subtitle-1 font-weight-black text-decoration-underline">Contacts Info*</div>
            <div class="text-caption">Below contactInfo will be shown to users, please protect your privacy.</div>
            <div class="mt-2">
              <v-textarea label="Contacts Info*" v-model="contactInfo" filled :rules="nameRules"/>
            </div>
          </div>

          <div class="d-flex">
            <v-simple-checkbox color="primary" v-model="confirmOk" class="mr-2"></v-simple-checkbox>
            <div class="text-caption mt-4">I hereby confirm that above Infomation is true and valid.</div>
          </div>

          <v-btn @click="submit"
                 :loading="loading"
                 :disabled="!canSubmit" color="primary" elevation="0" class="mt-4"
                 large block>
            Upload
            <v-icon right>mdi-check</v-icon>
          </v-btn>

        </div>
      </v-form>
      <v-dialog persistent v-model="showAddCompleteDialog" max-width="300px">
        <v-card class="pa-4 d-flex flex-column align-center">
          <div class="text-body-1">
            Upload Complete!
          </div>
          <div class="text-body-2 mt-4 text-center">
            The information you submit will be displayed on the platform after review and an email will be sent to your registered email address when the review is approved. Thanks Very Much!🙇
          </div>
          <div class="mt-4">
            <v-btn @click="confirmed" elevation="0">
              Okay
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import PageTitle from "@/views/widgets/PageTitle"
import dayjs from "dayjs"
import {uploadImage} from "@/dataLayer/service/firebase/uploadImage"
import {addPickupOrder} from "@/dataLayer/service/firebase/pickupOrder"
import FlyToChinaSelector from "@/views/widgets/FlyToChinaSelector.vue"

const today = dayjs().format('YYYY-MM-DD')
export default {
  props: {id: {}},
  name: "OrderSubmitPage",
  components: {FlyToChinaSelector, PageTitle},
  watch: {
    flyToChina() {
      this.takeoffCity = null
      this.landingCity = null
    }
  },
  computed: {
    uploadUrl: function () {
      return this.file ? URL.createObjectURL(this.file) : null
    },
    fileUrl: function () {
      return this.idFile ? URL.createObjectURL(this.idFile) : null
    },
    startCity: function () {
      return this.flyToChina ? this.germanyCities : this.chineseCities
    },
    targetCity: function () {
      return this.flyToChina ? this.chineseCities : this.germanyCities
    },
    canSubmit: function () {
      return this.confirmOk && this.formValid
    }
  },
  data: function () {
    return {
      loading: false,
      showAddCompleteDialog: false,
      formValid: false,
      today,
      nameRules: [
        v => !!v || '请填写此信息',
      ],
      germanyCities: [
        "Dusseldorf",
        "Frankfurt",
        "Berlin",
        "Hanburg",
        "Munich",
        "Stuttgart",
        "Dresden",
        "Nurnberg",
        "Hannover",
      ],
      chineseCities: [
        "Shanghai",
        "Beijing",
        "Qingdao",
        "Tianjin",
        "Guangzhou",
        "Chengdu",
      ],

      file: null,
      flyToChina: true,
      takeoffDate: today,
      takeoffCity: null,
      leavingCity: "",
      arriveCity: "",
      landingCity: null,
      smallPackagePrice: null,
      filePrice: null,
      appendInfo: null,
      contactInfo: null,
      confirmOk: false,
      idFile: null,
      canTakeMedicine: false,
      canTakeLuxury: false


    }
  },
  methods: {
    async submit() {
      this.loading = true
      const imageUrl = await uploadImage(this.file)
      const idCardUrl = await uploadImage(this.idFile)
      await addPickupOrder(
          this.flyToChina,
          this.takeoffDate,
          this.takeoffCity,
          this.landingCity,
          this.smallPackagePrice,
          this.filePrice,
          this.appendInfo,
          this.contactInfo,
          imageUrl,
          idCardUrl,
          this.arriveCity,
          this.leavingCity,
          this.canTakeMedicine,
          this.canTakeLuxury)
      this.loading = false
      this.showAddCompleteDialog = true

    },
    async confirmed() {
      this.showAddCompleteDialog = true
      await this.$router.push('/loading')
    }
  },
  mounted() {

  }

}
</script>


<style scoped>

</style>
