<template>
	<MainLayout/>
</template>

<script>
import MainLayout from "./layouts/MainLayout.vue"
import {useStore} from "./store.js"

export default {
	components: {MainLayout},
	setup() {
		const store = useStore()

		String.prototype.stripMargin = function (marginChar = '|') {
			return this.split('\n')
				.map(line => {
					const pos = line.indexOf(marginChar)
					return pos >= 0 ? line.slice(pos + 1) : line
				})
				.join('\n')
		}

		return {store}
	}
}
</script>

<style scoped>

</style>
