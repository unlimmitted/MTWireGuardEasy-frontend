<template>
	<q-card class="shadow-1 createBox">
		<div class="title">
			MT WireGuard Easy
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
import ServerInfo from "./info-column/ServerInfo.vue";
import axios from "axios";
import {useStore} from "../store.js";

export default {
	components: {ServerInfo},
	data: () => ({
		wgPeerName: ''
	}),
	methods: {
		createPeer () {
			if (this.wgPeerName) {
				const body = {comment: this.wgPeerName, token: this.store.token}
				axios.post("http://localhost:5000/api/v1/add-peer", body).then(() => {
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
		return { store }
	}
}
</script>

<style scoped>
.title {
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 1.8rem;
}
.createBox {
	padding: 8px;
	margin-bottom: 8px;
}
</style>