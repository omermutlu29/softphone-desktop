import React, { Component } from 'react'

export default class UsernamePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '108-pbx18',
      password: 'CPqcezx4XSbv',
      ip: 'js16.jettel.com.tr'
    }
  }

  inputChangeHandler = async (event) => {
    await this.setState({ [event.target.name]: event.target.value })
    console.log(await this.state)
  }

  render() {
    return (<div id='provizyon' className='tabcontent'>
      <form action='softphone.html' id='form2'>
        <div>
          <textarea name='lgn-pro' id='lgn-pro' placeholder='Provizyon Kodu'></textarea>
        </div>
        <div className='lgn-submit'>
          <input type='Submit' onClick={() => this.props.loginAsAutoProvision(this.state.provisionCode)} value='Giriş Yap' />
        </div>
      </form>
    </div>)
  }
}