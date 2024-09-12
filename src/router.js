import {createRouter, createWebHistory} from "vue-router";
import ControlPanel from "./pages/ControlPanel.vue";
import {useStore} from "./store.js";


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: ControlPanel,
			beforeEnter: (to, from, next) => {
				const store = useStore()
				if (store.tableData) {
					store.fetchData()
						.then(() => {
							return store.fetchRouterInfo()
						}).then(() => {
						next()
					})
						.catch(() => {
							next()
						});
				} else {
					next()
				}
			}
		}
	]
});

export default router;