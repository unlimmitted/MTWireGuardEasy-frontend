<template>
	<q-card>
		<div class="interface-card">
			<div class="card-section">
				Name: {{ interface.name }}
			</div>
			<div class="card-section">
				Port: {{ interface.listenPort }}
			</div>
			<div class="card-section">
				Disabled: {{ interface.disabled }}
			</div>
			<div class="edit-btn">
				<q-btn
					color="primary"
					:disabled="this.interface.name === this.store.settings.inputWgInterfaceName || interface.isRouting"
					dense
					flat
					round
					icon="delete"
					@click="this.deleteInterface"
				>
					<q-tooltip>
						{{ this.deleteTooltipText }}
					</q-tooltip>
				</q-btn>
				<q-btn
					v-if="!this.interface.disabled"
					style="color: gray"
					:disabled="this.interface.name === this.store.settings.inputWgInterfaceName || interface.isRouting"
					dense
					flat
					icon="disabled_by_default"
					@click="this.disableInterface"
				>
					<q-tooltip>
						{{ this.disableInterfaceText }}
					</q-tooltip>
				</q-btn>
				<q-btn
					v-else
					icon="check_box"
					style="color: gray"
					dense
					flat
					@click="this.enableInterface"
				>
					<q-tooltip>
						Enable interface
					</q-tooltip>
				</q-btn>
			</div>
		</div>
	</q-card>
</template>
<script>
import {useStore} from "../../store.js";

export default {
	name: "InterfaceCard",
	props: ["interface"],
	methods: {
		deleteInterface() {
			console.log("Delete: " + this.interface)
		},
		disableInterface() {
			console.log("Disable interface: " + this.interface)
		},
		enableInterface() {
			console.log("Enable interface: " + this.interface)
		}
	},
	computed: {
		deleteTooltipText() {
			const isInputWgInterface = this.interface.name === this.store.settings.inputWgInterfaceName
			return isInputWgInterface ? 'This input interface.' : this.interface.isRouting ?
				'This interface is used for routing.' : 'Delete interface.'
		},
		disableInterfaceText() {
			const isInputWgInterface = this.interface.name === this.store.settings.inputWgInterfaceName
			return isInputWgInterface ? 'This input interface.' : this.interface.isRouting ?
				'This interface is used for routing.' : 'Disable interface'
		}
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>
<style scoped>
.interface-card {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 200px;
	height: 80px;
	padding: 8px;
}
.card-section {
	display: flex;
}
.edit-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	flex-direction: column;
}
</style>