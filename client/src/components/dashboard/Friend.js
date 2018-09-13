import React from "react";
import { Link } from "react-router-dom";

const Friend = props => (
  <div style={{ float: "left", marginLeft: "20px" }}>
    <Link to={`/user/${props.id}`}>{props.name}</Link>
    {/* <img
      style={{ height: 200, width: "auto" }}
      src={props.path}
      alt="silhouette"
    /> */}
  </div>
);

export default Friend;
