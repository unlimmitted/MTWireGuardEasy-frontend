<template>
  <q-card class="peer-modal">
    <q-toolbar class="peer-toolbar">
      <button
          v-if="!editingName"
          type="button"
          class="peer-title"
          :title="`Rename ${peerDetails.name}`"
          @click="beginRename"
      >
        <span>Peer: {{ peerDetails.name }}</span>
        <q-icon name="edit" class="peer-title-edit" aria-hidden="true"/>
      </button>
      <div v-else class="peer-title-editor">
        <q-input
            ref="nameInput"
            v-model="editedName"
            class="peer-title-input"
            dense
            outlined
            maxlength="64"
            :disable="savingName"
            aria-label="Peer name"
            @keyup.enter="saveName"
            @keyup.esc="cancelRename"
        />
        <q-btn
            round
            dense
            unelevated
            color="primary"
            icon="check"
            :disable="!canSaveName"
            :loading="savingName"
            aria-label="Save peer name"
            @click="saveName"
        >
          <q-tooltip>Save</q-tooltip>
        </q-btn>
        <q-btn
            round
            dense
            flat
            icon="close"
            :disable="savingName"
            aria-label="Cancel renaming"
            @click="cancelRename"
        >
          <q-tooltip>Cancel</q-tooltip>
        </q-btn>
      </div>
      <q-btn v-if="!editingName" flat round icon="close" aria-label="Close" v-close-popup/>
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
            {{ store.settings.doubleVpnInverted ? 'Bypass Double VPN' : 'Double VPN' }}
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
import axios from 'axios'

export default {
  components: {PeerTrafficChart, QrcodeVue},
  emits: ['deletePeer', 'doubleVpn', 'peer-renamed'],
  props: ['peerConfig', 'peerDetails'],
  data: () => ({
    doubleVpn: false,
    editingName: false,
    editedName: '',
    savingName: false
  }),
  computed: {
    normalizedName() {
      return this.editedName.trim()
    },
    canSaveName() {
      return !this.savingName &&
          this.normalizedName.length > 0 &&
          this.normalizedName.length <= 64 &&
          this.normalizedName !== this.peerDetails.name &&
          !/[\r\n"';]/.test(this.normalizedName)
    }
  },
  methods: {
    beginRename() {
      this.editedName = this.peerDetails.name || ''
      this.editingName = true
      this.$nextTick(() => this.$refs.nameInput?.focus())
    },
    cancelRename() {
      if (this.savingName) return
      this.editedName = this.peerDetails.name || ''
      this.editingName = false
    },
    async saveName() {
      if (!this.canSaveName) return
      this.savingName = true
      try {
        const response = await axios.post('/api/v1/rename-peer', {
          id: this.peerDetails.id,
          name: this.normalizedName
        })
        this.store.updatePeers(response.data)
        const renamedPeer = response.data.find(peer => peer.id === this.peerDetails.id)
        if (renamedPeer) this.$emit('peer-renamed', renamedPeer)
        this.editingName = false
        this.$q.notify({
          message: 'Peer successfully renamed',
          type: 'positive',
          position: 'top-right'
        })
      } catch (error) {
        this.$q.notify({
          message: error.response?.data?.error || 'Unable to rename peer',
          type: 'negative',
          position: 'top-right'
        })
      } finally {
        this.savingName = false
      }
    },
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
    this.editedName = this.peerDetails.name || ''
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
  gap: 8px;
  padding: 8px 16px 0;
}

.peer-title {
  min-width: 0;
  max-width: calc(100% - 44px);
  padding: 4px 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  overflow: hidden;
  font-size: 1.25rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.18s;
}

.peer-title span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.peer-title:hover,
.peer-title:focus-visible {
  background: rgba(0, 0, 0, 0.05);
}

.peer-title:focus-visible {
  outline: 2px solid rgba(255, 59, 48, 0.25);
}

.peer-title-edit {
  flex: 0 0 auto;
  color: #6c6c6c;
  font-size: 17px;
}

.peer-title-editor {
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.peer-title-input {
  min-width: 0;
  flex: 1;
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
