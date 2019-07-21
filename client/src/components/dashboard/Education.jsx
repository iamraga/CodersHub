import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {
    
    onDeleteClick(id) {
        this.props.deleteEducation(id);
    }

    render() {

        const isEducationAvailable = this.props.education.length > 0;
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>
                    <Moment format="YYYY/MM/DD">{edu.from}</Moment> - {' '}
                    {edu.to === null ? ('To date') : (<Moment format="YYYY/MM/DD">{edu.to}</Moment>)}
                </td>
                <td>
                    <button style={{'fontSize':'13px'}} onClick={this.onDeleteClick.bind(this, edu._id)} className="btn btn-danger">Delete</button>
                </td>
            </tr>
        ))
        return (
            <div className="text-center">
                <h4 className="mb-4 text-left">Education Credentials</h4>
                {isEducationAvailable ? (
                    <table className="table text-left">
                        <thead>
                            <th>School</th>
                            <th>Degree</th>
                            <th>Years</th>
                            <th></th>
                        </thead>
                        {education}
                    </table>
                ) : (
                    <div>
                        <hr/>
                        <p>Education details have not been provided</p>
                        <Link to="/add-education" className="btn btn-info mb-3">Add Education</Link>
                        <hr/>
                    </div>)}
            </div>
        ) 
    }
}
 
Education.propTypes = {
    deleteEducation : PropTypes.func.isRequired
}
export default connect(null, {deleteEducation})(Education);