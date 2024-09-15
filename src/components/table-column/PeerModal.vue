<template>
	<q-card style="">
		<q-toolbar class="justify-between">
			Peer: {{ this.peerDetails.name }}
			<q-btn
				flat
				round
				icon="close"
				v-close-popup
			/>
		</q-toolbar>
		<q-card-section style="display: flex; flex-direction: column;align-items: center;">
			<qrcode-vue
				class="qrView"
				:value="this.peerConfig"
				:size="250"
				level="H"
			/>
			<div style="margin-top: 8px;display: flex; flex-direction: column;">
				<q-btn
					color="primary"
					icon="download"
					@click="this.downloadConfig"
				>
					Download config
				</q-btn>
				<q-btn
					style="margin-top: 8px"
					icon="content_copy"
					outlined
					@click="this.copyConfig"
				>
					Copy config text
				</q-btn>
				<div
					style="display: flex; flex-direction: row;align-items: center;margin-top: 8px;justify-content: center;">
					Double VPN
					<q-toggle
						v-model="this.doubleVpn"
						color="primary"
						@click="this.changeDoubleVpn"
					/>
				</div>
				<q-btn
					style="width: 100%;margin-top: 4px"
					color="dark"
					icon="delete_forever"
					@click="this.deletePeer"
				>
					Delete WireGuard Peer
				</q-btn>
			</div>
			<div style="display: flex; flex-direction: column;margin-left: 8px;justify-content: center">

			</div>
		</q-card-section>
<!--		<q-card-actions>-->
<!--			<q-btn-->
<!--				style="width: 100%"-->
<!--				color="primary"-->
<!--				@click="this.$emit('closeModal')"-->
<!--			>-->
<!--				Close-->
<!--			</q-btn>-->
<!--		</q-card-actions>-->
	</q-card>
</template>

<script>

import QrcodeVue from "qrcode.vue";
import {useStore} from "../../store.js";

export default {
	components: {QrcodeVue},
	props: ['peerConfig', 'peerDetails'],
	data: () => ({
		doubleVpn: false
	}),
	methods: {
		downloadConfig() {
			const url = window.URL.createObjectURL(new Blob([this.peerConfig]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', this.peerDetails.comment.split('\n')[0] + '.conf')
			document.body.appendChild(link)
			link.click()
			link.parentNode.removeChild(link)
			window.URL.revokeObjectURL(url)
		},
		copyConfig() {
			navigator.clipboard.writeText(this.peerConfig)
			this.$q.notify({
				message: 'Copied to clipboard',
				type: 'positive',
				position: 'top-right',
				actions: [{
					icon: 'close', color: 'white', dense: true, handler: () => undefined
				}]
			})
		},
		deletePeer() {
			this.$emit('deletePeer', this.peerDetails)
		},
		changeDoubleVpn() {
			this.$emit('doubleVpn', this.peerDetails, this.doubleVpn)
		}
	},
	created() {
		this.doubleVpn = this.peerDetails.doubleVpn
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style scoped>

</style>