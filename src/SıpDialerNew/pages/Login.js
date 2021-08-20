import React, { Component } from 'react'
import UsernamePassword from './UsernamePassword'
import AutoProvision from './AutoProvision'
import CryptoJS from 'crypto-js'
import JsSIP from 'jssip'
import Titlebar from '../components/TitleBar/Titlebar'

const app = window.require('electron').remote
const fs = app.require('fs')
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'username',
      registered: false
    }
  }

  loginAsUserNameAndPassword = (data) => {
    let { username, password, ip } = (data)
    console.log(password)
    if (username && password && ip) {
      let result = this.authService(username, password, ip)
      if (result) {
        //
        //Router ile anasayfaya gönder TODO
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
          console.log('registered', e)
          this.setAuthVariables(username, password, ip)
          this.props.setRegistered(true)
        })
        ua.on('registrationFailed', (e) => {
          console.log('bağlanamadı', e)
          alert('Hatalı veri girişi')
        })
        ua.start()
      } else {
        alert('Hatalı server!')
      }
    } else {
      alert('Eksik veri! Sistem yöneticisi ile görüşün')
    }
  }

  loginAsAutoProvision = (provisionCode) => {
    let data = (CryptoJS.AES.decrypt(provisionCode, process.env.REACT_APP_CRYPTO_KEY).toString(CryptoJS.enc.Utf8))
    if (data.length > 0){
      data=(JSON.parse(data));
      this.loginAsUserNameAndPassword(data)
    }else{
      alert('Hatalı provizyon kodu!');
    }

  }

  decodeKey = (key) => {
    return (CryptoJS.AES.decrypt(key, process.env.REACT_APP_CRYPTO_KEY).toString(CryptoJS.enc.Utf8))
  }

  authService = (username, password, ip) => {
    return true
  }

  setAuthVariables = (username, password, ip) => {
    const authVars = JSON.stringify({ username: username, password: password, ip: ip })
    fs.writeFileSync('./auth.json', authVars)
  }


  render() {
    return (<>
      <Titlebar></Titlebar>
      <div className="softphone">
        <div className="container">
          <div className="login">
            <img src="img/jettel-logo.png" width="150px" className="logo"/>
              <div className="login-inner">
                <div className="tab">
                  <div className={this.state.type=="username" ? "tablinks active" : "tablinks"} onClick={() => {this.setState({ type: 'username' })}}>Kullanıcı Bilgileri ile</div>
                  <div className={this.state.type=="username" ? "tablinks " : "tablinks active"} onClick={() => {this.setState({ type: 'autoProvision' })}}>Provizyon Kodu ile</div>
                </div>
                {
                  this.state.type == "username" ?
                    <UsernamePassword loginAsUserNameAndPassword={this.loginAsUserNameAndPassword}/>:
                    <AutoProvision loginAsAutoProvision={this.loginAsAutoProvision} />
                }
              </div>
          </div>
        </div>
      </div>

    </>)
  }
}

