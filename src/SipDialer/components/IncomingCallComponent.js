import React,{Component} from "react";

class IncomingCallComponent extends Component{

    render() {
        return(
            <>
                <div className={"text-center mt-2"}>
                    <h5 style={{fontWeight:'bold'}}>{this.props.session?.remote_identity?.uri?.user}</h5>
                    <p>Gelen Çağrı</p>
                </div>
                <div className="row mt-4">

                    <div className="col-6 mb-1">
                        <button onClick={this.props.answerCall} className="btn rounded btn-outline-success btn-block">
                            <i className={"fa fa-phone"}/><br/>
                        </button>
                    </div>

                    <div className="col-6 mb-1">
                        <button onClick={()=>this.props.session.terminate()} className="btn rounded btn-outline-danger btn-block">
                            <i className={"fa fa-phone-slash"}/><br/>
                        </button>
                    </div>
                </div>
            </>
        )
    }
}
export default IncomingCallComponent;
