import {defineStore} from 'pinia'
import axios from "axios";

const numericValue = value => {
	const number = Number(value)
	return Number.isFinite(number) ? number : 0
}

export const formatTraffic = value => {
	const megabits = numericValue(value) / 1024 / 1024
	const units = ['Mb', 'Gb', 'Tb']
	let unitIndex = 0
	let result = megabits

	while (result >= 1024 && unitIndex < units.length - 1) {
		result /= 1024
		unitIndex += 1
	}

	return `${result.toFixed(1)} ${units[unitIndex]}`
}

const compareText = (a, b) => String(a ?? '').localeCompare(
	String(b ?? ''),
	undefined,
	{numeric: true, sensitivity: 'base'}
)

const durationInSeconds = value => {
	const text = String(value ?? '').trim()
	if (!text) return -1

	const unitSeconds = {w: 604800, d: 86400, h: 3600, m: 60, s: 1}
	let total = 0
	let found = false
	for (const match of text.matchAll(/(\d+(?:\.\d+)?)([wdhms])/gi)) {
		total += Number(match[1]) * unitSeconds[match[2].toLowerCase()]
		found = true
	}
	return found ? total : -1
}

const ipSortKey = value => {
	const [address = '', prefix = ''] = String(value ?? '').split('/')
	const ipv4Parts = address.split('.')
	if (ipv4Parts.length === 4 && ipv4Parts.every(part => /^\d+$/.test(part) && Number(part) <= 255)) {
		return [0, ...ipv4Parts.map(Number), numericValue(prefix)]
	}
	return [1, address, numericValue(prefix)]
}

const compareIp = (a, b) => {
	const keyA = ipSortKey(a)
	const keyB = ipSortKey(b)
	for (let index = 0; index < Math.max(keyA.length, keyB.length); index += 1) {
		const partA = keyA[index] ?? ''
		const partB = keyB[index] ?? ''
		const difference = typeof partA === 'number' && typeof partB === 'number'
			? partA - partB
			: compareText(partA, partB)
		if (difference !== 0) return difference
	}
	return 0
}

export const useStore = defineStore('store', {
	state: () => ({
		tableColumns: [
			{
				name: 'name',
				label: 'Name',
				align: 'center',
				sortable: true,
				field: row => row.name,
				sort: compareText
			},
			{
				name: 'ip',
				align: 'center',
				label: 'IP Address',
				field: 'allowedAddress',
				sortable: true,
				sort: compareIp
			},
			{
				name: 'last-handshake',
				align: 'center',
				label: 'Last Handshake',
				field: 'lastHandshake',
				sortable: true,
				sort: (a, b) => durationInSeconds(a) - durationInSeconds(b)
			},
			{
				name: 'rx',
				align: 'center',
				label: 'Rx',
				field: row => formatTraffic(row.rx),
				sortable: true,
				sort: (a, b, rowA, rowB) => numericValue(rowA.rx) - numericValue(rowB.rx)
			},
			{
				name: 'tx',
				align: 'center',
				label: 'Tx',
				field: row => formatTraffic(row.tx),
				sortable: true,
				sort: (a, b, rowA, rowB) => numericValue(rowA.tx) - numericValue(rowB.tx)
			},
			{
				name: 'current-endpoint-address',
				align: 'center',
				label: 'Endpoint Address',
				field: 'currentEndpointAddress',
				sortable: true,
				sort: compareIp
			}
		],
		tableData: [],
		token: '',
		serverData: {
			routerBoard: '',
			version: '',
			interfaces: []
		},
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
