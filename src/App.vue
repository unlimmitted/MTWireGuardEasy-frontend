<template>
  <MainLayout/>
</template>

<script>
import MainLayout from "./layouts/MainLayout.vue";
import {useStore} from "./store.js";
export default {
	components: {MainLayout},
	setup() {
		const store = useStore()
		return { store }
	}
}
</script>

<style scoped>

</style>
