<template>
	<q-card
		class="shadow-1 infoBox"
		:style="this.isMobile ? '' : 'height: 100%;display: flex;flex-direction: column;overflow-x: hidden;overflow-y: scroll;'"
	>
		<div class="server-info">
			Server info
		</div>
		<div style="margin-bottom: 8px">
			<table>
				<tr>
					<th>Router Board:</th>
					<th class="col-value">{{ this.store.serverData.routerBoard }}</th>
				</tr>
				<tr>
					<th>OS version:</th>
					<th class="col-value">{{ this.store.serverData.version }}</th>
				</tr>
			</table>
		</div>
		<div class="server-info">
			WG Interfaces
		</div>
		<div style="overflow: scroll;height: 100%">
			<div
				style="display: flex;flex-direction: row;flex-wrap: wrap;"
				v-for="(int, index) in this.store.serverData.interfaces"
			>
				<table>
					<tr>
						<th>Interface name:</th>
						<th class="col-value">{{ int.name }}</th>
					</tr>
					<tr>
						<th>Port:</th>
						<th class="col-value"> {{ int.listenPort }}</th>
					</tr>
					<tr>
						<th style="color: rgba(255, 59, 48, 1) !important;">Rx:</th>
						<th style="color: rgba(255, 59, 48, 1) !important;">
							{{ (Number(int.rxByte) / 1024 / 1024 / 1024).toFixed(1) }} Gb
						</th>
					</tr>
					<tr>
						<th style="color: rgba(50, 173, 230, 1) !important;">Tx:</th>
						<th style="color: rgba(50, 173, 230, 1) !important;">
							{{ (Number(int.txByte) / 1024 / 1024 / 1024).toFixed(1) }} Gb
						</th>
					</tr>
				</table>
				<div style="min-width: 100%;display: flex;justify-content: start;height: 100%;">
					<traffic-chart
						v-if="int.name === this.store.settings.inputWgInterfaceName"
					/>
				</div>
				<q-separator v-if="!(this.store.serverData.interfaces.length - 1 === index)"
							 style="margin: 8px 0 8px 0"/>
			</div>
		</div>
		<div
			style="width: 100%;display: flex;flex-direction: row;flex-wrap: nowrap;position: absolute;bottom: 0;right: 0;padding: 8px;background-color: white;">
			<q-btn
				icon="settings"
				style="width: 100%;margin-right: 8px"
				@click="this.settingsModal = !this.settingsModal"
			>
				Settings
			</q-btn>
			<q-btn icon="logout" color="primary" @click="this.logout"/>
		</div>
	</q-card>
	<q-dialog v-model="settingsModal">
		<settings-modal/>
	</q-dialog>
</template>

<script>

import {useStore} from "../../store.js";
import SettingsModal from "./SettingsModal.vue";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";
import TrafficChart from "./TrafficChart.vue";

export default {
	components: {
		TrafficChart,
		SettingsModal,
		apexchart: VueApexCharts
	},
	data: () => ({
		settingsModal: false
	}),
	methods: {
		logout() {
			axios.post("/auth/logout")
				.then(() => {
						this.$router.push('/login')
					}
				)
		}
	},
	computed: {
		isMobile() {
			return this.$q.screen.width < 1180
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}

</script>

<style scoped>
.infoBox {
	padding: 8px;
}

.server-info {
	font-size: 1.25rem;
}

th {
	white-space: nowrap;
	color: rgba(108, 108, 108, 1);
	font-weight: 520;
	text-align: start;
}

.col-value {
	color: rgba(36, 36, 36, 1);
}
</style>