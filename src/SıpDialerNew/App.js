import React, { Component } from 'react'
import BottomBar from './components/BottomBar'
import Numpad from './components/Numpad'
import MainPage from './pages/MainPage'
import Titlebar from './components/TitleBar/Titlebar'
import Persons from './pages/Persons'
import History from './pages/History'
import Settings from './pages/Settings'
import { get } from '../helpers/CDR'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      screenPositions: [
        '-200%', '-100%', '0%', '100%'
      ],
      activePage: 'key',
      records: []
    }
  }

  componentDidMount() {
    this.updateRecords()
  }

  updateRecords = () => {
    get().then(async (res) => {
      let data=(await JSON.parse(res));
      console.log("tetiklenmiş",data);
      await this.setState({ records: data }, () => {})
    }).catch(err => {
      console.log('Veriler okunamadı', err)
    })
  }


  bottomChangeHandler = (index) => {
    switch (index) {
      case 0:
        this.setState({ screenPositions: ['0%', '100%', '200%', '300%'], activePage: 'pers' })
        break
      case 1:

        this.setState({ screenPositions: ['-100%', '0%', '100%', '200%'], activePage: 'history' })
        break

      case 2:

        this.setState({ screenPositions: ['-200%', '-100%', '0%', '100%'], activePage: 'key' })
        break

      case 3:

        this.setState({ screenPositions: ['-300%', '-200%', '-100%', '0%'], activePage: 'set' })
        break

    }
  }

  render() {

    return (
      <><Titlebar></Titlebar>
        <div className='softphone'>
          <div className='container' style={{ padding: 0 }}>
            <div className='pages' id='pages' style={{ top: '0%' }}>
              <div className='call-pers' id='call-pers' style={{ left: this.state.screenPositions[0] }}>
                <Persons />
              </div>
              <div className='call-hist' id='call-hist' style={{ left: this.state.screenPositions[1] }}>
                <History records={this.state.records} />
              </div>
              <div className='call-num' id='call-num' style={{ left: this.state.screenPositions[2], marginTop: 150 }}>
                <MainPage updateRecords={this.updateRecords} />
              </div>
              <div className='call-set' id='call-set' style={{ left: this.state.screenPositions[3] }}>
                <Settings deleteRegisteredUser={this.props.deleteRegisteredUser} />
              </div>

            </div>
            <BottomBar activePage={this.state.activePage} bottomChangeHandler={this.bottomChangeHandler} />
          </div>
        </div>
      </>
    )
  }
}