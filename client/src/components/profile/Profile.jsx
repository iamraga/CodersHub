import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileGithub from './ProfileGithub';
import ProfileCreds from './ProfileCreds';
import Spinner from '../common/Spinner';
import { getProfileByHandle, getProfileById } from '../../actions/profileActions';

class Profile extends Component {

    componentDidMount() {
        if(this.props.match.params.handle) {
            this.props.getProfileByHandle(this.props.match.params.handle);
        }
        else if(this.props.match.params.id) {
            this.props.getProfileById(this.props.match.params.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.profile.profile === null && this.props.profile.loading) {
            this.props.history.push('/not-found');
        }
    }

    render() {
        const { profile, loading } = this.props.profile;
        let profileContent;

        if(profile == null || loading) {
            profileContent = <Spinner />;
        }
        else {
            profileContent = (
                <div>
                    <div className="row">
                        <div className="col-md-2">
                            <Link to="/profiles" className="btn btn-info mb-3 float-left">
                                Go to Profiles
                            </Link>
                        </div>
                        <div className="col-md-2">
                            <Link to="/feed" className="btn btn-info mb-3 float-left">
                                Go to Feed
                            </Link>
                        </div>
                        <div className="col-md-8" />
                    </div>
                    <ProfileHeader profile={profile} />
                    <ProfileAbout profile={profile} />
                    <ProfileCreds education={profile.education} experience={profile.experience} />
                    {profile.githubusername ? (<ProfileGithub username={profile.githubusername} />) : null}
                </div>
            )
        }
        return (
            <div className="profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {profileContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    getProfileByHandle: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, {getProfileByHandle, getProfileById})(Profile);