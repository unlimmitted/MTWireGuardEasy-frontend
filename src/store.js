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
				field: 'allowedAddress'
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
				sortable: true,
				sort: (a, b, rowA, rowB) => {
					const rxA = rowA.rx.split(' MiB')[0]
					const rxB = rowB.rx.split(' MiB')[0]
					return rxA - rxB
				}
			},
			{
				name: 'tx',
				align: 'center',
				label: 'Tx',
				field: row => (Number(row.tx) / 1024 / 1024).toFixed(1) + ' MiB',
				sortable: true,
				sort: (a, b, rowA, rowB) => {
					const txA = rowA.tx.split(' MiB')[0]
					const txB = rowB.tx.split(' MiB')[0]
					return txA - txB
				}
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
		settings: {},
		trafficData: [],
		etherInterfaces: []
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
					this.tableData = response.data
				})
		},
		fetchTrafficForInterface() {
			return axios.get('/api/v1/get-traffic-by-minutes')
				.then(response => {
					this.trafficData = response.data
				})
		},
		fetchEtherInterfaces() {
			return axios.get('/api/v1/get-ether-interfaces')
				.then(response => {
					this.etherInterfaces = response.data
				})
		}
	}
})