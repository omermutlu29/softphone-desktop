import React,{Component} from "react"


export default class BottomBar extends Component{

  changeFunc(){

  }

  render() {

    return (
      <div className="menu" id="menu" style={{ height:95 }}>
        <div className={this.props.activePage == 'pers' ? 'active pers': 'pers'} id="pers" onClick={()=>this.props.bottomChangeHandler(0)}><i className="flaticon-user-1"></i></div>
        <div className={this.props.activePage == 'history' ? 'active history': 'history'} id="history" onClick={()=>this.props.bottomChangeHandler(1)}><i className="flaticon-clock"></i></div>
        <div className={this.props.activePage == 'key' ? 'active key': 'key'} id="key" onClick={()=>this.props.bottomChangeHandler(2)}><i className="flaticon-dial"></i></div>
        <div className={this.props.activePage == 'set' ? 'active set': 'set'} id="set" onClick={()=>this.props.bottomChangeHandler(3)}><i className="flaticon-settings"></i></div>
      </div>
    );
  }
}