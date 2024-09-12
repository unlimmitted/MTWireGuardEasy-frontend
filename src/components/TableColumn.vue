<template>
	<q-table
		flat bordered
		:rows="this.store.tableData"
		:columns="this.store.tableColumns"
		row-key="name"
		virtual-scroll
		color="amber"
		:rows-per-page-options="[0]"
		style="height: calc(100vh - 80px);"
	>
		<template v-slot:header="props">
			<tr>
				<q-th
					v-for="col in props.cols"
					:key="col.name"
					:style="{
					position: 'sticky',
					top: '0',
					'z-index': '1',
					'background-color': 'var(--q-primary)',
					color: 'white'
				}"
					:props="props"
				>
					{{ col.label }}
				</q-th>
			</tr>
		</template>

		<template v-slot:body="props">
			<q-tr
				style="cursor: pointer"
				:props="props"
				@click="this.openPeerDetails(props.row)"
			>
				<q-td v-for="col in props.cols" :key="col.name" :props="props">
					{{ col.value }}
				</q-td>
			</q-tr>
		</template>

		<template v-slot:loading>
			<tr>
				<q-td colspan="100%" style="top: 48px; position: sticky; background-color: var(--q-primary);color: white">
					Loading...
				</q-td>
			</tr>
		</template>
	</q-table>
	<q-dialog v-model="this.showPeerDetails">
		<peer-modal
			:peer-details="this.peerDetails"
			:peer-config="this.peerConfig"
			@closeModal="this.closeModal"
			@deletePeer="this.deletePeer($event)"
			@doubleVpn="this.doubleVpnChange($event)"
		/>
	</q-dialog>
</template>

<script>
import {useStore} from "../store.js";
import QrcodeVue from 'qrcode.vue'
import PeerModal from "./table-column/PeerModal.vue";
import axios from "axios";

export default {
	props: ['rows'],
	components: {PeerModal, QrcodeVue},
	data: () => ({
		showPeerDetails: false,
		peerConfig: '',
		peerDetails: []
	}),
	methods: {
		openPeerDetails(row) {
			this.showPeerDetails = true
			this.peerDetails = row
			this.peerConfig = `
			  [Interface]
			  PrivateKey = ${row.privateKey}
			  Address = ${row.allowedAddress}
			  DNS = 1.1.1.1
			  MTU = 1400
			  [Peer]
			  PublicKey = ${row.publicKey}
			  AllowedIPs = 0.0.0.0/0, ::/0
			  Endpoint = ${this.store.settings.localWgEndpoint}:${this.store.settings.localWgEndpointPort}
			  PersistentKeepalive = 0`
		},
		closeModal() {
			this.showPeerDetails = false
		},
		deletePeer(peer) {
			axios.post('/api/v1/remove-peer', peer).then(() => {
				this.store.fetchData()
				this.closeModal()
				this.$q.notify({
					message: 'Peer successfully removed',
					type: 'positive',
					position: 'top-right',
					actions: [{
						icon: 'close', color: 'white', dense: true, handler: () => undefined
					}]
				})
			})
		},
		doubleVpnChange(body){
			axios.post('/api/v1/change-routing-vpn', body)
				.then(() => {
					this.store.fetchData()
					const peer = this.store.tableData.find((peer) => peer.id === body.id)
					this.$q.notify({
						message: peer.doubleVpn ? 'Double VPN OFF' : 'Double VPN ON',
						type: 'positive',
						position: 'top-right',
						actions: [{
							icon: 'close', color: 'white', dense: true, handler: () => undefined
						}]
					})
				})
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style lang="scss" scoped>
.my-sticky-header-table {
	height: calc(100vh - 80px);

	.q-table__top,
	.q-table__bottom,
	thead tr:first-child th {
		background-color: var(--q-primary);
	}

	thead tr th {
		position: sticky;
		z-index: 1;
	}

	thead tr:first-child th {
		top: 0;
	}

	&.q-table--loading thead tr:last-child th {
		top: 48px;
	}

	tbody {
		scroll-margin-top: 48px;
	}
}
</style>