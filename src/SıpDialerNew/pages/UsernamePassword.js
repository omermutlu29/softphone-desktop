import React,{Component} from "react"

export default class UsernamePassword extends Component{
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
    return (<div id="user" className="tabcontent">
        <div>
          <input type="text"  onChange={this.inputChangeHandler} name={'username'}  value={this.state.username}  placeholder="Kullanıcı Adı"/>
        </div>
        <div>
          <input type="text" onChange={this.inputChangeHandler} name={'password'} value={this.state.password} placeholder="Şifre"/>
        </div>
        <div>
          <input type="text" onChange={this.inputChangeHandler} name={'ip'} value={this.state.ip} id='user-ip-address' placeholder="Server"/>
        </div>
        <div className="lgn-submit">
          <input type="Submit" onClick={()=>this.props.loginAsUserNameAndPassword(this.state)} value="Giriş Yap"/>
        </div>
    </div>)
  }
}