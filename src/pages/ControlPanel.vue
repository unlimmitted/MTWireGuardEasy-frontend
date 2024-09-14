<template>
	<div
		class="container"
		:style="this.isMobile ? 'flex-direction: column' : ''"
	>
		<div
			class="infoColumn"
			:style="this.isMobile ? 'width: 100%;margin-bottom: 8px;': ''"
		>
			<info-column/>
		</div>
		<div
			class="tableColumn"
			:style="this.isMobile ? 'width: 100%;margin-bottom: 8px;margin-top: 0;padding-left: 20px;': ''"
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
			return this.$q.screen.width < 1023
		}
	},
	mounted() {
		if (!this.store.settings) {
			console.log(this.store.settings)
			this.$router.push('/settings')
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
}
.infoColumn {
	margin-top: 40px;
	margin-bottom: 40px;
	padding: 0 20px 0 20px;
	width: 30%;
}
.tableColumn {
	margin-top: 40px;
	margin-bottom: 40px;
	padding: 0 20px 0 0;
	width: 70%;
}
</style>
