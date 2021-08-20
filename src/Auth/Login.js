import React, { Component } from 'react'
import UsernamePassword from './UsernamePassword'
import AutoProvision from './AutoProvision'
import CryptoJS from 'crypto-js'
import JsSIP from 'jssip'

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
    return (<div className='content-body' style={{width:'100%'}}>
      <section className='row flexbox-container'>
        <div className='col-12 d-flex align-items-center justify-content-center'>
          <div className='col-lg-4 col-md-8 col-10 box-shadow-2 p-0'>
            <div className='card ' style={{border:0}}>
              <div className='card-header border-0'>
                <div className='card-title text-center'>
                  <img style={{width:'50%'}} src={'/admin-assets/app-assets/logo.png'} alt='branding logo' />
                </div>
              </div>
              <div className='card-content' style={{border:0}}>
                <div className='row mr-1 ml-1'>
                  <div className='col-6'>
                    <a onClick={() => {
                      this.setState({ type: 'username' })
                    }} className='btn mr-1 mb-1 btn-primary btn-block'><i className='la la-user'></i><span>Oturum</span></a>
                  </div>
                  <div className='col-6'>
                    <a onClick={() => {this.setState({ type: 'autoProvision' })}} className='btn mr-1 mb-1 btn-success btn-block'><i className='la la-key'></i>Anahtar</a>
                  </div>
                </div>
                {
                  this.state.type === 'username' ?
                    <UsernamePassword loginAsUserNameAndPassword={this.loginAsUserNameAndPassword} /> :
                    <AutoProvision loginAsAutoProvision={this.loginAsAutoProvision} />
                }

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>)
  }
}
