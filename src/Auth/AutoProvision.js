import React, { Component } from 'react'

const CryptoJS = require('crypto-js')
export default class AutoProvision extends Component {
  constructor(props) {
    super(props)
    this.state = {
      provisionCode: ''
    }
  }

  inputChangeHandler = async (event) => {
    await this.setState({ [event.target.name]: event.target.value })
    console.log(await this.state)
  }

  render() {
    return (<div className='card-body'>

      <fieldset className='form-group position-relative has-icon-left'>
        <textarea name={'provisionCode'} onChange={this.inputChangeHandler} type='password' className='form-control'
                  id='user-password' cols={60} placeholder='Provizyon Kodu' required />
        <div className='form-control-position'>
          <i className='la la-server'></i>
        </div>
      </fieldset>

      <button type='button' onClick={() => this.props.loginAsAutoProvision(this.state.provisionCode)}
              className='btn btn-outline-info btn-block'><i className='ft-unlock'></i> Giriş Yap
      </button>
    </div>)
  }
}