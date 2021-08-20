import React, { Component } from 'react'
const app = window.require('electron').remote
const fs = app.require('fs')
export default class Settings extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <div className='head'><span>Ayarlar</span>
          <div className='menu-back'><i className='flaticon-right-arrow'></i></div>
        </div>
        <ul className='set-menu'>
          <li className={'passive-del'} onClick={()=>{
            this.props.deleteRegisteredUser();
          }}>
						<span className='passive-del'>
							<i className='flaticon-trash delaccount'></i>
							Hesabı Sil
						</span>
          </li>
        </ul>
      </>
    )
  }
}