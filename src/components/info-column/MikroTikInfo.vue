<template>
  <q-card
      class="shadow-1 infoBox"
  >
    <div class="info-content">
    <div class="server-info">MikroTik info</div>
    <div class="router-summary">
      <table>
        <tr>
          <th>Router Board:</th>
          <th class="col-value">{{ this.store.serverData.routerBoard }}</th>
        </tr>
        <tr>
          <th>OS version:</th>
          <th class="col-value">{{ this.store.serverData.version }}</th>
        </tr>
      </table>
    </div>
    <div class="server-info">
      WireGuard Interfaces
    </div>
    <div class="interfaces-list" v-if="this.store.serverData.interfaces.length">
      <div
          v-for="(int, index) in this.getActualInterfaces"
          :key="int.name"
          class="interface-row"
      >
        <div class="interface-details">
          <table>
            <tr>
              <th>Interface name:</th>
              <th class="col-value interface-name">
                <div
                    class="interface-name-viewport"
                    :title="int.name"
                    @mouseenter="startNameMarquee"
                    @mouseleave="stopNameMarquee"
                >
                  <span class="interface-name-text">{{ int.name }}</span>
                </div>
              </th>
            </tr>
            <tr>
              <th>Port:</th>
              <th class="col-value"> {{ int.listenPort }}</th>
            </tr>
            <tr>
              <th style="color: rgba(255, 59, 48, 1) !important;">Rx:</th>
              <th style="color: rgba(255, 59, 48, 1) !important;">
                {{ formatTraffic(int.rxByte) }}
              </th>
            </tr>
            <tr>
              <th style="color: rgba(50, 173, 230, 1) !important;">Tx:</th>
              <th style="color: rgba(50, 173, 230, 1) !important;">
                {{ formatTraffic(int.txByte) }}
              </th>
            </tr>
          </table>
          <div
              v-if="int.name !== this.store.settings.inputWgInterfaceName &&
						this.store.serverData.interfaces.filter(it => !it.disabled && it.name !== this.store.settings.inputWgInterfaceName).length > 1"
              :id="'drag-' + index"
              class="drag-container shadow-1"
              :style="int.isRouting ? 'opacity: 1;' : this.isDragOver === index ? '' : 'opacity: 0.6;'"
              @dragenter.prevent="dragEnter(index)"
              @dragleave.prevent="dragLeave(index)"
              @dragover.prevent="dragOver(index)"
              @drop.prevent="dragDrop(int)"
              :class="{ 'drag-over': isDragOver === index }"
          >
            <div
                v-if="int.isRouting"
                class="drag-item"
                draggable="true"
                @dragstart="dragStart($event, int, index)"
                @dragend="dragEnd"
            >
              <q-icon name="drag_indicator" size="16px"/>
              Route
              <q-tooltip>
                WireGuard routes to this interface
              </q-tooltip>
            </div>
            <q-icon v-else name="drag_indicator" size="16px" class="drag-placeholder"/>
          </div>
          <div v-if="int.name === this.store.settings.inputWgInterfaceName" class="chart-wrap">
            <traffic-chart @open-peer="$emit('open-peer', $event)"/>
          </div>
          <q-separator v-if="index < getActualInterfaces.length - 1"
                       style="margin: 8px 0 8px 0"/>
        </div>
      </div>
    </div>
    <div class="empty-state" v-else>
      <q-spinner
          color="primary"
          size="3em"
      />
    </div>
    </div>
    <div class="info-actions">
      <q-btn
          icon="settings"
          class="routing-button"
          @click="this.settingsModal = !this.settingsModal"
      >
        Routing
      </q-btn>
      <q-btn icon="logout" color="primary" @click="this.logout"/>
    </div>
  </q-card>
  <q-dialog v-model="settingsModal">
    <settings-modal/>
  </q-dialog>
</template>

<script>

import {formatTraffic, useStore} from "../../store.js";
import SettingsModal from "./SettingsModal.vue";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";
import TrafficChart from "./TrafficChart.vue";

