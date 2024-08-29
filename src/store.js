import {defineStore} from 'pinia'
import axios from "axios";

export const useStore = defineStore('store', {
	state: () => ({
		tableColumns: [
			{
				name: 'comment',
				label: 'Name',
				align: 'center',
				sortable: true,
				field: row => row.comment.split('\n')[0]
			},
			{
				name: 'ip',
				align: 'center',
				label: 'IP Address',
				field: 'allowed-address',
				sortable: true
			},
			{
				name: 'last-handshake',
				align: 'center',
				label: 'Last Handshake',
				field: 'last-handshake',
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
				field: 'current-endpoint-address'
			}
		],
		tableData: [],
		token: '',
		serverData: {}
	}),
	actions: {
		fetchRouterInfo() {
			axios.post('http://localhost:5000/api/v1/server-info', {token: this.token})
				.then(response => {
					console.log(response.data)
					this.serverData = response.data
				})
		},
		fetchData() {
			return axios.post('http://localhost:5000/api/v1/peers',
				{token: this.token})
				.then(response => {
					this.tableData = response.data.wg_peers
				})
		}
	}
})