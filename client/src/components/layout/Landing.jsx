import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from '../../img/showcase.jpg';

class Landing extends Component {

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    render() {
        return (
            <div className="landing">
                <div className="landing-inner text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1 className="display-3 mb-4">Coders Hub
                                </h1>
                                <p className="lead"> Create a developer profile/portfolio, share posts and get help from other coders</p>
                                <hr />
                                <Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
                                <Link to="/login" className="btn btn-lg btn-light">Login</Link>
                            </div>
                            <div className="col-md-12 text-center mt-5 pt-5">
                                <img src={logo} class="logo" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
}); 

export default connect(mapStateToProps)(Landing);