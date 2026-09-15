<template>
	<div class="traffic-chart">
		<CanvasJSChart :options="options" :style="styleOptions" @chart-ref="chartInstance"/>
		<div v-if="!hasTraffic" class="empty-chart">Waiting for traffic data</div>
	</div>
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
				animationEnabled: false,
				axisX: {
					valueFormatString: "HH:mm",
					labelAngle: -35
				},
				axisY: {
					minimum: 0,
					includeZero: true
				},
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
			if (!this.chart) return
			this.options.data[0].dataPoints = []
			this.options.data[1].dataPoints = []
			this.store.trafficData.forEach((dataPoint) => {
				this.options.data[0].dataPoints.push({
					x: new Date(dataPoint.time * 1000),
					y: Number(dataPoint.tx) || 0
				});
				this.options.data[1].dataPoints.push({
					x: new Date(dataPoint.time * 1000),
					y: Number(dataPoint.rx) || 0
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
		hasTraffic() {
			return this.store.trafficData.length > 0
		},
		getTraffic() {
			return this.store.trafficData
		}
	},
	watch: {
		getTraffic: {
			deep: true,
			handler() {
			this.renderChart()
			}
		}
	},
	mounted() {
		const credit = this.$el.querySelector(".canvasjs-chart-credit")
		if (credit) credit.style.display = "none"
	},
	setup() {
		const store = useStore()
		return {store}
	}
}
</script>

<style scoped>
.traffic-chart {
	position: relative;
	width: 100%;
	min-width: 0;
	overflow: hidden;
}

.empty-chart {
	position: absolute;
	inset: 16px 16px 48px 48px;
	display: grid;
	place-items: center;
	color: #6c6c6c;
	font-size: 12px;
	line-height: 1.35;
	text-align: center;
	overflow: hidden;
	pointer-events: none;
}
</style>
