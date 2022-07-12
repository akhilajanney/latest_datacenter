import React, { Component } from 'react'
import axios from 'axios';
import './login_style.css';
import { login_api } from '../urls/api';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            message: true,
            error: false,
            showpwd: false,
        }
    }
    inputHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    login = (event) => {
        event.preventDefault();
        console.log(this.state);
        if (this.state.username && this.state.password) {
            axios({
                method: "POST",
                url: login_api,
                data: { username: this.state.username, password: this.state.password },
            })
                .then((response) => {
                    sessionStorage.setItem("isLogged", "success")
                    this.props.parentCallback("success")
                })
                .catch((error) => {
                    console.log('error=====>', error);
                    if (error.response.status === 403) {
                        this.setState({ error: true, message: 'User session had timed out. Please login again.' });
                    } else {
                        this.setState({ error: true, message: "Request Failed!" });
                    }
                    sessionStorage.setItem("isLogged", "failed")
                    this.props.parentCallback("failed")
                });
        }
        else {
            this.setState({ error: true, message: 'Login Failed' });
        }
    }

    render() {
        const { error, message } = this.state;
        return (
            <div style={{ display: 'flex' }}>
                <div className="backgroundImg"></div>
                <div style={{ background: '#fffefeb8', width: '540px' }}>
                    <div className='loginCard'>
                        <img src="/images/vlogo.png" alt="" className='logo' />
                        <div style={{
                            padding: '10%',
                            marginTop: '-13px'
                        }}>
                            <h1 style={{ textAlign: 'center', fontSize: '25px' }}>LOGIN</h1>
                            <form>
                                {
                                    error && (
                                        <div className='errorMsg'>{message}</div>
                                    )
                                }
                                <div>
                                    <input
                                        type="text" name="username"
                                        placeholder="Username"
                                        required="required"
                                        className='textinput'
                                        onChange={this.inputHandler} />
                                </div>
                                <div>
                                    <input type="password" id="password"
                                        name="password" placeholder="Password"
                                        required="required" autoComplete="off"
                                        className='textinput'
                                        onChange={this.inputHandler} />
                                </div>

                                <div style={{ display: "flex", cursor: "pointer" }}>
                                    <button onClick={this.login} className='loginBtn'><b>Login</b>
                                        <i className="fas fa-arrow-circle-right"
                                            style={{
                                                color: '#003B5E',
                                                cursor: 'pointer',
                                                marginLeft: "4px",
                                            }}>
                                        </i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
