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
					store.fetchData().then(() => {
						next()
					})
					store.fetchRouterInfo()
				} else {
					next()
				}
			}
		}
	]
});

export default router;