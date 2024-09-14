<template>
	<q-layout>
		<q-page-container>
			<q-page>
				<q-card>
					<q-card-section>
						Router Settings
					</q-card-section>
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
				</q-card>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script>
export default {
	name: "Settings",
	data: () => ({
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
}
</script>


<style scoped>

</style>