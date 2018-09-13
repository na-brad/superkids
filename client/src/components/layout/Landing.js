import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="row">
                  <div className="col-lg-6 text-center">
                    <h1 className="display-3 mb-4 name">
                      Super <br /> Kids
                    </h1>
                  </div>
                  <div className="col-lg-6 text-center">
                    <h2 className="subName">Empowering The Next</h2>
                    <Link
                      to="/register"
                      style={{ backgroundColor: "#3B5998" }}
                      className="btn btn-lg text-white mr-2 landBtn"
                    >
                      Join Now
                    </Link>
                    <Link to="/login" className="btn btn-lg btn-light landBtn">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
