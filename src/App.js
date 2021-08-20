import React, { Component } from 'react'
import './App.css'
import JsSIP from 'jssip'
import 'bootstrap/dist/css/bootstrap.min.css'
import Session from './SipDialer/components/PendingSession'
import NumpadComponent from './SipDialer/components/NumpadComponent'
import IncomingCallComponent from './SipDialer/components/IncomingCallComponent'
import SessionComponent from './SipDialer/components/SessionComponent'
import OutgoingCallComponent from './SipDialer/components/OutgoingCallComponent'

const app = window.require('electron').remote
const fs = app.require('fs')

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pendingSessions: [],
      conferenceCalls: null,
      activeSession: null,
      ua: null,
      options: {
        mediaConstraints: { audio: true, video: false },
        pcConfig: {
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302'
              ]
            }
          ]
        }
      },
      callOptions: {
        mediaConstraints: {
          audio: true, // only audio calls
          video: false
        }
      },
      callTo: '',
      incomingCall: false,
      outgoingCall: false,
      connectionEstablished: false,
      isMuted: false,
      isHold: false,
      numpadShow: false,
      activeNumpad: '',
      activeSessionStart: null,
      isRegistered: false
    }

  }

  createUserAgent(username, password, ip) {
    var socket = new JsSIP.WebSocketInterface('wss://' + ip + ':8089/ws')
    var configuration = {
      sockets: [socket],
      uri: 'sip:' + username + '@' + ip,
      password: password,
      realm: ip,
      register: true,
      registrar_server: 'sip:' + ip,
      hack_ip_in_contact: false,
      display_name: 'omer',
      contact_uri: 'sip:' + username + '@' + ip,
      ws_servers: 'wss://' + ip + ':8089',
      stun_servers: 'stun:stun.l.google.com:19302',
      register_expires: 4
    }
    return new JsSIP.UA(configuration)
  }

  async componentDidMount() {
    fs.readFile('./auth.json', 'utf8', async (err, data) => {
      let { username, password, ip } = JSON.parse(data)
      const ua = await this.createUserAgent(username, password, ip)
      await this.setState({ ua: ua })
      await this.listenEvents()
      await this.state.ua.start()
    })
  }


  listenEvents = async () => {
    if (this.state.ua) {
      this.state.ua.on('connecting', (e) => {
        console.log(this.state.ua.isRegistered())

      })
      this.state.ua.on('registrationFailed', (e) => {
        this.setState({ isRegistered: false })

      })
      this.state.ua.on('registered', (e) => {
        console.log(this.state.ua.isRegistered())
        this.setState({ isRegistered: true })


      })
      this.state.ua.on('connected', (e) => {
        console.log('connect', e)
      })
      this.state.ua.on('unregistered', (e) => {
        this.setState({ isRegistered: false })
      })
      this.state.ua.on('disconnected', (e) => {
        console.log('disconnected', e)
      })
      this.state.ua.on('registrationExpiring', (e) => {
        console.log('registrationExpiring', e)
        console.log(this.state.ua.isRegistered())
        this.state.ua.register()
      })
      this.state.ua.on('registrationFailed', (e) => {
        this.props.setRegistered(false)
      })
      this.state.ua.on('newRTCSession', async (data) => {
        if (this.state.activeSession && this.state.activeSession.id) {
          let temp = []
          temp = await this.state.pendingSessions.filter(item => item !== null && item.id !== null && item.id !== this.state.activeSession.id)
          if (temp.length > 0) {
            await this.setState({
              pendingSessions: temp, activeSession: data.session
            })
          }
        } else {
          this.setState({
            activeSession: data.session
          })
        }

        if (data.session.direction === 'incoming') {
          this.ringPlay()
          data.session.on('icecandidate', (event) => {
            event.ready()
          })
          data.session.on('accepted', (e) => {
            this.setState({ activeSessionStart: Date.parse(data.session.start_time) })
            this.ringStop()
          })
          data.session.on('confirmed', (e) => {
            this.ringStop()
          })
          data.session.on('ended', async (e) => {
            if (data.session) {
              await this.sessionEnd(data.session)
            }
            this.ringStop()
          })
          data.session.on('failed', async (e) => {
            await this.sessionFail(e, data.session)
            this.ringStop()
          })
          data.session.on('peerconnection', (e) => {
            e.peerconnection.onaddstream = async (event) => {
              await this.removeUselessAudios(data.session.id)
              const a = event.stream
              await this.setAudioAndPlay(data.session.id, a)
            }
          })
        }
        if (data.session.direction === 'outgoing') {

          data.session.connection.addEventListener('track', (e) => {
            this.setState({ connectionEstablished: true })
            this.setAudioAndPlay(data.session.id, e.streams[0])
          })
          data.session.on('accepted', (e) => { // Your code here});
            this.setState({ activeSessionStart: Date.parse(data.session.start_time) })
            this.setState({ connectionEstablished: true, outgoingCall: false })
          })
          data.session.on('progress', (e) => { // Your code here});
            console.log('progress', e)
          })
          data.session.on('failed', async (e) => { // Your code here});
            if (data.session) {
              await this.sessionFail(e, data.session)
            }
          })
          data.session.on('started', (e) => { // Your code here});
            console.log('started', e)
          })
          data.session.on('ended', async (e) => { // Your code here});
            console.log(e)
            await this.sessionEnd(data.session)
          })
        }
      })

    }
  }

  removeUselessAudios(session_id) {
    while (document.getElementById('undefined')) {
      document.getElementById('undefined').remove()
    }
    if (session_id) {
      while (document.getElementById(session_id)) {
        document.getElementById(session_id).remove()
      }
    }
  }

  setEmptyConferenceCalls = async () => {
    if (this.state.conferenceCalls !== null) {
      if (this.state.conferenceCalls.isEstablished()) {
        this.removeUselessAudios(this.state.conferenceCalls.id)
        this.state.conferenceCalls.terminate()
      }
    }
    if (this.state.activeSession && this.state.activeSession.isEstablished()) {
      this.removeUselessAudios(this.state.activeSession.id)
      this.state.activeSession.terminate()
    }
  }

  setNumpadShow = () => {
    this.setState({ numpadShow: !this.state.numpadShow })
  }

  setAudioAndPlay = async (session_id, stream) => {
    let audio = await document.createElement('AUDIO')
    audio.id = session_id
    audio.controls = false
    audio.src = stream
    audio.autoplay = true
    const audios = await document.getElementById('audios')
    await audios.appendChild(audio)
    const element = await document.getElementById(session_id)
    element.srcObject = stream
    element.play()
  }

  sessionEnd = async (session) => {
    if (session && session.id) {
      //Session nerede onu bulacağız
      if (this.state.conferenceCalls && this.state.conferenceCalls.id === session.id) {
        await this.removeUselessAudios(session.id)
        await this.setState({ conferenceCalls: null })
      }
      if (this.state.activeSession && this.state.activeSession.id === session.id) {
        await this.removeUselessAudios(session.id)
        if (await this.state.conferenceCalls) {
          await this.setState({ activeSession: this.state.conferenceCalls, conferenceCalls: null }, () => {
            console.log(this.state.activeSession, this.state.activeSession.isEstablished())
          })
        } else {
          await this.setState({
            activeSession: null,
            callTo: '',
            connectionEstablished: false,
            outgoingCall: false,
            conferenceCalls: null,
            activeSessionStart: null
          })
        }
      } else {
        //biten sessionları buluyoruz
        const endedPendingSessions = await this.state.pendingSessions.filter(item => item && item.id && item.id === session.id)
        await endedPendingSessions.map(async (sessionItem) => {
          await this.removeUselessAudios(sessionItem.id)
        })
        //Kalanları bulup bekleyenlere set ediyoruz
        const continuousPendingSessions = await this.state.pendingSessions.filter(item => item && item.id && item.id !== session.id)
        await this.setState({ pendingSessions: continuousPendingSessions })
      }
    } else {
      alert('session ID yok')
    }
  }

  sessionFail = async (message, session) => {
    alert(message.cause)
    await this.sessionEnd(session)
  }

  changeNumpadType = async (type) => {
    this.setState({ activeNumpad: type, numpadShow: true })
  }

  blindTransfer = async () => {
    if (this.state.callTo !== '') {
      this.state.activeSession.refer(this.state.callTo)
    } else {
      alert('Dahili veya numara girin!')
    }
  }

  conference = async () => {
    if (this.state.pendingSessions.length === 1) {
      await this.state.pendingSessions[0].unhold()
      const temp = await this.state.pendingSessions[0]
      temp.connection.addEventListener('track', (e) => {
        this.mixAudios([this.state.activeSession, temp])
        this.setState({ conferenceCalls: temp, pendingSessions: [] })
      })
    } else {
      alert('Konferansa alınacak bekleyen arayan bulunmamaktadır!')
    }
  }

  mixAudios = async (sessions, isMuted = false) => {
    if (document.getElementById(sessions[0].id)) {
      document.getElementById(sessions[0].id).remove()
    }
    var receivedTracks = []
    await sessions.forEach(function(session) {
      if (session !== null && session !== undefined) {
        session.connection.getReceivers().forEach(function(receiver) {
          receivedTracks.push(receiver.track)
        })
      }
    })

    //use the Web Audio API to mix the received tracks
    let context = new AudioContext()
    let allReceivedMediaStreams = new MediaStream()

    await sessions.forEach(function(session) {

      if (session !== null && session !== undefined) {
        let mixedOutput = context.createMediaStreamDestination()

        session.connection.getReceivers().forEach(function(receiver) {

          receivedTracks.forEach(function(track) {
            allReceivedMediaStreams.addTrack(receiver.track)
            if (receiver.track.id !== track.id) {
              let sourceStream = context.createMediaStreamSource(new MediaStream([track]))
              sourceStream.connect(mixedOutput)
            }
          })
        })
        //mixing your voice with all the received audio
        if (!isMuted) {
          navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
              session.connection.getSenders().forEach(function(sender) {
                let source = context.createMediaStreamSource(stream)
                //let source = context.createMediaStreamSource(new MediaStream([sender.track]));
                source.connect(mixedOutput)
              })
            })

        }
        session.connection.getSenders()[0].replaceTrack(mixedOutput.stream.getTracks()[0])
      }
    })
    await this.setAudioAndPlay(sessions[0].id, allReceivedMediaStreams)
  }

  render() {
    return (
      <div className='modal-dialog' style={{ width: 330,margin:0,border:'none' }} role='document'>
        <div className='modal-content' style={{ border: 0 }}>
          <div className='modal-body'>
            <button onClick={() => {
              if (this.state.isRegistered) {
                this.state.ua.unregister()
              } else {
                this.state.ua.register()
              }
            }}>{this.state.isRegistered ? 'Pasif Et' : 'Aktif Et'}</button>
            <button onClick={() => this.props.deleteRegisteredUser()}>Hesabı Sil</button>
            {
              this.state.activeSession && this.state.activeSession.isEstablished() ?
                this.state.numpadShow ?
                  <NumpadComponent
                    blindTransfer={this.blindTransfer}
                    setNumpadShow={this.setNumpadShow}
                    numberButtonPressHandler={this.numberButtonPressHandler}
                    call={this.call}
                    session={this.state.activeSession}
                    deleteCallTo={this.deleteCallTo} callTo={this.state.callTo}
                    activeSession={this.state.activeSession}
                    type={this.state.activeNumpad}
                    conference={this.conference}
                  /> :
                  <SessionComponent
                    conferenceCalls={this.state.conferenceCalls}
                    callTo={this.state.callTo}
                    sessionStart={this.state.activeSessionStart}
                    holdSession={this.holdSession}
                    mixAudios={this.mixAudios}
                    changeNumpadType={this.changeNumpadType}
                    pendingSessionLength={this.state.pendingSessions.length}
                    conference={this.conference}
                    session={this.state.activeSession}
                    setNumpadShow={this.setNumpadShow} /> :
                this.state.incomingCall ? <IncomingCallComponent session={this.state.activeSession}
                                                                 answerCall={this.answerCall}
                                                                 terminateSession={this.terminateSession} /> :
                  null
            }
            {
              this.state.outgoingCall ? <OutgoingCallComponent session={this.state.activeSession}
                                                               terminateSession={this.terminateSession} /> : null
            }
            {
              !this.state.activeSession && !this.state.incomingCall && !this.state.outgoingCall ?
                <NumpadComponent
                  numberButtonPressHandler={this.numberButtonPressHandler}
                  call={this.call}
                  deleteCallTo={this.deleteCallTo} callTo={this.state.callTo}
                  activeSession={this.state.activeSession}
                  type={this.state.activeNumpad}
                /> : null
            }


            <div className='row'>
              <div className='col-md-12'>
                {
                  this.state.pendingSessions.length !== 0 ?
                    <>
                      {
                        this.state.pendingSessions.map((session, index) => (
                          <Session ringStop={this.ringStop}
                                   session={session}
                                   sessionEnd={this.sessionEnd}
                                   sessionFail={this.sessionFail}
                                   activeSession={this.state.activeSession}
                                   attendedTransfer={this.attendedTransfer}
                                   unHoldSession={this.unHoldSession}
                                   key={index} />)
                        )
                      }
                    </> : null
                }

              </div>
            </div>
          </div>


          <div id='audios'>

          </div>
          <audio src={'/sounds/ring.mp3'} id={'ring'} loop={true} autoPlay={false} />

        </div>
      </div>
    )
  }

  attendedTransfer = (session) => {
    this.state.activeSession.refer(session.remote_identity.uri, {
      replaces: session
    })
  }

  numberButtonPressHandler = (event) => {
    if (this.state.activeSession && this.state.activeNumpad === '') {
      var tones = event.target.value
      var options = {
        'duration': 160,
        'interToneGap': 1200,
        'extraHeaders': []
      }
      this.state.activeSession.sendDTMF(tones, options)
    }
    this.setState({ callTo: this.state.callTo + event.target.value })
  }

  answerCall = () => {
    if (this.state.activeSession) {
      this.state.activeSession.answer(this.state.options)
    }
  }

  terminateSession = async (session) => {
    await session.terminate()
  }

  call = async () => {

    if (this.state.callTo !== '') {
      if (this.state.activeSession) {
        await this.holdSession()//Aktif session ı hold eder;
      }
      await this.state.ua.call(this.state.callTo, this.state.callOptions)
      await this.setState({
        outgoingCall: true,
        activeNumpad: '',
        numpadShow: false,
        callTo: ''
      })
    } else {
      alert('Dahili veya numara girin')
    }
  }

  muteConference = async () => {
    if (this.state.activeSession && this.state.conferenceCalls) {
      this.state.activeSession.mute()
      this.state.conferenceCalls.mute()
    }
  }

  muteSession = () => {
    this.state.activeSession.mute()
  }

  unMuteSession = () => {
    this.state.activeSession.unmute()
  }

  holdSession = async () => {
    if (this.state.activeSession) {
      await this.state.activeSession.hold()
      await this.removeUselessAudios(this.state.activeSession.id)
      //await this.removeSessionListenerFromMain(this.state.activeSession);
      await this.state.pendingSessions.push(this.state.activeSession)
      await this.setState({ activeSession: null })
    }
  }

  unHoldSession = async (session) => {
    if (this.state.activeSession) {
      await this.holdSession()
    }
    await session.unhold()
    let temp = []
    temp = await this.state.pendingSessions.filter(item => item !== null)
    temp = await temp.filter(item => item.id !== session.id)
    await this.setState({ pendingSessions: temp })
    await this.setState({
      pendingSessions: this.state.pendingSessions.filter(item => item.id !== session.id),
      activeSession: session,
      numpadShow: false,
      callTo: ''

    })
  }

  ringPlay = () => {
    this.setState({ incomingCall: true })
    const ring = document.getElementById('ring')
    ring.play()
  }

  ringStop = () => {
    this.setState({ incomingCall: false })
    const ring = document.getElementById('ring')
    ring.pause()
    ring.currentTime = 0
  }

  deleteCallTo = () => {
    this.setState({ callTo: this.state.callTo.substring(0, this.state.callTo.length - 1) })
  }
}

export default App
