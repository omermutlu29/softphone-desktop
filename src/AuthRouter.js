import React, { Component } from 'react'
import JsSIP from 'jssip'
import Login from './SıpDialerNew/pages/Login'
import App from './SıpDialerNew/App'
import CryptoJS from 'crypto-js'
import MainPage from './SıpDialerNew/pages/MainPage'
import { get,save } from './helpers/CDR'

const app = window.require('electron').remote
const fs = app.require('fs')

export default class AuthRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRegistered: null
    }
  }

  componentDidMount = async () => {
    console.log(CryptoJS.AES.encrypt(JSON.stringify({
      username: '108-pbx18',
      password: 'CPqcezx4XSbv',
      ip: 'js16.jettel.com.tr'
    }), process.env.REACT_APP_CRYPTO_KEY).toString())
    fs.readFile('./auth.json', 'utf8', async (err, data) => {
      let { username, password, ip } = await (JSON.parse(data))
      if (ip !== '' && username !== '' && password !== '') {
        let { username, password, ip } = JSON.parse(data)
        let socket = new JsSIP.WebSocketInterface('wss://' + ip + ':8089/ws')
        let configuration = {
          sockets: [socket],
          uri: 'sip:' + username + '@' + ip,
          password: password,
          realm: ip,
          register: true,
          registrar_server: 'sip:' + ip,
          hack_ip_in_contact: false,
          display_name: '108',
          contact_uri: 'sip:' + username + '@' + ip,
          ws_servers: 'wss://' + ip + ':8089',
          stun_servers: 'stun:stun.l.google.com:19302'
        }
        let ua = new JsSIP.UA(configuration)
        ua.on('registered', (e) => {
          this.setState({ isRegistered: true })
        })
        ua.on('registrationFailed', (e) => {
          alert('Kullanıcı adı ve şifre ile giriş yapılamadı. Tekrar giriş yapın')
          fs.writeFileSync('./auth.json', JSON.stringify({ username: '', password: '', ip: '' }))
          this.setState({ isRegistered: false })
        })
        ua.start()
      } else {
        this.setState({ isRegistered: false })
      }
    })
  }

  setRegistered = (value) => {
    this.setState({ isRegistered: value })
  }

  deleteRegisteredUser = () => {
    fs.writeFileSync('./auth.json', JSON.stringify({ username: '', password: '', ip: '' }))
    this.setState({ isRegistered: false })
  }

  render() {
    if (this.state.isRegistered === true) {
      return (<App deleteRegisteredUser={this.deleteRegisteredUser} setRegistered={this.setRegistered} />)
    } else if (this.state.isRegistered === false) {
      return (<Login setRegistered={this.setRegistered} />)
    } else {
      return (<h1>Yükleniyor</h1>)
    }
  }


}
