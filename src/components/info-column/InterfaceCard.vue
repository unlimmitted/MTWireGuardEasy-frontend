<template>
	<q-card>
		<div class="interface-card">
			<div class="card-section">
				<span class="field-label">Name:</span>
				<span class="field-value">{{ interface.name }}</span>
			</div>
			<div class="card-section">
				<span class="field-label">Port:</span>
				<span class="field-value">{{ interface.listenPort }}</span>
			</div>
			<div class="card-section">
				<span class="field-label">Disabled:</span>
				<span class="field-value">{{ interface.disabled }}</span>
			</div>
			<div class="edit-btn">
				<q-btn
					color="primary"
					:disabled="this.interface.name === this.store.settings.inputWgInterfaceName || interface.isRouting"
					dense
					flat
					round
					icon="delete"
					@click="this.confirmModal = true"
				>
					<q-tooltip>
						{{ this.deleteTooltipText }}
					</q-tooltip>
				</q-btn>
				<q-btn
					v-if="!this.interface.disabled"
					style="color: gray"
					:disabled="this.interface.name === this.store.settings.inputWgInterfaceName || interface.isRouting"
					dense
					flat
					icon="disabled_by_default"
					@click="this.setInterfaceStatus"
				>
					<q-tooltip>
						{{ this.disableInterfaceText }}
					</q-tooltip>
				</q-btn>
				<q-btn
					v-else
					icon="check_box"
					style="color: gray"
					dense
					flat
					@click="this.setInterfaceStatus"
				>
					<q-tooltip>
						Enable interface
					</q-tooltip>
				</q-btn>
			</div>
		</div>
	</q-card>
	<q-dialog v-model="this.confirmModal">
		<q-card>
			<q-card-section>
				Confirm interface deletion: {{ this.interface.name }}
			</q-card-section>
			<q-card-actions style="justify-content: end">
				<q-btn
					outline
					v-close-popup
				>
					Close
				</q-btn>
				<q-btn
					style="width: 30%"
					color="primary"
					@click="this.deleteInterface"
				>
					Confirm
				</q-btn>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>
<script>
import {useStore} from "../../store.js";
import axios from "axios";

export default {
	name: "InterfaceCard",
	props: ["interface"],
	data: () => ({
		confirmModal: false
	}),
	methods: {
		deleteInterface() {
			axios.post("/api/v1/delete-external-interface", this.interface)
				.then((response) => {
					this.store.serverData = response.data
				})
		},
		setInterfaceStatus() {
			axios.post("/api/v1/set-interface-status", this.interface)
				.then((response) => {
					this.store.serverData = response.data
				})
		}
	},
	computed: {
		deleteTooltipText() {
			const isInputWgInterface = this.interface.name === this.store.settings.inputWgInterfaceName
			return isInputWgInterface ? 'This input interface.' : this.interface.isRouting ?
				'This interface is used for routing.' : 'Delete interface.'
		},
		disableInterfaceText() {
			const isInputWgInterface = this.interface.name === this.store.settings.inputWgInterfaceName
			return isInputWgInterface ? 'This input interface.' : this.interface.isRouting ?
				'This interface is used for routing.' : 'Disable interface'
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>
<style scoped>
.interface-card {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-width: 0;
	min-height: 112px;
	padding: 12px 52px 12px 12px;
	gap: 4px;
}

.card-section {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 8px;
	min-width: 0;
}

.field-label {
	white-space: nowrap;
}

.field-value {
	min-width: 0;
	overflow-wrap: anywhere;
	word-break: break-word;
}

.edit-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	flex-direction: column;
}
</style>
