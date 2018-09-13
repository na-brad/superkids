import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link
        style={{ backgroundColor: "#3B5998" }}
        to="/edit-profile"
        className="text-white btn mr-1"
      >
        <i className="fas fa-user text-white mr-1" /> Edit Profile
      </Link>
      <br />
      <Link
        style={{ backgroundColor: "#3B5998" }}
        to="/add-achievement"
        className="btn text-white"
      >
        <i className="fas fa-trophy text-white mr-1" />
        Add Achievement
      </Link>
      {/* <Link to="/add-education" className="btn btn-light">
        <i className="fas fa-graduation-cap text-info mr-1" />
        Add Education
      </Link> */}
    </div>
  );
};

export default ProfileActions;
