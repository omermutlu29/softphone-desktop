import React, { Component } from 'react'
import $ from 'jquery'

export default class PendingSession extends Component {
  constructor(props) {
    super(props)
    this.session = this.props.session
    this.state = {
      progressSession: null,
      sessionStart: null,
      timer: null,
      interval: null,
      isButtonOpened: false,
      processing: false
    }
  }

  componentDidMount = () => {
    const interval = setInterval(() => {
      const a = new Date((Date.now() - (this.props.session.start_time))).toISOString().substr(11, 8)
      this.setState({ timer: a })
    }, 1000)
    this.setState({ interval: interval })
  }

  componentWillUnmount = () => {
    clearInterval(this.state.interval)
  }

  unHoldSession = () => {
    if (this.props.session) {
      if (this.props.session.isOnHold().local) {
        this.props.unHoldSession(this.props.session)
      }
    }
  }

  setVisibleButtons = async (event) => {
    console.log(this.state.processing)
    if (await this.state.processing !== true) {
      await this.setState({ processing: true }, async () => {
        console.log(await this.state.processing, 'proccess')

        const className = event.target.className
        if (className == 'p-num' || className == 'p-min' || className == 'paused-call') {
          await this.setState({ isButtonOpened: !this.state.isButtonOpened })
          const ts = await document.getElementById(`${this.props.index}_paused_call`)
          await this.setVisibleButtonProcess(ts)
        }
      })
      await this.setState({ processing: false })
    } else {
      alert('bi bekle amk')
    }
  }

  setVisibleButtonProcess = (ts) => {


    if (this.state.isButtonOpened) {
      $(ts).css({ 'width': '150px', 'right': '35px' })
      $(ts).children('.p-num').css({ 'width': '150px' })
      $(ts).children('.p-close').delay(1).queue(function(next) {
        $(ts).children('.p-close').css({
          'visibility': 'visible',
          'bottom': '54px',
          'right': '133px',
          'opacity': '1'
        })
        next()
      })
      $(ts).children('.p-play').delay(1).queue(function(next) {
        $(ts).children('.p-play').css({ 'visibility': 'visible', 'top': '14px', 'right': '151px', 'opacity': '1' })
        next()
      })
      $(ts).children('.p-link').delay(1).queue(function(next) {
        $(ts).children('.p-link').css({ 'visibility': 'visible', 'top': '54px', 'right': '135px', 'opacity': '1' })
        next()
      })
    } else {
      $(ts).css({ 'width': '70px', 'right': '0px' })
      $(ts).children('.p-num').css({ 'width': '45px' })
      $(ts).children('.p-close').css({ 'bottom': '0px', 'right': '0px', 'opacity': '0' })
      $(ts).children('.p-play').css({ 'top': '0px', 'right': '0px', 'opacity': '0' })
      $(ts).children('.p-link').css({ 'top': '0px', 'right': '0px', 'opacity': '0' })
      setTimeout(function() {
        $(ts).children('.p-close').css({ 'visibility': 'hidden' })
        $(ts).children('.p-play').css({ 'visibility': 'hidden' })
        $(ts).children('.p-link').css({ 'visibility': 'hidden' })
      }, 300)
    }
  }

  terminateSession = () => {
    if (this.state.processing !== true && this.state.isButtonOpened) {
      this.props.session.terminate()
    } else {
      alert('bi bekle amk')
    }
  }

  render() {
    return (
      <>
        {
          this.props.session && this.props.session.isOnHold() ?
            (
              <div id={this.props.index + '_paused_call'} className='paused-call' onClick={this.setVisibleButtons}>
                {
                  this.state.isButtonOpened && this.state.processing !== true ? <>
                    <div className='p-close' onClick={this.terminateSession}>
                      <i className='flaticon-decline'></i>
                    </div>
                    <div className='p-play' onClick={this.unHoldSession}>
                      <i className='flaticon-play-button'></i>
                    </div>
                    {
                      this.props.activeSession && this.props.activeSession.isEstablished() ?
                        <div className='p-link'  onClick={() => this.props.attendedTransfer(this.props.session)}>
                          <i className='flaticon-link'></i>
                        </div>
                        : null
                    }

                  </> : null
                }

                <div className='p-num'>{this.props.session.remote_identity.uri.user}</div>
                <div className='p-min'>{this.state.timer}</div>
              </div>)
            : null
        }
      </>
    )
  }
}