import {createApp} from 'vue'
import {Notify, Quasar} from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'
import './style.css'

import App from './App.vue'
import router from "./router.js";
import {createPinia} from "pinia";
import CanvasJSChart from '@canvasjs/vue-charts';
import axios from 'axios';
import {useStore} from './store.js';
import {disconnect} from './websocket.js';

const pinia = createPinia()

const myApp = createApp(App).use(router).use(pinia).use(CanvasJSChart)

myApp.use(Quasar, {
	plugins: {
		Notify
	},
})

let redirectingToLogin = false
let sessionCheckTimer = null

const isLoginRequest = url => ['/auth/login', '/auth/csrf'].some(path => String(url || '').startsWith(path))

const redirectToLogin = async () => {
	if (router.currentRoute.value.path === '/login' || redirectingToLogin) return

	redirectingToLogin = true
	disconnect()
	useStore(pinia).$reset()
	try {
		await router.replace('/login')
		Notify.create({
			message: 'Your session has expired. Please sign in again.',
			type: 'warning',
			position: 'top-right'
		})
	} finally {
		redirectingToLogin = false
	}
}

axios.interceptors.response.use(
	response => response,
	error => {
		const status = error.response?.status
		if ((status === 401 || status === 403) && !isLoginRequest(error.config?.url)) {
			void redirectToLogin()
		}
		return Promise.reject(error)
	}
)

const checkSession = () => {
	if (router.currentRoute.value.path !== '/login') {
		axios.get('/auth/status').catch(() => undefined)
	}
}

router.afterEach(to => {
	if (sessionCheckTimer) window.clearInterval(sessionCheckTimer)
	if (to.path !== '/login') {
		sessionCheckTimer = window.setInterval(checkSession, 30_000)
	}
})

window.addEventListener('focus', checkSession)
document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') checkSession()
})

axios.get('/auth/csrf')
	.catch(() => undefined)
	.finally(() => myApp.mount('#app'))
