import React from "react";
import { Link } from "react-router-dom";

// import "../App.css"

const Request = props => (
  <div className="request">
    <Link to={`/user/${props.id}`}>{props.name}</Link>
    <h5>{props.email}</h5>
    {/* <img
      style={{ height: 200, width: "auto" }}
      src={props.path}
      alt="stranger"
    /> */}
    <button onClick={() => props.handleAcceptFriend(props.id)}>
      Accept Friend
    </button>
    <button onClick={() => props.handleRejectFriend(props.id)}>
      Delete Request
    </button>
  </div>
);

export default Request;
