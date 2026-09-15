<template>
  <section class="traffic-panel">
    <div class="traffic-title">Traffic for the last 24 hours</div>

    <div class="chart-shell">
      <CanvasJSChart
          v-if="hasPoints"
          :options="chartOptions"
          :style="chartStyle"
      />
      <div v-else-if="loading" class="chart-state">
        <q-spinner color="primary" size="36px"/>
      </div>
      <div v-else class="chart-state">
        <q-icon name="query_stats" size="32px"/>
        <span>{{ error || 'Traffic data will appear after new samples are collected' }}</span>
      </div>
    </div>

    <div class="traffic-totals">
      <div class="traffic-total traffic-total--rx">
        <span>Rx for 24h</span>
        <strong>{{ formatTraffic(history.totalRx) }}</strong>
      </div>
      <div class="traffic-total traffic-total--tx">
        <span>Tx for 24h</span>
        <strong>{{ formatTraffic(history.totalTx) }}</strong>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import {formatTraffic} from '../../store.js'

const emptyHistory = () => ({points: [], totalRx: 0, totalTx: 0})

export default {
  props: {
    peerId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    history: emptyHistory(),
    loading: false,
    error: '',
    requestId: 0,
    chartStyle: {
      width: '100%',
      height: '280px'
    }
  }),
  computed: {
    hasPoints() {
      return this.history.points.length > 0
    },
    chartOptions() {
      const toPoint = (point, field) => ({
        x: new Date(Number(point.time) * 1000),
        y: Number(point[field]) || 0,
        formatted: formatTraffic(point[field])
      })
      return {
        animationEnabled: false,
        exportEnabled: false,
        backgroundColor: 'transparent',
        axisX: {
          valueFormatString: 'HH:mm',
          labelAngle: -35,
          intervalType: 'hour',
          interval: 4
        },
        axisY: {
          minimum: 0,
          includeZero: true,
          labelFormatter: event => formatTraffic(event.value)
        },
        toolTip: {
          shared: true
        },
        legend: {
          horizontalAlign: 'center'
        },
        data: [
          {
            type: 'splineArea',
            name: 'tx',
            color: '#1A73E8',
            fillOpacity: 0.25,
            legendMarkerType: 'circle',
            showInLegend: true,
            toolTipContent: '{name}: {formatted}',
            dataPoints: this.history.points.map(point => toPoint(point, 'tx'))
          },
          {
            type: 'splineArea',
            name: 'rx',
            color: '#B32824',
            fillOpacity: 0.2,
            legendMarkerType: 'circle',
            showInLegend: true,
            toolTipContent: '{name}: {formatted}',
            dataPoints: this.history.points.map(point => toPoint(point, 'rx'))
          }
        ]
      }
    }
  },
  watch: {
    peerId: {
      immediate: true,
      handler() {
        this.fetchTraffic()
      }
    }
  },
  methods: {
    formatTraffic,
    async fetchTraffic() {
      const currentRequest = ++this.requestId
      this.history = emptyHistory()
      this.error = ''
      if (!this.peerId) return

      this.loading = true
      try {
        const response = await axios.get('/api/v1/peer-traffic', {
          params: {peerId: this.peerId}
        })
        if (currentRequest === this.requestId) {
          this.history = {
            ...emptyHistory(),
            ...response.data,
            points: response.data?.points || []
          }
        }
      } catch (error) {
        if (currentRequest === this.requestId) {
          this.error = 'Unable to load traffic history'
        }
      } finally {
        if (currentRequest === this.requestId) {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.traffic-panel {
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.traffic-panel :deep(.canvasjs-chart-credit) {
  display: none !important;
}

.traffic-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.chart-shell {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: #fff;
}

.chart-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: #6c6c6c;
  text-align: center;
  line-height: 1.35;
}

.traffic-totals {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.traffic-total {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: #fafafa;
}

.traffic-total span,
.traffic-total strong {
  display: block;
}

.traffic-total span {
  color: #6c6c6c;
  font-size: 0.78rem;
  margin-bottom: 4px;
}

.traffic-total strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1rem;
}

.traffic-total--rx strong {
  color: #B32824;
}

.traffic-total--tx strong {
  color: #1A73E8;
}

@media (max-width: 480px) {
  .traffic-totals {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
