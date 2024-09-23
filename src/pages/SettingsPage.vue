<template>
	<q-layout>
		<q-page-container>
			<q-page style="display: flex; flex-direction: column;justify-content: center;align-items: center">
				<q-card style="min-width: 600px; padding: 16px;max-height: calc(100vh - 32px);overflow: scroll">
					<q-card-section style="font-size: 20px;padding: 8px">
						Router Settings
					</q-card-section>
					<q-card-section>
						<q-input
							v-model="this.localWgNetwork"
							label="Local WireGuard Network"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.localWgEndpoint"
							label="Local WireGuard Endpoint"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.localWgEndpointPort"
							label="Local WireGuard Endpoint port"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.localNetwork"
							label="Local network"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<q-input
							v-model="this.wanInterfaceName"
							label="Local WAN Interface name"
							:rules="[val => (val && val.length > 0) || 'Required field']"
						/>
						<div style="display: flex;flex-direction: row;align-items: center;">
							<q-checkbox v-model="this.vpnChainMode"/>
							Enable Double WireGuard VPN
						</div>
						<q-expansion-item
							v-if="this.vpnChainMode"
							v-model="this.expand"
							icon="link"
							label="VPN Chain Settings"
						>
							<q-card>
								<q-card-section>
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
								</q-card-section>
							</q-card>
						</q-expansion-item>
					</q-card-section>
					<q-card-actions>
						<q-btn
							icon="save"
							color="primary"
							style="width: 100%"
							:loading="this.inProgress"
							@click="this.saveSettings"
						>
							Save
						</q-btn>
					</q-card-actions>
				</q-card>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script>
import axios from "axios";
import {useStore} from "../store.js";

export default {
	name: "Settings",
	data: () => ({
		expand: false,
		inProgress: false,

		vpnChainMode: false,
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
	methods: {
		saveSettings() {
			this.inProgress = true
			const settingsObj = {
				vpnChainMode: this.vpnChainMode,
				inputWgAddress: this.localWgNetwork,
				inputWgEndpoint: this.localWgEndpoint,
				inputWgEndpointPort: this.localWgEndpointPort,
				localNetwork: this.localNetwork,
				ipAddress: this.ipAddress,
				allowedAddress: this.allowedAddress,
				endpoint: this.endpoint,
				endpointPort: this.endpointPort,
				externalWgPublicKey: this.publicKey,
				externalWgPrivateKey: this.privateKey,
				wanInterfaceName: this.wanInterfaceName,
				externalWgPresharedKey: this.presharedKey
			}
			if (this.presharedKey === "") {
				delete settingsObj.externalWgPresharedKey
			}
			axios.post("api/v1/configurator", settingsObj)
				.then((response) => {
					this.inProgress = false
					this.store.settings = response.data
					if (this.store.settings) {
						console.log('sdfsdfsdfsdfsdfsdf')
						this.$router.push('/')
					}
				})
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