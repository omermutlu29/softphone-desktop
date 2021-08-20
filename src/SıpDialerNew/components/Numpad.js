import React, { Component } from 'react'

export default class Numpad extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <div className='phone-area' id='phone-area'>
          <input type='text' value={this.props.callTo} readOnly={true} id='phone' className='phone'
                 placeholder='Telefon Numarasını Gir'
                 autoComplete='off' />
        </div>
        <div className='numpad' id='numpad'>
          <div className='num nm0' id='num-1'>
            <div className='num-in' data-id={'1'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'1'}>
                <span className='txt' data-id={'1'}>1</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-2' onClick={this.props.numberButtonPressHandler} data-id={'2'}>
            <div className='num-in' data-id={'2'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'2'}>
                <span className='txt' data-id={'2'}>2</span>
                <span className='small' data-id={'2'}>ABC</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-3'>
            <div className='num-in' data-id={'3'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'3'}>
                <span className='txt' data-id={'3'}>3</span>
                <span className='small' data-id={'3'}>DEF</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-4'>
            <div className='num-in' data-id={'4'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'4'}>
                <span className='txt' data-id={'4'}>4</span>
                <span className='small'>GHI</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-5'>
            <div className='num-in' data-id={'5'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'5'}>
                <span className='txt' data-id={'5'}>5</span>
                <span className='small' data-id={'5'}>JKL</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-6'>
            <div className='num-in' data-id={'6'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'6'}>
                <span className='txt' data-id={'6'}>6</span>
                <span className='small' data-id={'6'}>MNO</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-7'>
            <div className='num-in' data-id={'7'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'7'}>
                <span className='txt' data-id={'7'}>7</span>
                <span className='small' data-id={'7'}>PRSQ</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-8'>
            <div className='num-in' data-id={'8'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'8'}>
                <span className='txt' data-id={'8'}>8</span>
                <span className='small' data-id={'8'}>TUV</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-9'>
            <div className='num-in' data-id={'9'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'9'}>
                <span className='txt' data-id={'9'}>9</span>
                <span className='small' data-id={'9'}>WXYZ</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-s'>
            <div className='num-in' data-id={'*'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'*'}>
                <span className='txt' data-id={'*'}>*</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-0'>
            <div className='num-in' data-id={'0'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'0'}>
                <span className='txt' data-id={'0'}>0</span>
                <span className='small' data-id={'0'}>+</span>
              </div>
            </div>
          </div>
          <div className='num nm0' id='num-d'>
            <div className='num-in' data-id={'#'} onClick={this.props.numberButtonPressHandler}>
              <div className='num-content' data-id={'#'}>
                <span className='txt' data-id={'#'}>#</span>
              </div>
            </div>
          </div>
        </div>
        <div className='call-butons'>

          {
            this.props.activeSession ?
              <div onClick={this.props.setNumpadShow} className='cam' id='vd-open'>
                <i className='flaticon-return'></i>
              </div> : <div className="dot">
                <i className="flaticon-black-circle"></i>
              </div>
          }
          <div className='tel' id='tel-open' onClick={this.props.type === 'blindTransfer' ? this.props.blindTransfer :this.props.call}>
            <i className='flaticon-phone-call'></i>
          </div>
          <div onClick={this.props.deleteCallTo} className='delete del'>
            <i className='flaticon-backspace'></i>
          </div>

        </div>


      </>
    )
  }

}