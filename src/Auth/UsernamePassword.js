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
    await this.setState({[event.target.name]:event.target.value});
    console.log(await this.state);
  }

  render() {
    return (<div className='card-body'>
      <fieldset className='form-group position-relative has-icon-left'>
        <input type='text' onChange={this.inputChangeHandler} name={'username'}  value={this.state.username} className='form-control'  id='user-name' placeholder='Kullanıcı Adı' required />
        <div className='form-control-position'>
          <i className='la la-user'></i>
        </div>
      </fieldset>
      <fieldset className='form-group position-relative has-icon-left'>
        <input type='password' onChange={this.inputChangeHandler} name={'password'} value={this.state.password} className='form-control' id='user-password' placeholder='Şifre' required />
        <div className='form-control-position'>
          <i className='la la-key'></i>
        </div>
      </fieldset>
      <fieldset className='form-group position-relative has-icon-left'>
        <input type='text' onChange={this.inputChangeHandler} name={'ip'} value={this.state.ip} id='user-ip-address' className='form-control'  placeholder='IP adresi veya Domain'
               required />
        <div className='form-control-position'>
          <i className='la la-server'></i>
        </div>
      </fieldset>

      <button type='button' onClick={()=>this.props.loginAsUserNameAndPassword(this.state)} className='btn btn-outline-info btn-block'>
        <i className='ft-unlock'></i> Giriş Yap
      </button>
    </div>)
  }
}
