import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/postActions';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';

class Post extends Component {

    componentDidMount() {
        this.props.getPost(this.props.match.params.id);
    }
    render() {

        const { post, loading } = this.props.post;
        let postContent;
        
        if(post === null || loading || Object.keys(post).length === 0) {
            postContent = (<Spinner />);
        }
        else {
            postContent = (
                <div>
                    <PostItem post={post} showActions={false} />
                    <h4 className="mb-4">Comments</h4>
                    <CommentForm postId={post._id} />
                    <CommentFeed postId={post._id} comments={post.comments} />
                </div>
            );
        }
        
        return (
            <div className="post">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Link to='/feed' className="btn btn-info mb-3">
                                Back to Feed
                            </Link>
                            {postContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.posts
});

export default connect(mapStateToProps, {getPost})(Post);