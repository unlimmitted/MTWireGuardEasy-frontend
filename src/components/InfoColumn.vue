<template>
	<q-card class="shadow-1 createBox">
		<div class="title">
			MT WireGuard Easy
		</div>
		<q-input
			v-model="this.wgPeerName"
			label="WG Peer name"
			dense
			outlined
		/>
		<q-btn
			style="width: 100%;margin: 8px 0 8px 0"
			color="primary"
			icon="design_services"
			@click="createPeer"
		>
			Create WG peer
		</q-btn>
	</q-card>
	<ServerInfo/>
	<q-card
		class="shadow-1"
		style="margin-top: 8px;"
		:class="this.isMobile ? '': 'chart'"
	>
		<apexchart
			style="max-width: 380px !important;"
			type="area"
			:options="chartOptions"
			:series="series"
		/>
	</q-card>
</template>

<script>
import ServerInfo from "./info-column/ServerInfo.vue";
import axios from "axios";
import {useStore} from "../store.js";
import VueApexCharts from "vue3-apexcharts"

export default {
	components: {
		ServerInfo,
		apexchart: VueApexCharts
	},
	data: () => ({
		wgPeerName: '',
		series: [{
			name: 'Tx',
			data: [31, 40, 28, 51, 42, 109, 100]
		}, {
			name: 'Rx',
			data: [11, 32, 45, 32, 34, 52, 41]
		}],
		chartOptions: {
			legend: {
				position: 'right',
				horizontalAlign: 'center',
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
				categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
			},
			tooltip: {
				x: {
					format: 'dd/MM/yy HH:mm'
				},
			},
		}
	}),
	computed: {
		isMobile() {
			return this.$q.screen.width < 1023
		}
	},
	methods: {
		createPeer() {
			if (this.wgPeerName) {
				if (!this.store.tableData.find(peer => peer.name === this.wgPeerName)) {
					axios.post("/api/v1/create-new-peer", this.wgPeerName).then(() => {
						this.wgPeerName = ''
						this.store.fetchData()
						this.$q.notify({
							message: 'Peer successfully created',
							type: 'positive',
							position: 'top-right',
							actions: [{
								icon: 'close', color: 'white', dense: true, handler: () => undefined
							}]
						})
					})
				} else {
					this.$q.notify({
						message: `"${this.wgPeerName}" name already exists`,
						type: 'negative',
						position: 'top-right',
						actions: [{
							icon: 'close', color: 'white', dense: true, handler: () => undefined
						}]
					})
				}
			} else {
				this.$q.notify({
					message: 'WG Peer name field is empty',
					type: 'negative',
					position: 'top-right',
					actions: [{
						icon: 'close', color: 'white', dense: true, handler: () => undefined
					}]
				})
			}
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style scoped>
.title {
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 1.8rem;
}

.createBox {
	padding: 8px;
	margin-bottom: 8px;
}

.chart {
	display: flex;
	justify-content: center;
}
</style>