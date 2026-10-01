<template>
  <q-table
      flat bordered
      :rows="this.store.tableData"
      :columns="this.store.tableColumns"
      :loading="this.isLoading"
      row-key="name"
      virtual-scroll
      color="amber"
      :rows-per-page-options="[0]"
      style="height: 100%"
  >
    <template v-slot:header="props">
      <tr>
        <q-th
            v-for="col in props.cols"
            :key="col.name"
            :style="{
					position: 'sticky',
					top: '0',
					'z-index': '1',
					'background-color': 'var(--q-primary)',
					color: 'white'
				}"
            :props="props"
        >
          {{ col.label }}
        </q-th>
      </tr>
    </template>

    <template v-slot:body="props">
      <q-tr
          v-if="this.store.tableData.length !== 0"
          style="cursor: pointer"
          :props="props"
          :class="{'peer-row--disabled': props.row.disabled}"
          @click="this.openPeerDetails(props.row)"
      >
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <span
              v-if="col.name === 'name'"
              class="peer-name-cell"
              :class="{'peer-name-cell--warning': props.row.id === this.store.dominantTrafficPeerId}"
          >
            <q-icon
                v-if="props.row.id === this.store.dominantTrafficPeerId"
                name="warning_amber"
                class="traffic-warning"
                aria-label="Highest traffic load"
            >
              <q-tooltip>Highest traffic load</q-tooltip>
            </q-icon>
            <span>{{ col.value }}</span>
          </span>
          <template v-else>{{ col.value }}</template>
        </q-td>
      </q-tr>
      <q-inner-loading
          v-else
          :showing="this.isLoading"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
      />
    </template>
  </q-table>
  <q-dialog v-model="this.showPeerDetails">
    <peer-modal
        :peer-details="this.peerDetails"
        :peer-config="this.peerConfig"
        @closeModal="this.closeModal"
        @deletePeer="this.deletePeer($event)"
        @doubleVpn="this.doubleVpnChange($event)"
        @peer-renamed="this.peerRenamed($event)"
        @peer-status-changed="this.peerStatusChanged($event)"
    />
  </q-dialog>
</template>

<script>
import {useStore} from "../store.js";
import QrcodeVue from 'qrcode.vue'
import PeerModal from "./table-column/PeerModal.vue";
import axios from "axios";

export default {
  props: ['rows'],
  components: {PeerModal, QrcodeVue},
  data: () => ({
    showPeerDetails: false,
    peerConfig: '',
    peerDetails: [],
    isLoading: true
  }),
  methods: {
    openPeerById(peerId) {
      const peer = this.store.tableData.find(item => item.id === peerId)
      if (peer) this.openPeerDetails(peer)
    },
    openPeerDetails(row) {
      this.showPeerDetails = true
      this.peerDetails = row

      this.peerConfig = this.createPeerConfig(row)
    },
    createPeerConfig(row) {
      return `
			  |[Interface]
			  |PrivateKey = ${row.privateKey}
			  |Address = ${row.allowedAddress}
			  |DNS = 1.1.1.1
			  |MTU = 1400
			  |[Peer]
			  |PublicKey = ${row.publicKey}
			  |AllowedIPs = 0.0.0.0/0, ::/0
			  |Endpoint = ${this.store.settings.inputWgEndpoint}:${this.store.settings.inputWgEndpointPort}
			  |PersistentKeepalive = 0`.stripMargin()
    },
    peerRenamed(peer) {
      this.peerDetails = peer
      this.peerConfig = this.createPeerConfig(peer)
    },
    peerStatusChanged(peer) {
      this.peerDetails = peer
      this.peerConfig = this.createPeerConfig(peer)
    },
    closeModal() {
      this.showPeerDetails = false
    },
    deletePeer(peer) {
      axios.post('/api/v1/remove-peer', peer).then(() => {
        this.store.fetchData()
        this.closeModal()
        this.$q.notify({
          message: 'Peer successfully removed',
          type: 'positive',
          position: 'top-right',
          actions: [{
            icon: 'close', color: 'white', dense: true, handler: () => undefined
          }]
        })
      })
    },
    doubleVpnChange(body) {
      axios.post('/api/v1/change-routing-peer', body)
          .then((response) => {
            this.store.updatePeers(response.data)
            const peer = response.data.find((peer) => peer.id === body.id)
            if (peer) this.peerDetails = peer
            const prefix = this.store.settings.doubleVpnInverted ? 'Double VPN bypass' : 'Double VPN'
            this.$q.notify({
              message: `${prefix} ${peer?.doubleVpn ? 'ON' : 'OFF'}`,
              type: 'positive',
              position: 'top-right',
              actions: [{
                icon: 'close', color: 'white', dense: true, handler: () => undefined
              }]
            })
          })
    }
  },
  created() {
    this.store.fetchData()
        .then(() => {
              this.isLoading = false
            }
        )
  },
  setup() {
    const store = useStore()
    return {store}
  }
}
</script>

<style lang="scss" scoped>
:deep(.peer-row--disabled > td) {
  background: #eeeeee !important;
  color: #777777 !important;
}

:deep(.peer-row--disabled:hover > td) {
  background: #e3e3e3 !important;
}

.peer-name-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
}

.peer-name-cell--warning {
  display: inline-grid;
  grid-template-columns: 20px minmax(0, auto) 20px;
}

.peer-name-cell--warning::after {
  width: 20px;
  content: '';
}

.traffic-warning {
  flex: 0 0 auto;
  color: var(--q-primary);
  font-size: 20px;
}

.my-sticky-header-table {
  height: calc(100vh - 80px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: var(--q-primary);
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }

  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
