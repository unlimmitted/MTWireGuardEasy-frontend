import SockJS from "sockjs-client/dist/sockjs"
import {Stomp} from '@stomp/stompjs'
import {useStore} from './store'

let stompClient = null

export function connect() {
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
	})
}

function getInterfaces(message) {
	useStore().serverData.interfaces = JSON.parse(message.body).interfaces
}

function getPeers(message) {
	useStore().tableData = JSON.parse(message.body)
}

function getTrafficInInterface(message) {
	useStore().trafficData = JSON.parse(message.body)
}