<template>
	<div
		class="container"
		:style="this.isMobile ? 'flex-direction: column' : ''"
	>
		<div
			class="infoColumn"
			:style="this.isMobile ? 'width: 100%;margin-bottom: 8px;': 'padding: 0 20px 0 0;'"
		>
			<info-column/>
		</div>
		<div
			class="tableColumn"
			:style="this.isMobile ? 'width: 100%;margin-bottom: 8px;margin-top: 0;': ''"
		>
			<table-column/>
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
}
.infoColumn {
	display: flex;
	flex-direction: column;
	width: 20%;
	min-width: 300px !important;
}
.tableColumn {
	width: 80%;
}
</style>
