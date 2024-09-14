<template>
	<q-card
		:style="this.isMobile ? 'min-width: 100%;' : 'min-width: 500px;'"
	>
		<q-card-section
			style="width: 100%;flex-wrap: nowrap;display: flex;align-items: center"
			class="justify-between text-h5"
		>
			Настройки роутера
			<q-btn
				flat
				icon="close"
				round
				dense
				v-close-popup
			/>
		</q-card-section>
		<q-card-section>
			<q-input
				id="task-name"
				v-model="this.localWgInterfaceName"
				readonly
				label="Local WireGuard Interface name"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.toVpnAddressList"
				readonly
				label="Address List for routing peers"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.localWgNetwork"
				readonly
				label="Local WireGuard Network"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.localWgEndpoint"
				label="Local WireGuard Endpoint"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.localWgEndpointPort"
				label="Local WireGuard Endpoint port"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.localNetwork"
				label="Local network"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.ipAddress"
				label="IP address of external WireGuard"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.allowedAddress"
				label="Allowed Address"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.endpoint"
				label="External WireGuard Endpoint"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.endpointPort"
				label="External WireGuard Endpoint port"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.publicKey"
				label="External WireGuard Public Key"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.presharedKey"
				label="External WireGuard Preshared Key"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.privateKey"
				label="External WireGuard Private Key"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				id="task-name"
				v-model="this.wanInterfaceName"
				label="Local WAN Interface name"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
		</q-card-section>
		<q-card-actions>

		</q-card-actions>
	</q-card>
</template>

<script>
import {useStore} from "../../store.js";

export default {
	name: "SettingsModal",
	data: () => ({
		localWgInterfaceName: '',
		toVpnAddressList: '',
		localWgNetwork: '',
		localWgEndpoint: '',
		localWgEndpointPort: '',
		localNetwork: '',
		ipAddress: '',
		allowedAddress: '',
		endpoint: '',
		endpointPort: '',
		publicKey: '',
		privateKey: '',
		wanInterfaceName: '',
		presharedKey: ''
	}),
	created() {
		this.localWgInterfaceName = this.store.settings.localWgInterfaceName
		this.toVpnAddressList = this.store.settings.toVpnAddressList
		this.localWgNetwork = this.store.settings.localWgNetwork
		this.localWgEndpoint = this.store.settings.localWgEndpoint
		this.localWgEndpointPort = this.store.settings.localWgEndpointPort
		this.localNetwork = this.store.settings.localNetwork
		this.ipAddress = this.store.settings.ipAddress
		this.allowedAddress = this.store.settings.allowedAddress
		this.endpoint = this.store.settings.endpoint
		this.endpointPort = this.store.settings.endpointPort
		this.publicKey = this.store.settings.publicKey
		this.privateKey = this.store.settings.privateKey
		this.wanInterfaceName = this.store.settings.wanInterfaceName
		this.presharedKey = this.store.settings.presharedKey
	},
	computed: {
		isMobile() {
			return this.$q.screen.width < 1023
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style scoped>

</style>