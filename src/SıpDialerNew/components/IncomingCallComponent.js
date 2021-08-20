import React, { Component } from 'react'

export default class IncomingCallComponent extends Component {

  render() {
    return (
      <>
        <div className='call-scrn' id='call-scrn' >
          <div className='call-head'>
            GELEN ÇAĞRI
          </div>
          <div className='center' >
            <div className='number'>{this.props.session?.remote_identity?.uri?.user}</div>

          </div>

          <div className='call-btns'>
            <div className='tel' id='tel-close' onClick={() => this.props.terminateSession(this.props.session)}>
              <i className='flaticon-decline'></i>
            </div>
            <div className='tel accept' id='tel-open' onClick={() => this.props.answerCall()}>
              <i className='flaticon-phone-call'></i>
            </div>
          </div>
          <div className='paused' style={{ height: 0 }}>

          </div>
        </div>

      </>
    )
  }
}

