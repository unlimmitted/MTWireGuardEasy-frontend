import {createRouter, createWebHistory} from "vue-router";
import ControlPanel from "./pages/ControlPanel.vue";
import {useStore} from "./store.js";
import LoginPage from "./pages/LoginPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import {connect} from "./websocket.js";


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: ControlPanel,
			beforeEnter: (to, from, next) => {
				const store = useStore()
				if (store.tableData) {
					store.fetchRouterSettings()
						.then(() => {
							if (store.settings) {
								return store.fetchData()
							}
						})
						.then(() => {
							if (store.settings) {
								return store.fetchRouterInfo()
							}
						})
						.then(() => {
							if (store.settings) {
								return store.fetchTrafficForInterface()
							}
						})
						.then(() => {
							next()
						})
						.catch(() => {
							next()
						})
					connect()
				} else {
					next()
				}
			}
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '/settings',
			component: SettingsPage
		}
	]
});

export default router;