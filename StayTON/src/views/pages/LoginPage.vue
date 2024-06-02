<template>
  <div v-cloak
       class="d-flex  align-center justify-center pa-4
        flex-column" style="height: 100vh;background: #f6f6f6">
    <v-card  class="text-center py-6 px-2"
            width="100%"
            style="border-radius: 16px"
            elevation="0"
            max-width="400px">
      <template v-if="!passwordForget">
        <v-card-title class="justify-center mb-2">
          <logo-display></logo-display>
        </v-card-title>
        <v-card-subtitle>
          <version-display/>
        </v-card-subtitle>
        <v-card-subtitle :class="okToLogin?'':'mt-12'">
          {{ okToLogin ? '' : 'Checking your account settings...' }}
        </v-card-subtitle>
        <v-card-text style="min-height: 196px">
          <div v-if="!okToLogin" style="display: flex;justify-content: center">
            <v-progress-circular class="mt-4" indeterminate/>
          </div>
          <div v-else>
            <v-form ref="form" v-model="isFormValid" lazy-validation>
              <v-btn 
                  block
                  x-large
                  elevation="0"
                  color="primary"
                  @click="submit"
              >{{ 'Signup/Login' }}
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>


              <div class="text-caption font-weight-bold
               my-3 mt-12">{{ 'use third-party to login' }}
              </div>

              <!--           external providers list -->
              <v-btn
                  v-for="provider in providers"
                  :key="provider.id"
                  :loading="provider.isLoading"
                  :disabled="isSignInDisabled"
                  :color="provider.color"
                  class="mb-2"
                  block
                  dark
                  elevation="0"
                  @click="signInProvider(provider.id)"
              >
                <v-icon small left>mdi-{{ provider.id }}</v-icon>
                {{ provider.label }}
              </v-btn>
            </v-form>
            <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div>
            <div class="mt-5">
              <a @click="passwordForget=true">
                {{ 'Forgot Password?' }}
              </a>
            </div>
          </div>

        </v-card-text>

      </template>
      <template v-else>
        <v-card-title>{{ ('Find the password') }}</v-card-title>
        <v-card-text style="min-height: 196px">
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <v-text-field
                v-model="email"
                :rules="[rules.required]"
                :validate-on-blur="false"
                :error="error"
                :label="('enter the email')"
                name="email"
                outlined
                @keyup.enter="submit"
                @change="resetErrors"
            ></v-text-field>
            <v-btn
                :loading="isLoading"
                :disabled="isSignInDisabled"
                block
                elevation="0"
                x-large
                color="primary"
                @click="sendResetPasswordEmail"
            >{{ ('please input the email') }}
            </v-btn>
          </v-form>
        </v-card-text>
      </template>

    </v-card>
  </div>
</template>

<script>
import {
  createUserWithEmail,
  loginUseGuest,
  loginWithEmailAndPassword,
  loginWithGoogle,
  resetPasswordEmail
} from '@/plugins/google-fire-base'
import LogoDisplay from "@/views/widgets/LogoDisplay"
import VersionDisplay from "@/views/widgets/VersionDisplay"

export default {
  name: 'LoginPage',
  components: {VersionDisplay, LogoDisplay},
  data() {
    return {
      passwordForget: false,
      okToLogin: false,
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      showPassword: false,

      providers: [{
        id: 'google',
        label: 'Login with Google',
        isLoading: false,
        color: '#fbbc05'
      },
        {
          id: 'account-clock',
          label: 'Login as Guest',
          isLoading: false,
          color: 'black'
        }],
      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || ('Required')
      }
    }
  },
  watch: {
    loginStateReady(val) {
      console.log(val, 'state')
      if (val) {
        this.showLogin()
      }
    }
  },
  methods: {
    showLogin() {
      this.okToLogin = true

    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        //await this.signIn(this.email, this.password)
        await this.signIn("phoebez_99@outlook.com", "password")
        this.isLoading = false
        this.isSignInDisabled = false
      }
    },
    async sendResetPasswordEmail() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        await resetPasswordEmail(this.email)
        this.isLoading = false
        this.isSignInDisabled = false
        this.passwordForget = false
        this.errorMessages = "Password reset email sent. Please check your email."
        this.password = ''
      }
    },
    async signIn(email, password) {
      try {
        await loginWithEmailAndPassword(email, password)
      } catch (e) {
        if (e.code === 'auth/user-not-found') {
          const res = await createUserWithEmail(email, password)
          console.log(res)
        } else {
          console.log(e.code, 'login')
          this.error = true
          this.errorMessages = ' ' + e.message

        }

      }
    },
    async signInProvider(id) {
      try {
        if (id === 'google') {
          await loginWithGoogle()
        } else {
          await loginUseGuest()
        }

      } catch (e) {
        console.log(e, 'google')
        this.errorProvider = true
        this.errorProviderMessages = e.message
      }
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''
      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  },
  mounted() {
    setTimeout(() => this.showLogin(), 2000)
  }
}
</script>

<style scoped>

</style>
