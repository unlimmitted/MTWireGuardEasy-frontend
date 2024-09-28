<template>
	<q-card
		style="display: flex;flex-direction: column;"
		:style="this.isMobile ? 'min-width: 100%;' : 'min-width: 560px;'"
	>
		<q-card-section
			style="width: 100%;flex-wrap: nowrap;display: flex;align-items: center"
			class="justify-between text-h5"
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
		<q-card-section style="height: 100%;overflow: scroll">
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
	display: flex;
	flex-flow: wrap;
	gap: 8px;
	justify-content: center;
}
</style>