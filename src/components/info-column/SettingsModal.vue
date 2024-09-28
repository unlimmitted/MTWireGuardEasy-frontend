<template>
	<q-card
		style="display: flex;flex-direction: column;height: 100%"
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
			<q-expansion-item
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
						<q-btn color="primary" style="width: 100%">Create new interface</q-btn>
					</q-card-section>
				</q-card>
			</q-expansion-item>
		</q-card-section>
	</q-card>
</template>

<script>
import {useStore} from "../../store.js";
import InterfaceCard from "./InterfaceCard.vue";

export default {
	name: "SettingsModal",
	components: {InterfaceCard},
	data: () => ({
		inputWgInterfaceName: '',
		toVpnAddressList: '',
		inputWgNetwork: '',
		inputWgEndpoint: '',
		localWgEndpointPort: '',
		localNetworkAddress: '',
		ipAddress: '',
		allowedAddress: '',
		endpoint: '',
		endpointPort: '',
		publicKey: '',
		privateKey: '',
		wanInterfaceName: '',
		presharedKey: '',
		vpnChainMode: null
	}),
	created() {
		this.inputWgInterfaceName = this.store.settings.inputWgInterfaceName
		this.toVpnAddressList = this.store.settings.toVpnAddressList
		this.inputWgNetwork = this.store.settings.inputWgAddress
		this.inputWgEndpoint = this.store.settings.inputWgEndpoint
		this.localWgEndpointPort = this.store.settings.inputWgEndpointPort
		this.localNetworkAddress = this.store.settings.localNetwork
		this.ipAddress = this.store.settings.ipAddress
		this.allowedAddress = this.store.settings.allowedAddress
		this.endpoint = this.store.settings.endpoint
		this.endpointPort = this.store.settings.endpointPort
		this.publicKey = this.store.settings.publicKey
		this.privateKey = this.store.settings.privateKey
		this.wanInterfaceName = this.store.settings.wanInterfaceName
		this.presharedKey = this.store.settings.presharedKey
		this.vpnChainMode = this.store.settings.vpnChainMode
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