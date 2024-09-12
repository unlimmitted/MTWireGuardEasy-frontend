<template>
	<q-card class="shadow-1 infoBox" style="overflow: hidden">
		<div class="server-info">
			Server info
		</div>
		<div style="margin-bottom: 8px">
			<table>
				<tr>
					<th>Router Board:</th>
					<th class="col-value">{{ this.store.serverData.routerBoard }}</th>
				</tr>
				<tr>
					<th>OS version:</th>
					<th class="col-value">{{ this.store.serverData.version }}</th>
				</tr>
			</table>
		</div>
		<div class="server-info">
			WG Interfaces
		</div>
		<div v-for="(int, index) in this.store.serverData['interfaces']">
			<table>
				<tr>
					<th>Interface name:</th>
					<th class="col-value">{{ int.name }}</th>
				</tr>
				<tr>
					<th>Port:</th>
					<th class="col-value"> {{ int.listenPort }}</th>
				</tr>
				<tr>
					<th>MTU:</th>
					<th class="col-value">{{ int.mtu }}</th>
				</tr>
				<tr>
					<th>Running:</th>
					<th class="col-value">{{ int.running }}</th>
				</tr>
			</table>
			<q-separator v-if="!(this.store.serverData['interfaces'].length - 1 === index)" style="margin: 8px 0 8px 0"/>
		</div>
	</q-card>
</template>

<script>

import {useStore} from "../../store.js";

export default {
	setup() {
		const store = useStore()
		return { store }
	}
}

</script>

<style scoped>
.infoBox {
	padding: 8px;
}
.server-info {
	font-size: 1.25rem;
}
th {
	white-space: nowrap;
	color: rgba(108, 108, 108, 1);
	font-weight: 520;
	text-align: start;
}
.col-value {
	color: rgba(36, 36, 36, 1);
}
</style>