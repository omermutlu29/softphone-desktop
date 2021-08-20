import React, {Component} from "react";

export default class PendingSession extends Component {

    constructor(props) {
        super(props);
        this.session = this.props.session;
        this.state = {
            progressSession: null,
            sessionStart: null,
            timer: null,
            interval: null,
        }
    }

    componentDidMount = () => {
        const interval = setInterval(() => {
            const a = new Date((Date.now() - (this.props.session.start_time))).toISOString().substr(11, 8)
            this.setState({timer: a})
        }, 1000);
        this.setState({interval: interval});
    }

    componentWillUnmount = () => {
        clearInterval(this.state.interval);
    }

    unHoldSession = () => {
        if (this.props.session) {
            if (this.props.session.isOnHold().local) {
                this.props.unHoldSession(this.props.session);
            }
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.session && this.props.session.isOnHold() ?
                        (
                            <div style={{
                                borderRadius: 5,
                                border: '1px solid #000',
                                padding: 5,
                                marginTop: 5,
                                marginBottom: 5
                            }}>
                                <div className="row">
                                    <div className="col-6">
                                        <i className={"fa fa-phone p-2"} style={{
                                            backgroundColor: '#dc3545',
                                            borderRadius: 25,
                                            marginRight: 5,
                                            marginTop: 2,
                                            color: '#fff'
                                        }}/>
                                        <small><b>{this.props.session.remote_identity.uri.user}</b></small><br/>
                                        <small>{this.state.timer}</small>
                                    </div>
                                    <div className={"col-6"}>
                                        <div className={"float-right"}>
                                            <button className={"btn round btn-outline-success mr-2"}
                                                    onClick={this.unHoldSession} title={"Devam Et"}><i
                                                className={"fa fa-play"}/></button>
                                            <button className={"btn round btn-outline-danger mr-2"}
                                                    onClick={() => this.props.session.terminate()}
                                                    title={"Sonlandır"}><i className={"fa fa-phone-slash"}/></button>
                                            {
                                                this.props.activeSession && this.props.activeSession.isEstablished() ?
                                                    <button
                                                        onClick={() => this.props.attendedTransfer(this.props.session)}
                                                        className={"btn round btn-outline-primary"}
                                                        title={"Görüşmeye Aktar"}><i className={"fa fa-link"}/>
                                                    </button> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        : null
                }
            </div>
        );
    }
}
