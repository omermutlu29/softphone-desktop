import React,{Component} from "react";
import NumpadComponent from "./components/NumpadComponent";

class SIPDialerComponent extends Component{

    constructor(props) {
        super(props);

        this.state = {
            sessions:[],

        }
    }


    render() {
        return(
            <>
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <NumpadComponent/>
                            </div>
                        </div>
                    </div>
            </>
        )
    }
}

export default SIPDialerComponent;
