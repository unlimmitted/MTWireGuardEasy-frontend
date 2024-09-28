<template>
	<q-card
		style="min-width: 400px;"
	>
		<q-card-section style="display: flex;justify-content: space-between;align-items: center;font-size: 18px;">
			Add new interface
			<q-btn
				icon="close"
				dense
				flat
				round
				v-close-popup
			/>
		</q-card-section>
		<q-card-section>
			<q-file
				clearable
				outlined
				v-model="configFile"
				label="Select .conf file for parsing"
				accept=".conf"
			/>
			<q-input
				v-model="this.name"
				label="Name of external WireGuard"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.ipAddress"
				label="IP address of external WireGuard"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.allowedAddress"
				label="Allowed Address"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.endpoint"
				label="External WireGuard Endpoint"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.endpointPort"
				label="External WireGuard Endpoint port"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.publicKey"
				label="External WireGuard Public Key"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
			<q-input
				v-model="this.presharedKey"
				label="External WireGuard Preshared Key"
			/>
			<q-input
				v-model="this.privateKey"
				label="External WireGuard Private Key"
				:rules="[val => (val && val.length > 0) || 'Required field']"
			/>
		</q-card-section>
		<q-card-actions style="justify-content: end;">
			<q-btn
				outline
				v-close-popup
			>
				Close
			</q-btn>
			<q-btn
				color="primary"
				style="width: 30%"
				:disable="this.validForSave"
				@click="this.saveInterface()"
			>
				Save
			</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import axios from "axios";
import {useStore} from "../../store.js";

export default {
	name: "NewInterfaceModal",
	data: () => ({
		name: '',
		ipAddress: '',
		allowedAddress: '',
		endpoint: '',
		endpointPort: '',
		publicKey: '',
		privateKey: '',
		presharedKey: '',

		configFile: null
	}),
	computed: {
		validForSave() {
			const isNameExist = this.store.serverData.interfaces.find(it => it.name === this.name)
			return !(!isNameExist && this.name.length > 0 && this.ipAddress.length > 0 && this.allowedAddress.length > 0
				&& this.publicKey.length > 0 && this.endpoint.length  > 0 && this.endpointPort.length > 0
				&& this.privateKey.length > 0)
		}
	},
	methods: {
		parsingConfig() {
			try {
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
			} catch (ignoreError) {
				this.$q.notify({
					message: 'Configuration import failed',
					type: 'negative',
					position: 'top-right',
					actions: [{
						icon: 'close', color: 'white', dense: true, handler: () => undefined
					}]
				})
			}
		},

		saveInterface() {
			const wgInterface = {
				name: this.name,
				ipAddress: this.ipAddress,
				allowedAddress: this.allowedAddress,
				endpoint: this.endpoint,
				endpointPort: this.endpointPort,
				publicKey: this.publicKey,
				presharedKey: this.presharedKey.length > 0 ? this.presharedKey : null,
				privateKey: this.privateKey
			}
			axios.post('/api/v1/create-new-interface', wgInterface)
				.then((response) => {
					this.store.serverData = response.data
					this.closeModal()
				})
		},

		closeModal() {
			this.$emit("closeModal")
		},

		sliceString(string) {
			const index = string.indexOf("=");
			let value = ""
			if (index !== -1) {
				value = string.substring(index + 1)
			}
			return value
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