import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';

class Posts extends Component {

    componentDidMount() {
        this.props.getPosts();
    }

    render() {

        const { posts, loading } = this.props.posts;
        let postContent;

        if(posts == null || loading) {
            postContent = (<Spinner />);
        }
        else {
            postContent = (
                <div>
                    <h4 className="mb-3">Post Feed</h4>
                    <PostFeed posts={posts} />
                </div>
            );
        }

        return (
            <div className="feed">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <PostForm />
                            {postContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    posts: state.posts
})
export default connect(mapStateToProps, {getPosts})(Posts);