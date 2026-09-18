import SockJS from "sockjs-client/dist/sockjs"
import {Stomp} from '@stomp/stompjs'
import {useStore} from './store'
import axios from 'axios'

let stompClient = null

export function connect() {
	if (stompClient?.connected) return
	stompClient = Stomp.over(function () {
		return new SockJS('/ws')
	})
	stompClient.debug = function () {
	}
	stompClient.connect({}, () => {
		stompClient.subscribe('/topic/interface/',
			message => getInterfaces(message)
		)
		stompClient.subscribe('/topic/peers/',
			message => getPeers(message)
		)
		stompClient.subscribe('/topic/trafficInInterface/',
			message => getTrafficInInterface(message)
		)
	}, () => {
		axios.get('/auth/status').catch(() => undefined)
	})
}

export function disconnect() {
	if (stompClient?.connected) {
		stompClient.disconnect()
	}
	stompClient = null
}

function getInterfaces(message) {
	useStore().serverData.interfaces = JSON.parse(message.body).interfaces
}

function getPeers(message) {
	useStore().updatePeers(JSON.parse(message.body), true)
}

function getTrafficInInterface(message) {
	useStore().trafficData = JSON.parse(message.body)
}
