import {createApp} from 'vue'
import {Notify, Quasar} from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from "./router.js";
import {createPinia} from "pinia";
import CanvasJSChart from '@canvasjs/vue-charts';

const pinia = createPinia()

const myApp = createApp(App).use(router).use(pinia).use(CanvasJSChart)

myApp.use(Quasar, {
	plugins: {
		Notify
	},
})

myApp.mount('#app')