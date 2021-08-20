import React, {Component} from "react";

class NumpadComponent extends Component {

    render() {
        return (
            <>
                <div className="form-group">
                    <div className="row">
                        <div className="col-8">
                            <input type="text" value={this.props.callTo} readOnly={true} className={"form-control"}/>
                        </div>
                        <div className="col-4">
                            <button onClick={this.props.deleteCallTo} className="btn rounded btn-danger btn-block">
                                <i className={"fas fa-backspace"}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"1"}
                                className="btn rounded btn-outline-info btn-block">
                            1
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"2"}
                                className="btn rounded btn-outline-info btn-block">
                            2
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"3"}
                                className="btn rounded btn-outline-info btn-block">
                            3
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"4"}
                                className="btn rounded btn-outline-info btn-block">
                            4
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"5"}
                                className="btn rounded btn-outline-info btn-block">
                            5
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"6"}
                                className="btn rounded btn-outline-info btn-block">
                            6
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"7"}
                                className="btn rounded btn-outline-info btn-block">
                            7
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"8"}
                                className="btn rounded btn-outline-info btn-block">
                            8
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"9"}
                                className="btn rounded btn-outline-info btn-block">
                            9
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"*"}
                                className="btn rounded btn-outline-info btn-block">
                            *
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"0"}
                                className="btn rounded btn-outline-info btn-block">
                            0
                        </button>
                    </div>
                    <div className="col-4 mb-3">
                        <button onClick={this.props.numberButtonPressHandler} value={"#"}
                                className="btn rounded btn-outline-info btn-block">
                            #
                        </button>
                    </div>
                    <div className="col-8 mb-3">
                        {
                            this.props.type === 'blindTransfer' ?
                                <button onClick={this.props.blindTransfer}
                                        className="btn rounded btn-outline-success btn-block">Kör
                                    Aktar
                                    <i className={"fa fa-phone"}/>
                                </button>
                                : null
                        }
                        {
                            this.props.type === 'addCall' ?
                                <button onClick={this.props.call}
                                        className="btn rounded btn-outline-success btn-block">
                                    <i className={"fa fa-phone"}/>Arama Ekle

                                </button>
                                : null
                        }
                        {
                            this.props.type === '' && !this.props.activeSession ?
                                <button onClick={this.props.call}
                                        className="btn rounded btn-outline-success btn-block">
                                    <i className={"fa fa-phone"}/>Arama Ekle

                                </button>
                                : null
                        }
                        {
                            this.props.type === 'conference' ?
                                <button onClick={this.props.conference}
                                        className="btn rounded btn-outline-success btn-block">
                                    <i className={"fa fa-phone"}/>Konfernasa Kat
                                </button>
                                : null
                        }
                    </div>
                    <div className="col-4 mb-3" style={{}}>
                        {
                            this.props.activeSession ? <button onClick={this.props.setNumpadShow}
                                                               className="btn rounded btn-outline-warning btn-block">
                                Gizle
                            </button> : null
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default NumpadComponent;
