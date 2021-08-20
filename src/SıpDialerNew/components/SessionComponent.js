import React, { Component } from 'react'

export default class SessionComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      muted: false,
      timer: null
    }
  }

  componentDidMount = () => {
    const interval = setInterval(() => {
      const a = new Date((Date.now() - (this.props.sessionStart))).toISOString().substr(11, 8)
      this.setState({ timer: a })
    }, 1000)
    this.setState({ interval: interval })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  muteSession = async () => {
    if (this.props.session) {
      if (this.props.session.isMuted().audio) {
        await this.props.session.unmute()
        await this.setState({ muted: false })
      } else {
        await this.props.session.mute()
        await this.setState({ muted: true })
      }
    }
  }

  muteConference = async () => {
    if (this.props.session && this.props.conferenceCalls) {
      if (this.state.muted) {
        console.log('mikrofon açıldı')
        await this.props.mixAudios([this.props.session, this.props.conferenceCalls], false)
        await this.setState({ muted: false })
      } else {
        console.log('susturuldu')
        await this.props.mixAudios([this.props.session, this.props.conferenceCalls], true)
        await this.setState({ muted: true })
      }
    }
  }

  holdSession = () => {
    if (this.props.session) {
      if (!this.props.session.isOnHold().local) {
        this.props.holdSession(this.props.session)
      }
    }
  }

  render() {
    return (
      <div className='call-scrn' id='call-scrn' style={{ opacity: 1 }}>
        <div className='call-head'>
          {this.props.session.direction === 'incoming' ? 'GELEN ÇAĞRI' : 'GİDEN ÇAĞRI'}

        </div>

        <div className='center' style={{ height: 'calc(100vh - 400px)' }}>
          <div className='number'>{this.props.session.remote_identity.uri.user}</div>
          <div className='min'><span className='aktif'>{this.state.timer}</span></div>
        </div>
        <div className='call-btns'>
          {
            !this.props.conferenceCalls ?
              <div className='pause' onClick={this.holdSession} style={{ opacity: 1, display: 'flex' }}>
                <i className='flaticon-pause'></i>
                <span className='call-btn-txt'>Aramayı Beklet</span>
              </div> : null
          }
          {
            !this.props.conferenceCalls ?
              <div className='add' onClick={() => this.props.changeNumpadType('addCall')}
                   style={{ opacity: 1, display: 'flex' }}>
                <i className='flaticon-plus'></i>
                <span className='call-btn-txt'>Arama Ekle</span>
              </div> : null
          }
          {
            !this.props.conferenceCalls ?
              <div className='transfer' onClick={() => this.props.changeNumpadType('blindTransfer')}
                   style={{ opacity: 1, display: 'flex' }}>
                <i className='flaticon-right-arrow'></i>
                <span className='call-btn-txt'>Aramayı Aktar</span>
              </div> : null
          }

          <div className='mute' onClick={this.props.conferenceCalls ? this.muteConference : this.muteSession} id='mute'
               style={{ opacity: 1, display: 'flex' }}>

            <i className={!this.state.muted ? 'flaticon-mute' : 'flaticon-messenger'}></i>
            <span className='call-btn-txt'>Sessiz</span>
          </div>
          {
            !this.props.conferenceCalls ?
              <div className='callnum' onClick={() => this.props.changeNumpadType('')} id='callnum' style={{ opacity: 1, display: 'flex' }}>
                <i className='flaticon-dial-1'></i>
                <span className='call-btn-txt'>Tuş Takımı</span>
              </div> : null
          }
          {
            !this.props.conferenceCalls && this.props.pendingSessionLength === 1 ?
              <div className='conferance' onClick={this.props.conference} id='conferance'
                   style={{ opacity: 1, display: 'flex' }}>
                <i className='flaticon-user'></i>
                <span className='call-btn-txt'>Konferans</span>
              </div>
              : <div className='conferance'  id='conferance'
                     style={{ opacity: 0.5, display: 'flex' }}>
                <i className='flaticon-user'></i>
                <span className='call-btn-txt'>Konferans</span>
              </div>
          }
        </div>
        <div className='call-btns'>
          <div className='tel' onClick={() => this.props.session.terminate()} id='tel-close'>
            <i className='flaticon-decline'></i>
          </div>
        </div>

      </div>
    )
  }

}