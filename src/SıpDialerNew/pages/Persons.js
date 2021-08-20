import React,{Component} from "react"


export default class Persons extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='kisiler'>
        <div className='head'>Kişiler</div>


        <div className='kisi'>
          <div className='profil'></div>
          <div className='bilgi'>
            <span className='ad'>Bilgi Can Seven</span>
            <span className='tel'>05322321912</span>
          </div>
          <div className='arama'>
            <i className='flaticon-phone-call'></i>
            <i className='flaticon-video-camera'></i>
          </div>
        </div>
        <div className='kisi'>
          <div className='profil'></div>
          <div className='bilgi'>
            <span className='ad'>Bilgi Can Seven</span>
            <span className='tel'>05322321912</span>
          </div>
          <div className='arama'>
            <i className='flaticon-phone-call'></i>
            <i className='flaticon-video-camera'></i>
          </div>
        </div>
      </div>
    )
  }
}