export default {
	emits: ['open-peer'],
  components: {
    TrafficChart,
    SettingsModal,
    apexchart: VueApexCharts
  },
  data: () => ({
    settingsModal: false,
    draggedItem: null,
    sourceIndex: null,
    isDragOver: null,
  }),
  methods: {
    formatTraffic,
    startNameMarquee(event) {
      const viewport = event.currentTarget
      const text = viewport.firstElementChild
      const distance = text.scrollWidth - viewport.clientWidth
      if (distance > 0) {
        viewport.style.setProperty('--marquee-distance', `${distance}px`)
        viewport.style.setProperty('--marquee-duration', `${Math.max(2.5, distance / 24)}s`)
        viewport.classList.add('is-overflowing')
      }
    },
    stopNameMarquee(event) {
      event.currentTarget.classList.remove('is-overflowing')
    },
    logout() {
      axios.post("/auth/logout")
          .then(() => {
                this.$router.push('/login')
              }
          )
    },
    dragStart(event, item, index) {
      this.draggedItem = item;
      this.sourceIndex = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(item));
    },
    dragEnd() {
      this.draggedItem = null;
      this.sourceIndex = null;
      this.isDragOver = null;
    },
    dragEnter(index) {
      this.isDragOver = index;
    },
    dragLeave(index) {
      if (this.isDragOver === index) {
        this.isDragOver = null;
      }
    },
    dragOver(index) {
      this.isDragOver = index;
    },
    dragDrop(targetInterface) {
      if (this.draggedItem && this.draggedItem.name !== targetInterface.name) {
        this.draggedItem.isRouting = false;
        targetInterface.isRouting = true;
        this.draggedItem = null;
        this.sourceIndex = null;
        this.isDragOver = null;
        axios.post("/api/v1/change-routing-vpn", targetInterface)
            .then((response) => {
              this.store.serverData = response.data
            })
      }
    }
  },
  created() {
    this.store.fetchRouterInfo()
        .then(() => {

        })
  },
  computed: {
    isMobile() {
      return this.$q.screen.width < 1180
    },
    getActualInterfaces() {
      return (this.store.serverData.interfaces || []).filter(it => !it.disabled)
    }
  },
  setup() {
    const store = useStore()
    return {store}
  }
}

</script>

<style scoped>
.infoBox {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.info-content {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
}

.router-summary {
  margin-bottom: 8px;
}

.server-info {
  font-size: 1.25rem;
}

th {
  color: rgba(108, 108, 108, 1);
  font-weight: 520;
  text-align: start;
}

.col-value {
  color: rgba(36, 36, 36, 1);
  padding-left: 8px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.interface-row,
.interface-details {
  position: relative;
  width: 100%;
  min-width: 0;
}

.interface-details table {
  width: 100%;
  table-layout: fixed;
}

.interface-details th:first-child {
  width: 52%;
}

.interface-name {
  padding-right: 76px;
  min-width: 0;
}

.interface-name-viewport {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.interface-name-text {
  display: inline-block;
  white-space: nowrap;
}

.interface-name-viewport.is-overflowing .interface-name-text {
  animation: interface-name-marquee var(--marquee-duration) linear infinite alternate;
}

@keyframes interface-name-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-1 * var(--marquee-distance)));
  }
}

.chart-wrap {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.empty-state {
  min-height: 120px;
  display: grid;
  place-items: center;
}

.info-actions {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
}

.routing-button {
  flex: 1;
}

@media (max-width: 1179px) {
  .infoBox {
    height: auto;
  }

  .info-content {
    overflow: visible;
  }
}

.drag-container {
  border: 1px solid rgba(0, 0, 0, 0.18);
  background-color: #f5f5f5;
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 6px;
  width: 64px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.48);
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.drag-container.drag-over {
  border-color: var(--q-primary);
  background-color: rgba(255, 59, 48, 0.08);
  box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.12);
}

.drag-item {
  color: white;
  cursor: grab;
  font-size: 12px;
  gap: 2px;
  background-color: var(--q-primary);
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-item:active {
  cursor: grabbing;
}

.drag-placeholder {
  color: rgba(0, 0, 0, 0.35);
}
</style>
