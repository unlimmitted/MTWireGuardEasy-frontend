<template>
  <q-card class="peer-modal">
    <q-toolbar class="peer-toolbar">
      <div class="peer-title" :title="peerDetails.name">Peer: {{ peerDetails.name }}</div>
      <q-btn flat round icon="close" v-close-popup/>
    </q-toolbar>

    <q-card-section class="peer-modal-content">
      <div class="peer-actions">
        <qrcode-vue
            class="qr-view"
            :value="peerConfig"
            :size="250"
            level="H"
        />

        <div class="peer-buttons">
          <q-btn color="primary" icon="download" @click="downloadConfig">
            Download config
          </q-btn>
          <q-btn icon="content_copy" outlined @click="copyConfig">
            Copy config text
          </q-btn>
          <div v-if="store.settings.vpnChainMode" class="double-vpn">
            Double VPN
            <q-toggle
                v-model="doubleVpn"
                color="primary"
                @click="changeDoubleVpn"
            />
          </div>
          <q-btn color="dark" icon="delete_forever" @click="deletePeer">
            Delete WireGuard Peer
          </q-btn>
        </div>
      </div>

      <peer-traffic-chart :peer-id="peerDetails.id"/>
    </q-card-section>
  </q-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import {useStore} from '../../store.js'
import PeerTrafficChart from './PeerTrafficChart.vue'

export default {
  components: {PeerTrafficChart, QrcodeVue},
  props: ['peerConfig', 'peerDetails'],
  data: () => ({
    doubleVpn: false
  }),
  methods: {
    downloadConfig() {
      const url = window.URL.createObjectURL(new Blob([this.peerConfig]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', this.peerDetails.name + '.conf')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    copyConfig() {
      navigator.clipboard.writeText(this.peerConfig)
      this.$q.notify({
        message: 'Copied to clipboard',
        type: 'positive',
        position: 'top-right',
        actions: [{
          icon: 'close', color: 'white', dense: true, handler: () => undefined
        }]
      })
    },
    deletePeer() {
      this.$emit('deletePeer', this.peerDetails)
    },
    changeDoubleVpn() {
      this.$emit('doubleVpn', this.peerDetails, this.doubleVpn)
    }
  },
  created() {
    this.doubleVpn = this.peerDetails.doubleVpn
  },
  setup() {
    const store = useStore()
    return {store}
  }
}
</script>

<style scoped>
.peer-modal {
  width: min(1000px, calc(100vw - 32px));
  max-width: 1000px !important;
  max-height: calc(100vh - 32px);
  overflow: auto;
}

.peer-toolbar {
  justify-content: space-between;
  padding: 8px 16px 0;
}

.peer-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.25rem;
}

.peer-modal-content {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  padding: 16px 24px 24px;
}

.peer-actions {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-view {
  max-width: 100%;
  height: auto;
}

.peer-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.double-vpn {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 700px) {
  .peer-modal {
    width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
  }

  .peer-modal-content {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding: 12px 16px 20px;
  }
}
</style>
