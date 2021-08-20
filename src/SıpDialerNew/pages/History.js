import React, { Component } from 'react'
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}
export default class History extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div className='kisiler'>
        <div className='head'>Arama Geçmişi</div>
        {
          this.props.records.map(record => {
            return (
              <div className='kisi'>
                <div className='profil'></div>
                <div className='bilgi'>
                  <span className='ad'>{record.direction =="incoming" ? record.from : record.to}</span>
                  <span className='cagri'>
                    {
                      record.end_time ? <>{record.direction == 'incoming' ?
                        <i className='flaticon-diagonal-arrow gelen'></i> : null}
                          {record.direction == 'outgoing' ?
                            <i className='flaticon-diagonal-arrow-1 giden'></i> : null}</> :
                        <i className='flaticon-cross-sign cevapsiz'></i>
                    }

                    <span className='tarih'>{record.start_time ? record.start_time : ''} {record.diff?.toString().toHHMMSS() ? record.diff?.toString().toHHMMSS() :''}</span>
							</span>
                </div>
                <div className='arama'>
                  <i className='flaticon-phone-call ara'></i>
                </div>
              </div>
            )

          })
        }


      </div>
    )
  }
}