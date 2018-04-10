'use strict';

const React = require('react');

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            server: 'http://localhost:4004',
            name: '',
            email:'',
            password: ''
        };
    }

    handleValueChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getText (){

      if(this.props.logInRegister === true){
        return (
          <p class="message">Username Not available</p>
        )
      } else {
        return null;
      }
    }
    render () {
        return (

                <div className="login-page">
                {this.props.failReason ? (<span className="login-error centered">Username Already Exists</span>):(null)}

                    <form
                        className="form"
                        onSubmit={ (event) => {
                            event.preventDefault();
                            this.props.registerUser(this.state);
                        } }
                    >
                    {this.getText()}
                        <dl className="form-group">
                            <dd>
                                <input
                                    placeholder="Enter Username"
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    required={ true }
                                    minlength={ 1 }
                                    value={ this.state.name }
                                    onChange={ this.handleValueChange.bind(this) }
                                />
                            </dd>
                        </dl>

                        <dl className="form-group">
                            <dd>
                                <input
                                     placeholder="Enter Password"
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    required={ true }
                                    minlength={ 0 }
                                    value={ this.state.password }
                                    onChange={ this.handleValueChange.bind(this) }
                                />
                            </dd>
                        </dl>
                        <dl className="form-group">
                            <dd>
                                <input
                                    placeholder="Enter Email Address"
                                    className="form-control"
                                    type="text"
                                    name="email"
                                    required={ true }
                                    minlength={ 1 }
                                    value={ this.state.email }
                                    onChange={ this.handleValueChange.bind(this) }
                                />
                            </dd>
                        </dl>

                        <div className="form-actions">
                            <input
                                className="btn btn-primary"
                                type="submit"
                                value="Register"
                            />
                        </div>
                        <p class="message">Already registered?
                          <a href="#" onClick={() => {this.props.changePage()}}>
                            Sign In
                            </a>
                        </p>
                    </form>

                </div>
        );
    }
}

Login.propTypes = {
    registerUser: React.PropTypes.func.isRequired,
    changePage: React.PropTypes.func.isRequired,
    failReason: React.PropTypes.string
};

module.exports = Login;
