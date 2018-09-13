import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import Achievement from "./Achievement";
import Education from "./Education";
import axios from "axios";
import Friend from "./Friend";
import Request from "./Request";

class Dashboard extends Component {
  state = {
    email: "",
    friendRequests: [],
    friends: []
  };
  getRequests = user => {
    axios.post("/api/users/FriendRequests", user).then(data => {
      this.setState({ friendRequests: data.data.FriendRequestedBy });
      console.log(data);
      console.log(this.state.friendRequests);
    });
  };

  getFriends = user => {
    axios.post("/api/users/Friends", user).then(data => {
      this.setState({ friends: data.data.Friends });
    });
  };
  handleInput = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleAddFriend = () => {
    const { user } = this.props.auth;
    const friendsToBe = {
      requestor: user,
      requestee: this.state.email
    };
    this.refs.emailInput.value = "";

    axios
      .post("/api/users/AddFriend", friendsToBe)
      // .then(data => {
      //     this.setState({friendRequests: data.data.FriendRequestedBy});console.log(data);console.log(this.state.friendRequests)
      // })
      .then(console.log);

    // addFriend(friendsToBe) // TODO: understand why this is NOT this. props. addFriend
  };
  handleAcceptFriend = id => {
    const { user } = this.props.auth;
    const duo = {
      requestor: id,
      acceptor: user.id
    };
    axios
      .post("/api/users/AcceptFriend", duo)
      .then(data => {
        this.setState({ friends: data.data.Friends });
        return axios.post("/api/users/DeleteRequest", duo);
      })
      .then(data => {
        this.setState({ friendRequests: data.data.FriendRequestedBy });
      })
      .then(this.getFriends(user));

    // .then(data=> {
    //     console.log(data)
    //     this.setState({friends: data.data.Friends})
    // })
    // .then(console.log)
  };

  handleRejectFriend = id => {
    const { user } = this.props.auth;
    const duo = {
      requestor: id,
      rejector: user.id
    };
    axios.post("/api/users/DeleteFriendRequest", duo).then(data => {
      this.setState({ friendRequests: data.data.FriendRequestedBy });
    });
  };

  componentDidMount() {
    const { user } = this.props.auth;

    this.props.getCurrentProfile();
    this.getFriends(user);
    this.getRequests(user);
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            {JSON.stringify(user)}
            <ProfileActions />
            <Achievement achievement={profile.achievement} />
            <br />
            <input
              onChange={this.handleInput}
              value={this.state.email}
              placeholder="Friend's email"
              name="email"
              ref="emailInput"
            />
            <button onClick={this.handleAddFriend}>Add Friend</button>
            <h3>Pending Friend Requests:</h3>
            {this.state.friendRequests.length > 0
              ? this.state.friendRequests.map((request, index) => (
                  <Request
                    key={index}
                    email={request.email}
                    name={request.name}
                    handleAcceptFriend={this.handleAcceptFriend}
                    handleRejectFriend={this.handleRejectFriend}
                    id={request._id}
                    path={request.path}
                  />
                ))
              : null}
            <br />
            <h3>My Friends</h3>
            {this.state.friends.map((friend, index) => (
              <Friend
                key={index}
                name={friend.name}
                path={friend.path}
                id={friend._id}
              />
            ))}
            {/* <Education education={profile.education} />
            <div style={{ marginBottom: "60px" }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button> */}
          </div>
        );
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
