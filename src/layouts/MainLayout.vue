<template>
	<div
		class="layout"
		:style="this.isMobile ? 'overflow: scroll': ''"
	>
		<router-view/>
	</div>
</template>

<script>

export default {
	computed: {
		isMobile() {
			return this.$q.screen.width < 1023
		}
	}
}

</script>

<style scoped>
.layout {
	background-color: rgba(243, 243, 243, 1) !important;
	height: 100vh;
	overflow: hidden;
}
</style>