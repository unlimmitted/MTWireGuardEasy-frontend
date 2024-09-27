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
						<q-checkbox v-model="this.vpnChainMode" label="Enable Double WireGuard VPN"/>
						<q-expansion-item
							v-if="this.vpnChainMode"
							v-model="this.expand"
							icon="link"
							label="VPN Chain Settings"
						>
							<q-card>
								<q-card-section>
									<q-file
										clearable
										outlined
										v-model="configFile"
										label="Select .conf file for parsing"
										accept=".conf"
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
		presharedKey: '',

		configFile: null
	}),
	methods: {
		parsingConfig() {
			const reader = new FileReader()
			let fileText
			reader.onload = (file) => {
				fileText = file.target.result.toString()
				let strings = []
				fileText.split("\n").forEach((line) => {
					let editedString = ""
					if (line.trim().length > 0) {
						for (let i = 0; i < line.length; i++) {
							editedString += line[i].trim()
						}
					}
					strings.push(editedString)
				})
				strings.forEach((string) => {
					if (string.includes("PrivateKey=")) {
						this.privateKey = this.sliceString(string)
					} else if (string.includes("Address=")) {
						const value = this.sliceString(string)
						if (value.includes(",")) {
							this.ipAddress = this.sliceString(string).split(",")[0]
						} else {
							this.ipAddress = this.sliceString(string)
						}
					} else if (string.includes("PublicKey=")) {
						this.publicKey = this.sliceString(string)
					} else if (string.includes("AllowedIPs=")) {
						const value = this.sliceString(string)
						if (value.includes(",")) {
							this.allowedAddress = value.split(",")[0]
						} else {
							this.allowedAddress = value
						}
					} else if (string.includes("Endpoint=")) {
						const value = this.sliceString(string).split(":")
						this.endpoint = value[0]
						this.endpointPort = value[1]
					} else if (string.includes("PresharedKey=")) {
						this.presharedKey = this.sliceString(string)
					}
				})
			}
			reader.readAsText(this.configFile)
		},

		sliceString(string) {
			const index = string.indexOf("=");
			let value = ""
			if (index !== -1) {
				value = string.substring(index + 1)
			}
			return value
		},
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
						this.$router.push('/')
					}
				})
		}
	},
	watch: {
		configFile: {
			deep: true,
			handler(newValue, oldValue) {
				if (oldValue !== null) {
					this.privateKey = ''
					this.ipAddress = ''
					this.publicKey = ''
					this.allowedAddress = ''
					this.endpoint = ''
					this.endpointPort = ''
				}
				if (this.configFile) {
					this.parsingConfig()
				}
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

</style>