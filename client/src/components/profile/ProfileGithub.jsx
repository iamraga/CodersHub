import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
    constructor(props) {
        super(props);
        this.state ={
            clientId: '88195b4b3ed9dda6e71e',
            clientSecret: 'e3af1f6628a070aa857a782444b3fe880d42cd2b',
            count: 5,
            sort: 'created: asc',
            repos: []
        }
    }

    componentDidMount() {
        const { username } = this.props;
        const { count, sort, clientId, clientSecret } = this.state;

        fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&clientId=${clientId}&clientSecret=${clientSecret}`)
            .then(res => res.json())
            .then(data => {
                if(this.refs.myRefs) {
                    this.setState({repos: data});
                }
            })
            .catch(err => console.log(err))
    }
    render() {
        const { repos } = this.state;
        const isReposAvailable = repos.length > 0;
        const repoItems = repos.map((repo) => (
            <div key={repo.id} className="card card-body mb-2">
                <div className="row">
                    <div className="col-md-6">
                        <h4>
                            <a href={repo.html_url} target="_blank" className="text-info" rel="noopener noreferrer">
                                {repo.name}
                            </a>
                        </h4>
                        <p>{repo.description}</p>
                    </div>
                    <div className="col-md-6">
                        <span className="badge badge-info mr-1">
                            Stars : {repos.stargazers_count}
                        </span>
                        <span className="badge badge-secondary mr-1">
                            Watchers : {repos.watchers_count}
                        </span>
                        <span className="badge badge-success">
                            Forks : {repos.forks_count}
                        </span>
                    </div>
                </div>
            </div>
        ))
        return (
            <div ref="myRef" className="mb-4 text-center">
                <hr/>
                <h3 className="mb-4 text-left">Latest Github Repositories</h3>
                {(isReposAvailable) ? ({repoItems}) : <span>No Repositories available</span>}
            </div>
        )
    }
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired
}

export default ProfileGithub;