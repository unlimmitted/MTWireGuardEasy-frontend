<template>
	<div
		class="layout"
	>
		<router-view/>
	</div>
</template>

<script>

export default {
	computed: {
		isMobile() {
			return this.$q.screen.width < 1180
		}
	}
}

</script>

<style scoped>
.layout {
	background-color: rgba(243, 243, 243, 1) !important;
	min-height: 100vh;
	overflow-x: hidden;
}
</style>
