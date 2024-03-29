import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component {

    onDeleteClick(id) {
        this.props.deletePost(id);
    }
    onLikeClick(id) {
        this.props.addLike(id);
    }
    onUnlikeClick(id) {
        this.props.removeLike(id);
    }

    isUserLiked(likes) {
        const { auth } = this.props;
        if(likes.filter(like => like.user === auth.user.id).length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    render() {

        const { post , auth, showActions } = this.props;

        return (
            <div className="card card-body mb-3">
              <div className="row">
                <div className="col-md-2">
                    <Link to={`/profile/id/${post.user}`} style={{'color':'#000','textDecoration':'none'}}>
                        <div className="p-3">
                            <img className="img-thumbnail rounded-circle d-none d-md-block" src={post.avatar}
                            alt="" />
                        </div>
                    </Link>
                    <p className="text-center">{post.name}</p>
                </div>
                <div className="col-md-10 pt-3">
                  <p className="lead">{post.text}</p>
                  {showActions ? (
                    <span>
                        <button onClick={this.onLikeClick.bind(this, post._id)} type="button" className="btn btn-light mr-2">
                        <i className={classnames('fas fa-thumbs-up', {
                            'text-info': this.isUserLiked(post.likes)
                        })}></i>
                        <span className="badge badge-light">{post.likes.length}</span>
                    </button>
                    <button onClick={this.onUnlikeClick.bind(this, post._id)} type="button" className="btn btn-light mr-2">
                        <i className="text-secondary fas fa-thumbs-down"></i>
                    </button>
                    <Link to={`/post/${post._id}`} className="btn btn-info mr-2">
                        Comments ({post.comments.length})
                    </Link>
                    {post.user === auth.user.id ? (
                        <button type="button" onClick={this.onDeleteClick.bind(this, post._id)} className="btn btn-danger mr-1">
                            <i className="fas fa-trash mr-1" /> Delete Post
                        </button>
                    ) : null}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
        )
    }
}

PostItem.defaultProps = {
    showActions: true
}

PostItem.propTypes = {
    showActions: PropTypes.bool.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, {deletePost, addLike, removeLike})(PostItem);