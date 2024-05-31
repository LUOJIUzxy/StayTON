import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import LottieVuePlayer from "@lottiefiles/vue-lottie-player";

import LottieAnimation from 'lottie-web-vue'

Vue.use(LottieAnimation); // add lottie-animation to your global scope
import PayPal from 'vue-paypal-checkout'
import Swal from "sweetalert2"
Vue.component('paypal-checkout', PayPal)
Vue.use(Vuetify);
Vue.use(LottieVuePlayer);


export const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default new Vuetify({});
