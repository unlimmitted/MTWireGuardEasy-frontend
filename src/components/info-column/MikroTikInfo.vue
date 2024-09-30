<template>
	<q-card
		class="shadow-1 infoBox"
		:style="this.isMobile ? '' : 'height: 100%;display: flex;flex-direction: column;overflow-x: hidden;overflow-y: scroll;'"
	>
		<div class="server-info">
			MikroTik info
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
			WireGuard Interfaces
		</div>
		<div style="overflow: scroll;height: 100%">
			<div
				v-for="(int, index) in this.getActualInterfaces"
				style="display: flex;flex-direction: row;flex-wrap: wrap;position: relative"
			>
				<div style="width: 100%">
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
					<div
						v-if="int.name !== this.store.settings.inputWgInterfaceName &&
						this.store.serverData.interfaces.filter(it => !it.disabled && it.name !== this.store.settings.inputWgInterfaceName).length > 1"
						:id="'drag-' + index"
						class="drag-container shadow-1"
						:style="int.isRouting ? 'opacity: 1;' : this.isDragOver === index ? '' : 'opacity: 0.6;'"
						@dragenter.prevent="dragEnter(index)"
						@dragleave.prevent="dragLeave(index)"
						@dragover.prevent="dragOver(index)"
						@drop.prevent="dragDrop(index)"
						:class="{ 'drag-over': isDragOver === index }"
					>
						<div
							v-if="int.isRouting"
							class="drag-item"
							draggable="true"
							@dragstart="dragStart($event, int, index)"
							@dragend="dragEnd"
						>
							Here
							<q-tooltip>
								WireGuard routes to this interface
							</q-tooltip>
						</div>
					</div>
					<div
						v-if="int.name === this.store.settings.inputWgInterfaceName"
						style="min-width: 100%;display: flex;justify-content: start;height: 100%;"
					>
						<traffic-chart/>
					</div>
					<q-separator v-if="!(this.store.serverData.interfaces.length - 1 === index)"
								 style="margin: 8px 0 8px 0"/>
				</div>
			</div>
		</div>
		<div
			style="width: 100%;display: flex;flex-direction: row;flex-wrap: nowrap;position: absolute;bottom: 0;right: 0;padding: 8px;background-color: white;">
			<q-btn
				icon="settings"
				style="width: 100%;margin-right: 8px"
				@click="this.settingsModal = !this.settingsModal"
			>
				Routing
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
		settingsModal: false,
		draggedItem: null,
		sourceIndex: null,
		isDragOver: null,
	}),
	methods: {
		logout() {
			axios.post("/auth/logout")
				.then(() => {
						this.$router.push('/login')
					}
				)
		},
		dragStart(event, item, index) {
			this.draggedItem = item;
			this.sourceIndex = index;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', JSON.stringify(item));
		},
		dragEnd() {
			this.draggedItem = null;
			this.sourceIndex = null;
			this.isDragOver = null;
		},
		dragEnter(index) {
			this.isDragOver = index;
		},
		dragLeave(index) {
			if (this.isDragOver === index) {
				this.isDragOver = null;
			}
		},
		dragOver(index) {
			this.isDragOver = index;
		},
		dragDrop(targetIndex) {
			if (this.draggedItem && this.sourceIndex !== targetIndex) {
				const sourceInterface = this.store.serverData.interfaces[this.sourceIndex];
				const targetInterface = this.store.serverData.interfaces[targetIndex];
				sourceInterface.isRouting = false;
				targetInterface.isRouting = true;
				this.draggedItem = null;
				this.sourceIndex = null;
				this.isDragOver = null;
				axios.post("/api/v1/change-routing-vpn", this.store.serverData.interfaces[targetIndex])
					.then((response) => {
						this.store.serverData = response.data
					})
			}
		}
	},
	computed: {
		isMobile() {
			return this.$q.screen.width < 1180
		},
		getActualInterfaces() {
			return this.store.serverData.interfaces.filter(it => !it.disabled)
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

.drag-container {
	border: 1px solid black;
	background-color: rgb(208, 206, 205);
	position: absolute;
	top: 8px;
	right: 8px;
	border-radius: 4px;
	width: 40px;
	height: 24px;
	display: flex;
	justify-content: center;
}

.drag-item {
	color: white;
	cursor: grab;
	font-size: 12px;
	background-color: var(--q-primary);
	width: 100%;
	height: 100%;
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>