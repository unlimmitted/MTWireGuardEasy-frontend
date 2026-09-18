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
				v-if="this.store.settings.vpnChainMode"
				default-opened
				expand-separator
				icon="swap_horiz"
				label="Double VPN routing"
			>
				<q-card>
					<q-card-section class="inversion-setting">
						<div class="inversion-copy">
							<div class="inversion-title">Invert Double VPN selection</div>
							<div class="inversion-description">
								{{ doubleVpnInverted
									? 'All peers use Double VPN except peers marked for bypass.'
									: 'Only peers with Double VPN enabled use the outgoing tunnel.' }}
							</div>
						</div>
						<q-toggle
							v-model="doubleVpnInverted"
							color="primary"
							:loading="savingDoubleVpnInversion"
							:disable="savingDoubleVpnInversion"
							aria-label="Invert Double VPN selection"
							@update:model-value="saveDoubleVpnInversion"
						/>
					</q-card-section>
				</q-card>
			</q-expansion-item>
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
import axios from "axios";

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
		newInterfaceModal: false,
		doubleVpnInverted: false,
		savingDoubleVpnInversion: false
	}),
	created() {
		this.inputWgInterfaceName = this.store.settings.inputWgInterfaceName
		this.toVpnAddressList = this.store.settings.toVpnAddressList
		this.inputWgNetwork = this.store.settings.inputWgAddress
		this.inputWgEndpoint = this.store.settings.inputWgEndpoint
		this.localWgEndpointPort = this.store.settings.inputWgEndpointPort
		this.localNetworkAddress = this.store.settings.localNetwork
		this.wanInterfaceName = this.store.settings.wanInterfaceName
		this.doubleVpnInverted = Boolean(this.store.settings.doubleVpnInverted)
	},
	methods: {
		async saveDoubleVpnInversion(inverted) {
			this.savingDoubleVpnInversion = true
			try {
				const response = await axios.post('/api/v1/set-double-vpn-inversion', {inverted})
				this.store.settings = response.data
				await this.store.fetchData()
				this.$q.notify({
					message: inverted ? 'Double VPN selection inverted' : 'Standard Double VPN selection restored',
					type: 'positive',
					position: 'top-right'
				})
			} catch (error) {
				this.doubleVpnInverted = !inverted
				this.$q.notify({
					message: error.response?.data?.error || 'Unable to change Double VPN routing',
					type: 'negative',
					position: 'top-right'
				})
			} finally {
				this.savingDoubleVpnInversion = false
			}
		},
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

.inversion-setting {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 14px 16px;
}

.inversion-copy {
	min-width: 0;
}

.inversion-title {
	font-size: 1rem;
	color: #242424;
}

.inversion-description {
	margin-top: 3px;
	color: #6c6c6c;
	font-size: 0.78rem;
	line-height: 1.35;
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
