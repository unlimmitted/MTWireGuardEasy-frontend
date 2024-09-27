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
				store.fetchRouterSettings()
					.then(() => {
						if (store.settings) {
							store.fetchData()
								.then(() => {
									return store.fetchRouterInfo()
								})
								.then(() => {
									return store.fetchTrafficForInterface()
								})
								.then(() => {
									next()
								})
								.catch(() => {
									next()
								})
							connect()
						} else {
							return next('/settings')
						}
					})
			}
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '/settings',
			component: SettingsPage,
			beforeEnter: (to, from, next) => {
				const store = useStore()
				if (store.settings !== false) {
					next('/')
				} else {
					store.fetchEtherInterfaces()
						.then(() => {
							next()
						})
				}
			}
		}
	]
});

export default router;