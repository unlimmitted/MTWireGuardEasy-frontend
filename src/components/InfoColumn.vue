<template>
	<q-card class="shadow-1 createBox">
		<div class="title">
			MikroTik WireGuard Easy
		</div>
		<q-input
			v-model="this.wgPeerName"
			label="WG Peer name"
			dense
			outlined
		/>
		<q-btn
			style="width: 100%;margin: 8px 0 8px 0"
			color="primary"
			icon="design_services"
			@click="createPeer"
		>
			Create WG peer
		</q-btn>
	</q-card>
	<ServerInfo/>
</template>

<script>
import ServerInfo from "./info-column/MikroTikInfo.vue"
import axios from "axios"
import {useStore} from "../store.js"

export default {
	components: {
		ServerInfo
	},
	data: () => ({
		wgPeerName: ''
	}),
	methods: {
		createPeer() {
			if (this.wgPeerName) {
				if (!this.store.tableData.find(peer => peer.name === this.wgPeerName)) {
					axios.post("/api/v1/create-new-peer", this.wgPeerName).then(() => {
						this.wgPeerName = ''
						this.store.fetchData()
						this.$q.notify({
							message: 'Peer successfully created',
							type: 'positive',
							position: 'top-right',
							actions: [{
								icon: 'close', color: 'white', dense: true, handler: () => undefined
							}]
						})
					})
				} else {
					this.$q.notify({
						message: `"${this.wgPeerName}" name already exists`,
						type: 'negative',
						position: 'top-right',
						actions: [{
							icon: 'close', color: 'white', dense: true, handler: () => undefined
						}]
					})
				}
			} else {
				this.$q.notify({
					message: 'WG Peer name field is empty',
					type: 'negative',
					position: 'top-right',
					actions: [{
						icon: 'close', color: 'white', dense: true, handler: () => undefined
					}]
				})
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
.title {
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 19px;
}

.createBox {
	padding: 8px;
	margin-bottom: 8px;
}
</style>