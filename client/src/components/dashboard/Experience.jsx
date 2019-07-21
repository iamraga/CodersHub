import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profileActions';

class Experience extends Component {
    
    onDeleteClick(id) {
        this.props.deleteExperience(id);
    }

    render() {

        const isExperienceAvailable = this.props.experience.length > 0;
        const experience = this.props.experience.map(exp => (
            <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>
                    <Moment format="YYYY/MM/DD">{exp.from}</Moment> - 
                    {exp.to === null ? (' To date') : (<Moment format="YYYY/MM/DD">{exp.to}</Moment>)}
                </td>
                <td>
                    <button onClick={this.onDeleteClick.bind(this, exp._id)} className="btn btn-danger">Delete</button>
                </td>
            </tr>
        ))
        return (
            <div className="text-center">
                <h4 className="mb-4 text-left">Experience Credentials</h4>
                {isExperienceAvailable ? (
                    <table className="table">
                        <thead>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                            <th></th>
                        </thead>
                        {experience}
                    </table>
                ) : (
                <div>
                    <hr/>
                    <p>Experiences have not been provided</p>
                    <Link to="/add-experience" className="btn btn-info mb-3">Add Experience</Link>
                    <hr/>
                </div>)}
                
            </div>
        )
    }
}
 
Experience.propTypes = {
    deleteExperience : PropTypes.func.isRequired
}
export default connect(null, {deleteExperience})(Experience);