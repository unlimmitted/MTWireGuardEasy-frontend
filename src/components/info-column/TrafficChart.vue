<template>
	<CanvasJSChart :options="options" :style="styleOptions" @chart-ref="chartInstance"/>
</template>

<script>
import {useStore} from "../../store.js";

export default {
	data() {
		return {
			chart: null,
			xVal: 0,
			options: {
				exportEnabled: false,
				animationEnabled: true,
				data: [
					{
						type: "splineArea",
						color: "#1A73E8",
						legendMarkerType: "circle",
						showInLegend: true,
						name: "tx",
						dataPoints: []
					},
					{
						type: "splineArea",
						color: "#B32824",
						legendMarkerType: "circle",
						showInLegend: true,
						name: "rx",
						dataPoints: []
					}
				]
			},
			styleOptions: {
				width: "100%",
				height: "200px"
			}
		}
	},
	methods: {
		renderChart() {
			this.options.data[0].dataPoints = []
			this.options.data[1].dataPoints = []
			this.store.trafficData.forEach((dataPoint) => {
				this.options.data[0].dataPoints.push({
					x: new Date(dataPoint.time * 1000),
					y: dataPoint.tx
				});
				this.options.data[1].dataPoints.push({
					x: new Date(dataPoint.time * 1000),
					y: dataPoint.rx
				});
			});

			this.chart.render();
		},
		chartInstance(chart) {
			this.chart = chart;
			this.renderChart();
		}
	},
	computed: {
		getTraffic() {
			return this.store.trafficData
		}
	},
	watch: {
		getTraffic() {
			this.renderChart()
		}
	},
	mounted() {
		document.getElementsByClassName("canvasjs-chart-credit")[0].style.display = "none";
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style scoped>

</style>