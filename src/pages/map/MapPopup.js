import React from "react";

import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";

import postDetailStyles from "../../styles/PostDetail.module.css";
import PostImage from "../../components/PostImage";

const MapPopup = (props) => {
  const {
    id,
    owner,
    title,
    image,
    profile_id,
    profile_image,
    created_at,
    like_id,
    likes_count,
    comments_count,
    is_owner: isOwner,
  } = props;

  const currentUser = useCurrentUser();

  return (
    <>
      <Link
        to={`/posts/${id}`}
        title="Go to post page"
        className="mb-3 text-dark d-flex justify-content-start align-items-center"
      >
        <PostImage src={image} height={50} />
        <span className="fs-6">
          {title}{" "}
          <small>
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </small>
        </span>
      </Link>

      <div className="mt-2 d-flex justify-content-end">
        <span className="me-2">
          {isOwner ? (
            <i className="far fa-heart" />
          ) : like_id ? (
            <i className={`fas fa-heart ${postDetailStyles.HeartLiked}`} />
          ) : currentUser ? (
            <i className={`far fa-heart ${postDetailStyles.HeartNotLiked}`} />
          ) : (
            <i className="far fa-heart" />
          )}
          <span className="ms-1">{likes_count}</span>
        </span>
        <span>
          <i className="far fa-comments" />
          <span className="ms-1">{comments_count}</span>
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between border-top border-bottom px-2 py-2 my-2">
        <span>{created_at}</span>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={30} text={owner} />
        </Link>
      </div>
    </>
  );
};

export default MapPopup;