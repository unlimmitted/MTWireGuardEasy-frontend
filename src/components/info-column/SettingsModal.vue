<template>
	<q-card
		class="routing-modal"
	>
		<q-card-section
			class="routing-header justify-between text-h5"
		>
			Routing
			<q-btn
				flat
				icon="close"
				round
				dense
				v-close-popup
			/>
		</q-card-section>
		<q-card-section class="routing-content">
			<q-expansion-item
				default-opened
				expand-separator
				icon="output"
				label="Outgoing Wireguard interfaces"
			>
				<q-card>
					<q-card-section class="card-grid">
						<interface-card
							v-for="wgInterface in this.store.serverData.interfaces"
							:key="wgInterface.name"
							:interface="wgInterface"
						/>
						<q-btn
							@click="this.newInterfaceModal = true"
							color="primary" style="width: 100%"
						>
							Create new interface
						</q-btn>
					</q-card-section>
				</q-card>
			</q-expansion-item>
			<q-expansion-item
				expand-separator
				icon="input"
				label="Input Wireguard configuration"
			>
				<q-card>
					<q-card-section>
						<q-input
							v-model="this.inputWgInterfaceName"
							readonly
							label="Input WireGuard Interface name"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.toVpnAddressList"
							readonly
							label="Address List for routing peers"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.inputWgNetwork"
							readonly
							label="Input WireGuard Address"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.inputWgEndpoint"
							readonly
							label="Input WireGuard Endpoint"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.localWgEndpointPort"
							readonly
							label="Local WireGuard Endpoint port"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.localNetworkAddress"
							readonly
							label="Local Network Address"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.wanInterfaceName"
							readonly
							label="Local WAN Interface name"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
					</q-card-section>
				</q-card>
			</q-expansion-item>
		</q-card-section>
	</q-card>
	<q-dialog v-model="this.newInterfaceModal">
		<new-interface-modal
			@closeModal="this.closeModal"
		/>
	</q-dialog>
</template>

<script>
import {useStore} from "../../store.js";
import InterfaceCard from "./InterfaceCard.vue";
import NewInterfaceModal from "./NewInterfaceModal.vue";

export default {
	name: "SettingsModal",
	components: {NewInterfaceModal, InterfaceCard},
	data: () => ({
		inputWgInterfaceName: '',
		toVpnAddressList: '',
		inputWgNetwork: '',
		inputWgEndpoint: '',
		localWgEndpointPort: '',
		localNetworkAddress: '',
		wanInterfaceName: '',
		newInterfaceModal: false
	}),
	created() {
		this.inputWgInterfaceName = this.store.settings.inputWgInterfaceName
		this.toVpnAddressList = this.store.settings.toVpnAddressList
		this.inputWgNetwork = this.store.settings.inputWgAddress
		this.inputWgEndpoint = this.store.settings.inputWgEndpoint
		this.localWgEndpointPort = this.store.settings.inputWgEndpointPort
		this.localNetworkAddress = this.store.settings.localNetwork
		this.wanInterfaceName = this.store.settings.wanInterfaceName
	},
	methods: {
		closeModal() {
			this.newInterfaceModal = false
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
.card-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	padding: 12px;
}

.routing-modal {
	display: flex;
	flex-direction: column;
	width: min(920px, calc(100vw - 32px));
	max-width: 100%;
	max-height: calc(100vh - 32px);
}

.routing-header {
	width: 100%;
	flex-wrap: nowrap;
	display: flex;
	align-items: center;
	padding: 16px;
}

.routing-content {
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 8px 16px 16px;
}

@media (max-width: 640px) {
	.routing-modal {
		width: calc(100vw - 16px);
		max-height: calc(100vh - 16px);
	}

	.routing-header {
		padding: 12px;
	}

	.routing-content {
		padding: 4px 8px 12px;
	}

	.card-grid {
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
		padding: 8px;
	}
}
</style>
