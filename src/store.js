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
		series: [{
			name: 'Tx',
			data: []
		}, {
			name: 'Rx',
			data: []
		}],
		chartOptions: {
			legend: {
				enabled: false,
				// position: 'right',
				// horizontalAlign: 'center',
			},
			colors: ['#1A73E8', '#B32824'],
			fill: {
				colors: ['#1A73E8', '#B32824']
			},
			chart: {
				height: 250,
				type: 'area',
				toolbar: {
					tools: {
						download: false,
						selection: false,
						zoom: false,
						zoomin: false,
						zoomout: false,
						pan: false,
						reset: false
					},
				},
				zoom: {
					enabled: false,
					type: 'x',
					autoScaleYaxis: false,
					zoomedArea: {
						fill: {
							color: '#90CAF9',
							opacity: 0.4
						},
						stroke: {
							color: '#0D47A1',
							opacity: 0.4,
							width: 1
						}
					}
				}
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth'
			},
			xaxis: {
				type: 'datetime',
				categories: [],
				format: 'HH:mm'
			},
			tooltip: {
				x: {
					format: 'HH:mm'
				},
			},
		}
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
					} else if (response.status === 500) {
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
		},
		fetchTrafficForInterface() {
			return axios.get('/api/v1/get-traffic-by-minutes')
				.then(response => {
					response.data.forEach((item) => {
						this.series[0].data.push(item.tx)
						this.series[1].data.push(item.rx)
						this.chartOptions.xaxis.categories.push(new Date(item.time *1000).toISOString())
					})
				})
		}
	}
})