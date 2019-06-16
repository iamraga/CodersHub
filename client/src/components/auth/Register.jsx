import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions.jsx';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
        };

        this.props.registerUser(newUser, this.props.history);
    }

    render() {
        const { errors } = this.state; //Equivalent to const errors = this.state.errors
        return (
            <div className="register">
                <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Sign Up</h1>
                    <p className="lead text-center">Create your DevConnector account</p>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input type="text" className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.name
                                })} placeholder="Name" value={this.state.name} onChange={this.onChange} name="name" />
                            {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                        </div>
                        <div className="form-group">
                            <input type="email" className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.email
                                })} placeholder="Email Address" value={this.state.email} onChange={this.onChange} name="email" />
                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                        </div>
                        <div className="form-group">
                            <input type="password" className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.password
                                })} placeholder="Password" value={this.state.password} onChange={this.onChange} name="password" />
                                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                        </div>
                        <div className="form-group">
                            <input type="password" className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.confirmPassword
                                })} placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.onChange} name="confirmPassword" />
                                {errors.confirmPassword && (<div className="invalid-feedback">{errors.confirmPassword}</div>)}
                        </div>
                        <input type="submit" className="btn btn-info btn-block mt-4" />
                    </form>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToprops = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToprops, { registerUser })(withRouter(Register));