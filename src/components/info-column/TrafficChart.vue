<template>
	<div class="traffic-chart">
		<div class="chart-frame">
			<CanvasJSChart :options="options" :style="styleOptions" @chart-ref="chartInstance"/>
			<div v-if="!hasTraffic" class="empty-chart">Waiting for traffic data</div>
		</div>
		<button
			v-if="dominantPeer"
			type="button"
			class="traffic-leader"
			:title="`Open ${dominantPeer.name}`"
			@click="$emit('open-peer', dominantPeer.id)"
		>
			<q-icon name="warning_amber" class="traffic-leader__icon" aria-hidden="true"/>
			<span class="traffic-leader__copy">
				<span class="traffic-leader__label">Highest traffic load</span>
				<strong>{{ dominantPeer.name }}</strong>
			</span>
			<q-icon name="open_in_new" class="traffic-leader__open" aria-hidden="true"/>
		</button>
	</div>
</template>

<script>
import {useStore} from "../../store.js";

export default {
	emits: ['open-peer'],
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
		dominantPeer() {
			return this.store.dominantTrafficPeer
		},
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

.chart-frame {
	position: relative;
	width: 100%;
	min-width: 0;
	overflow: hidden;
}

.traffic-leader {
	width: 100%;
	min-width: 0;
	min-height: 50px;
	margin-top: 8px;
	padding: 8px 10px;
	display: flex;
	align-items: center;
	gap: 9px;
	border: 1px solid rgba(255, 59, 48, 0.28);
	border-radius: 6px;
	background: rgba(255, 59, 48, 0.06);
	color: #242424;
	font: inherit;
	text-align: left;
	cursor: pointer;
	transition: background-color 0.18s, border-color 0.18s, transform 0.18s;
}

.traffic-leader:hover,
.traffic-leader:focus-visible {
	border-color: var(--q-primary);
	background: rgba(255, 59, 48, 0.11);
}

.traffic-leader:active {
	transform: translateY(1px);
}

.traffic-leader:focus-visible {
	outline: 2px solid rgba(255, 59, 48, 0.25);
	outline-offset: 2px;
}

.traffic-leader__icon {
	flex: 0 0 auto;
	font-size: 25px;
	color: var(--q-primary);
}

.traffic-leader__copy {
	min-width: 0;
	flex: 1;
}

.traffic-leader__copy span,
.traffic-leader__copy strong {
	display: block;
}

.traffic-leader__label {
	margin-bottom: 1px;
	color: #6c6c6c;
	font-size: 11px;
	line-height: 1.2;
}

.traffic-leader__copy strong {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	font-weight: 600;
}

.traffic-leader__open {
	flex: 0 0 auto;
	color: #6c6c6c;
	font-size: 17px;
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
