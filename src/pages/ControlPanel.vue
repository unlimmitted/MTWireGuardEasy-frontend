<template>
	<div
		class="container"
		:class="{ 'container--mobile': isMobile }"
	>
		<div
			class="infoColumn"
		>
			<info-column @open-peer="openPeer"/>
		</div>
		<div
			class="tableColumn"
		>
			<table-column ref="peerTable"/>
		</div>
	</div>
</template>

<script>
import TableColumn from "../components/TableColumn.vue";
import InfoColumn from "../components/InfoColumn.vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {useStore} from "../store.js";

export default {
	components: {InfoColumn, TableColumn},
	data: () => ({

	}),
	methods: {
		openPeer(peerId) {
			this.$refs.peerTable?.openPeerById(peerId)
		}
	},
	computed: {
		isMobile() {
			return this.$q.screen.width < 1180
		}
	},
	setup() {
		const store = useStore()
		return { store }
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: row;
	width: 100%;
	background-image: radial-gradient(circle, black 0.1px, transparent 1px);
	background-size: 20px 20px;
	padding: 16px;
	height: 100vh;
	box-sizing: border-box;
	gap: 16px;
	overflow: hidden;
}
.infoColumn {
	display: flex;
	flex-direction: column;
	flex: 0 0 clamp(340px, 24vw, 460px);
	width: auto;
	min-width: 0;
	min-height: 0;
}
.tableColumn {
	flex: 1 1 auto;
	width: auto;
	min-width: 0;
	min-height: 0;
}

.container--mobile {
	flex-direction: column;
	height: auto;
	min-height: 100vh;
	gap: 8px;
	overflow: visible;
}

.container--mobile .infoColumn,
.container--mobile .tableColumn {
	flex: 0 0 auto;
	width: 100%;
	min-width: 0 !important;
}

@media (max-width: 600px) {
	.container {
		padding: 8px;
	}
}
</style>
