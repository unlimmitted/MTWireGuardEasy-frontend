import {defineStore} from 'pinia'
import axios from "axios";

export const useStore = defineStore('store', {
	state: () => ({
		tableColumns: [
			{
				name: 'name',
				label: 'Name',
				align: 'center',
				sortable: true,
				field: row => row.name
			},
			{
				name: 'ip',
				align: 'center',
				label: 'IP Address',
				field: 'allowedAddress',
				sortable: true
			},
			{
				name: 'last-handshake',
				align: 'center',
				label: 'Last Handshake',
				field: 'lastHandshake',
				sortable: true
			},
			{
				name: 'rx',
				align: 'center',
				label: 'Rx',
				field: row => (Number(row.rx) / 1024 / 1024).toFixed(1) + ' MiB',
			},
			{
				name: 'tx',
				align: 'center',
				label: 'Tx',
				field: row => (Number(row.tx) / 1024 / 1024).toFixed(1) + ' MiB'
			},
			{
				name: 'current-endpoint-address',
				align: 'center',
				label: 'Endpoint Address',
				field: 'currentEndpointAddress'
			}
		],
		tableData: [],
		token: '',
		serverData: {},
		settings: {}
	}),
	actions: {
		fetchRouterInfo() {
			return axios.get('/api/v1/get-mikrotik-info')
				.then(response => {
					this.serverData = response.data
				})
		},
		fetchRouterSettings() {
			return axios.get('/api/v1/get-mikrotik-settings')
				.then(response => {
					this.settings = response.data
				})
		},
		fetchData() {
			return axios.get('/api/v1/get-wg-peers')
				.then(response => {
					if (response.status === 200) {
						this.tableData = response.data
					} else if (response.status === 500){
						this.$q.notify({
							message: 'Fuck MikroTik API: Pls reload page',
							type: 'negative',
							position: 'top-right',
							actions: [{
								icon: 'close', color: 'white', dense: true, handler: () => undefined
							}]
						})
					}
				})
		}
	}
})