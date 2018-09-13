import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteAchievement } from "../../actions/profileActions";

class Achievement extends Component {
  onDeleteClick(id) {
    this.props.deleteAchievement(id);
  }

  render() {
    const achievement = this.props.achievement.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>
          {/* -
          {exp.to === null ? (
            " Now"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )} */}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Achievement Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Title</th>
              <th>Date</th>
              <th />
            </tr>
            {achievement}
          </thead>
        </table>
      </div>
    );
  }
}

Achievement.propTypes = {
  deleteAchievement: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteAchievement }
)(Achievement);
