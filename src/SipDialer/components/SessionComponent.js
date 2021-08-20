import React, {Component} from "react";

class SessionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            muted: false,
            timer: null,
        }
    }

    componentDidMount = () => {
        const interval = setInterval(() => {
            const a = new Date((Date.now() - (this.props.sessionStart))).toISOString().substr(11, 8)
            this.setState({timer: a})
        }, 1000);
        this.setState({interval: interval});
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    muteSession = async () => {
        if (this.props.session) {
            if (this.props.session.isMuted().audio) {
                await this.props.session.unmute();
                await this.setState({muted: false})
            } else {
                await this.props.session.mute();
                await this.setState({muted: true})
            }
        }
    }

    muteConference = async () => {
        if (this.props.session && this.props.conferenceCalls) {
            if (this.state.muted) {
                console.log("mikrofon açıldı");
                await this.props.mixAudios([this.props.session, this.props.conferenceCalls],false);
                await this.setState({muted: false})
            } else {
                console.log('susturuldu');
                await this.props.mixAudios([this.props.session, this.props.conferenceCalls],true);
                await this.setState({muted: true})
            }
        }
    }

    holdSession = () => {
        if (this.props.session) {
            if (!this.props.session.isOnHold().local) {
                this.props.holdSession(this.props.session);
            }
        }
    }

    render() {
        return (
            <>
                <div className={"text-center mt-2"}>
                    {
                        this.props.conferenceCalls ?
                            <h5 style={{fontWeight: 'bold'}}>{this.props.conferenceCalls.remote_identity.uri.user}</h5> : null
                    }
                    <h5 style={{fontWeight: 'bold'}}>{this.props.session.remote_identity.uri.user}</h5>
                    <p>{this.state.timer}</p>
                </div>
                <div className="row mt-2">
                    <div className="col-4 mb-2">

                        <button onClick={this.props.conferenceCalls ? this.muteConference : this.muteSession}
                                className={this.state.muted ? 'btn rounded btn-outline-info btn-block active' : 'btn rounded btn-outline-info btn-block'}>
                            <i className={"fas fa-microphone-slash"}/><br/>
                            <small>Sessiz</small>
                        </button>
                    </div>
                    <div className="col-4 mb-1">
                        {
                            !this.props.conferenceCalls ?
                                <button onClick={() => this.props.changeNumpadType('')}
                                        className="btn rounded btn-outline-info btn-block">
                                    <i className="fas fa-th"/><br/>
                                    <small>Klavye</small>
                                </button> : null
                        }
                    </div>
                    <div className="col-4 mb-1">
                        {
                            !this.props.conferenceCalls ?
                                <button onClick={this.holdSession}
                                        className={"btn rounded btn-outline-info btn-block "}>
                                    <i className="fas fa-pause-circle"/><br/>
                                    <small>Beklet</small>
                                </button> : null
                        }

                    </div>
                    <div className="col-4 mb-1">
                        {
                            !this.props.conferenceCalls ?
                                <button onClick={() => this.props.changeNumpadType('blindTransfer')}
                                        className="btn rounded btn-outline-info btn-block">
                                    <i className="fas fa-directions"/><br/>
                                    <small>Aktarma</small>
                                </button> : null
                        }

                    </div>
                    <div className="col-4 mb-1">
                        {
                            !this.props.conferenceCalls ?
                                <button onClick={() => this.props.changeNumpadType('addCall')}
                                        className="btn rounded btn-outline-info btn-block">
                                    <i className="fas fa-plus-circle"/><br/>
                                    <small>Arama Ekle</small>
                                </button> : null
                        }

                    </div>
                    <div className="col-4 mb-1">
                        {
                            !this.props.conferenceCalls && this.props.pendingSessionLength === 1 ? <button
                                onClick={this.props.conference}
                                className="btn rounded btn-outline-info btn-block">
                                <i className="fas fa-users"/><br/>
                                <small>Konferans</small>
                            </button> : null
                        }
                    </div>
                    <div className="col-12 mb-1">
                        <button onClick={() => this.props.session.terminate()}
                                className="btn rounded btn-outline-danger btn-block">
                            <i className={"fa fa-phone-slash"}/><br/>
                        </button>
                    </div>
                </div>
            </>
        )
    }
}

export default SessionComponent;
