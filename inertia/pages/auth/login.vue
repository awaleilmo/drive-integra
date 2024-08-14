<script setup>
import 'animate.css';
import ApplicationLogo from '~/components/ApplicationLogo.vue'
import DarkModeButton from '~/components/DarkModeButton.vue'
import Loading from '~/components/Loading.vue'
import { Link, useForm } from '@inertiajs/vue3'
import { computed, onBeforeMount, ref } from 'vue'
import imageLogin from '~/assets/lbg-2.png'
import logoDark from '~/assets/logo_dark.png'
import logoLight from '~/assets/logo_light.png'
const theme = localStorage.getItem('theme')
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  maxWidth: {
    type: String,
    default: 'lg',
  },
})

const passwordVisible = ref(false)

const maxWidthClass = computed(() => {
  return {
    'sm': 'sm:max-w-sm',
    'md': 'sm:max-w-md',
    'lg': 'sm:max-w-lg',
    'xl': 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    '6xl': 'sm:max-w-6xl',
    '7xl': 'sm:max-w-7xl',
    'full': 'sm:max-w-full h-screen',
  }[props.maxWidth]
})

const form = useForm({
  email: '',
  password: '',
  remember: false,
})

const submit = () => {
  form.post(route('login'), {
    onFinish: () => form.reset('password'),
    onSuccess: () => sys.removeLocalStorage(),
  })
}
</script>

<template>
  <div class="grid h-screen grid-cols-12">
    <div
      class="relative hidden bg-[#FFE9D1] dark:bg-[#14181c] lg:col-span-7 lg:block xl:col-span-8 2xl:col-span-9"
    >
      <div class="absolute animate__animated animate__flipInY animate__fast inset-0 flex items-center justify-center">
        <img
          alt="Auth Image"
          loading="lazy"
          width="940em"
          decoding="async"
          data-nimg="1"
          class="object-cover"
          style="color: transparent"
          :src="imageLogin"
        />
      </div>
      <div class="animate__animated animate__pulse animate__slow animate__infinite absolute bottom-[15%] right-[15%] hover:right-[60%] hover:transition hover:transform hover:duration-500 hover:ease-in-out">
        <div aria-label="Card" class="card w-96 bg-base-100/80 backdrop-blur-lg card-bordered">
          <div class="card-body p-6">
            <div class="flex flex-col items-center justify-center">
              <img
                alt=""
                loading="lazy"
                width="128"
                height="128"
                decoding="async"
                data-nimg="1"
                class="size-11 bg-base-content/10 inline dark:hidden p-0.5 mask mask-squircle"
                style="color: transparent"
                :src="logoLight"
              />
              <img
                alt=""
                loading="lazy"
                width="128"
                height="128"
                decoding="async"
                data-nimg="1"
                class="size-11 bg-base-content/10 hidden dark:inline p-0.5 mask mask-squircle"
                style="color: transparent"
                :src="logoDark"
              />
              <p class="mt-2 text-sm font-medium">Selamat Datang di IPM Drive</p>
              <p class="text-xs text-base-content/70">system</p>
            </div>
            <p class="text-sm text-base-content/90 text-justify">
              Platform penyimpanan cloud yang
              dirancang khusus untuk kemudahan dan keamanan data Anda. Akses web ini hanya tersedia
              melalui jaringan Wi-Fi kantor, memastikan bahwa file dan informasi sensitif Anda tetap
              aman dan terlindungi. Kelola dan bagikan dokumen penting dengan mudah dan nyaman,
              semuanya di dalam lingkungan kerja yang terkontrol.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5 xl:col-span-4 2xl:col-span-3">
      <div class="flex flex-col items-stretch p-8 lg:p-16">
        <div class="flex items-center justify-between">
          <div class="inline animate__animated animate__fadeInUp hover:animate__infinite">
            <img
              alt="logo-dark"
              loading="lazy"
              width="72"
              height="20"
              decoding="async"
              data-nimg="1"
              class="hidden dark:inline"
              style="color: transparent"
              :src="logoDark"
            /><img
              alt="logo-light"
              loading="lazy"
              width="72"
              height="20"
              decoding="async"
              data-nimg="1"
              class="inline dark:hidden"
              style="color: transparent"
              :src="logoLight"
            />
          </div>

          <DarkModeButton class="animate__animated animate__fadeInUp" />
        </div>
        <h3 class="animate__animated animate__fadeInUp mt-12 text-center text-xl font-semibold lg:mt-24">Login</h3>
        <h3 class="animate__animated animate__fadeInUp mt-2 text-center text-sm text-base-content/70">
          Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
        </h3>
        <div class="mt-10">
          <div>
            <div class="form-control animate__animated animate__fadeInUp">
              <label class="label"><span class="label-text">Email Address</span></label>
              <div
                class="form-control flex flex-row items-center rounded-box border border-base-content/20 px-3"
              >
                <Iconify icon="solar:letter-line-duotone" height="1.5em" />
                <input
                  placeholder="Email Address"
                  class="input w-full focus:border-transparent focus:outline-0 transition-all input-md focus:outline-offset-0"
                  name="email"
                  value="admin@daisyui.com"
                />
              </div>
            </div>
            <div class="form-control mt-3 animate__animated animate__fadeInUp">
              <label class="label"><span class="label-text">Password</span></label>
              <div
                class="form-control flex flex-row items-center rounded-box border border-base-content/20 px-3"
              >
                <Iconify icon="solar:key-square-2-line-duotone" height="1.5em" />
              <input
                  :type="passwordVisible ? 'text' : 'password'"
                  placeholder="Password"
                  class="input w-full focus:border-transparent focus:outline-0 transition-all input-md focus:outline-offset-0"
                  name="password"
                  value="password"
                /><button
                  @click="passwordVisible = !passwordVisible"
                  class="btn hover:bg-base-content/10 btn-xs btn-circle btn-ghost"
                >
                  <Iconify :icon="passwordVisible ? 'solar:eye-closed-line-duotone' : 'solar:eye-line-duotone'" height="1.5em" />
                </button>
              </div>
              <label class="label animate__animated animate__fadeInUp"
                ><span class="label-text"></span
                ><a class="label-text text-xs text-base-content/80" href="/auth/forgot-password"
                  >Forgot Password?</a
                ></label
              >
            </div>
          </div>
          <div class="mt-6 animate__animated animate__fadeInUp">
            <button class="btn text-base gap-2 btn-primary btn-block">
              <Iconify icon="solar:login-2-bold" height="1.5em" />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
