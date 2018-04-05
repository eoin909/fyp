'use strict';

const React = require('react');

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            server: 'http://localhost:4004',
            name: 'jason',
            password: 'password',
            register: false
        };
    }

    handleValueChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    changePage () {
      console.log("click");
    }

    render () {
        return (

                <div className="login-page">

                    <form
                        className="form"
                        onSubmit={ (event) => {
                            event.preventDefault();

                            this.props.submitHandler(this.state);
                        } }
                    >
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
                                    placeholder="Enter Server Url"
                                    className="form-control"
                                    type="text"
                                    name="server"
                                    required={ true }
                                    minlength={ 1 }
                                    value={ this.state.server }
                                    onChange={ this.handleValueChange.bind(this) }
                                />
                            </dd>
                        </dl>

                        <div className="form-actions">
                            <input
                                className="btn btn-primary"
                                type="submit"
                                value="login"
                            />
                        </div>
                        <p class="message">Not registered?
                          <a href="#" onClick={() => {this.props.changePage()}}>
                            Create an account
                          </a>
                        </p>
                    </form>
                </div>
        );
    }
}

Login.propTypes = {
    submitHandler: React.PropTypes.func.isRequired,
    changePage: React.PropTypes.func.isRequired
  //pageDirector: React.PropTypes.func.isRequired
};

module.exports = Login;
