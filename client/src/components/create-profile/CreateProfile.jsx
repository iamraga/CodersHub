import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; 
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
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

    onSubmit(event) {
        event.preventDefault();
        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            location: this.state.location,
            status: this.state.status,
            website: this.state.website,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            instagram: this.state.instagram,
            youtube: this.state.youtube
        }

        this.props.createProfile(profileData, this.props.history)
    }

    onChange(event) {
        this.setState({[event.target.name] : event.target.value});
    }

    render() {
        
        const { errors, displaySocialInputs } = this.state;

        let socialInputs;
        if(displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup 
                        placeholder = "Twitter profile URL"
                        name = "twitter"
                        icon = "fab fa-twitter"
                        value = {this.state.twitter}
                        onChange = {this.onChange}
                        error = {errors.twitter}
                    />
                    <InputGroup 
                        placeholder = "Facebook profile URL"
                        name = "facebook"
                        icon = "fab fa-facebook"
                        value = {this.state.facebook}
                        onChange = {this.onChange}
                        error = {errors.facebook}
                    />
                    <InputGroup 
                        placeholder = "LinkedIN profile URL"
                        name = "linkedin"
                        icon = "fab fa-linkedin"
                        value = {this.state.linkedin}
                        onChange = {this.onChange}
                        error = {errors.linkedin}
                    />
                    <InputGroup 
                        placeholder = "Youtube channel URL"
                        name = "youtube"
                        icon = "fab fa-youtube"
                        value = {this.state.youtube}
                        onChange = {this.onChange}
                        error = {errors.youtube}
                    />
                    <InputGroup 
                        placeholder = "Instagram profile URL"
                        name = "instagram"
                        icon = "fab fa-instagram"
                        value = {this.state.instagram}
                        onChange = {this.onChange}
                        error = {errors.instagram}
                    />
                </div>
            )
        }
        //Select options for status
        const options = [
            { label: '* Select Professional status', value: 0 },
            { label: 'Manager', value: 'Manager' },
            { label: 'Full Stack Developer', value: 'Full Stack Developer' },
            { label: 'Senior Developer', value: 'Senior Developer' },
            { label: 'Junior Developer', value: 'Junior Developer' },
            { label: 'Marketing Analyst', value: 'Marketing Analyst' },
            { label: 'Technical Writer', value: 'Technical Writer' },
            { label: 'Quality Assurance', value: 'Quality Assurance' },
            { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
            { label: 'Student or Learning', value: 'Student or Learning' },
            { label: 'Intern', value: 'Intern' },
            { label: 'Others', value: 'Others' },
        ];
        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create your profile</h1>
                            <p className="lead text-center">
                                Let's get some information to make your profile stand out
                            </p>
                            <small className="d-block pb-3">* - required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup 
                                    placeholder="* Profile handle"
                                    name="handle"
                                    value={this.state.handle}
                                    onChange={this.onChange}
                                    error={errors.handle}
                                    info="A unique handle for your profile URL. Your full name, company name, nickname"
                                />
                                <SelectListGroup 
                                    name="status"
                                    value={this.state.status}
                                    onChange={this.onChange}
                                    options={options}
                                    error={errors.status}
                                    info="Give us an idea of where you are at your career"
                                />
                                <TextFieldGroup 
                                    placeholder="Company"
                                    name="company"
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    error={errors.company}
                                    info="Your company name or the company you work for"
                                />
                                <TextFieldGroup 
                                    placeholder="Website"
                                    name="website"
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    error={errors.website}
                                    info="Should begin with 'https://'. Could be your company's website or your own website"
                                />
                                <TextFieldGroup 
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    error={errors.location}
                                    info="Your current location"
                                />
                                <TextFieldGroup 
                                    placeholder="Skills"
                                    name="skills"
                                    value={this.state.skills}
                                    onChange={this.onChange}
                                    error={errors.skills}
                                    info="Please use comma separated values (eg. HTML, CSS, Javascript, PHP)"
                                />
                                <TextFieldGroup 
                                    placeholder="Github Username"
                                    name="githubusername"
                                    value={this.state.githubusername}
                                    onChange={this.onChange}
                                    error={errors.githubusername}
                                    info="Adding your GITHUB username will fetch your latest repositories to your profile"
                                />
                                <TextAreaFieldGroup 
                                    placeholder="Short Bio"
                                    name="bio"
                                    value={this.state.bio}
                                    onChange={this.onChange}
                                    error={errors.bio}
                                    info="Tell us about yourself"
                                />

                                <div className="mb-3">
                                    <button type="button" onClick={() => {
                                        this.setState(prevState => ({
                                            displaySocialInputs: !prevState.displaySocialInputs
                                        }));
                                    }} className="btn btn-light">
                                        Add social network links
                                    </button>
                                    <small className="text-muted" style={{marginLeft: '10px'}}>(Optional)</small>
                                </div>
                                {socialInputs}
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {createProfile})(withRouter(CreateProfile));