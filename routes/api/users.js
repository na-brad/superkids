const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.post("/Friends", function(req, res) {
  const id = req.body.id;
  User.findById(id)
    .populate("Friends")
    .then(Friends => res.json(Friends))
    .catch(err => res.status(404).json(err));
});

router.post("/AddFriend", function(req, res) {
  // 'req' is the package of two friends
  User.findOneAndUpdate(
    {
      // find user to be friended, by email address
      email: req.body.requestee
    },
    {
      $push: {
        FriendRequestedBy: req.body.requestor.id
      }
    } // TODO now this an object
  )
    // .populate('FriendRequestedBy')
    // .then(FriendRequests => res.json(FriendRequests))
    .then(user => {
      if (user) {
        // user exists, submit request to DB
        return res.end();
      } else {
        // user not found, inform requestor
        return res.status(404).json({
          reply: "Email not found"
        });
      } // end else
    }) // end then
    .catch(err => res.status(422).json(err));
}); //end router.post

router.post("/FriendRequests", function(req, res) {
  // ONLY shows active friend requests for the logged-in users
  const id = req.body.id;
  User.findById(id)
    .populate("FriendRequestedBy")
    .then(FriendRequests => res.json(FriendRequests))
    .catch(err => res.status(404).json(err));
});

router.post("/AcceptFriend", function(req, res) {
  console.log(req.body);
  const requestorId = req.body.requestor;
  const acceptorId = req.body.acceptor;
  User.findOneAndUpdate(
    { _id: ObjectId(requestorId) },
    { $push: { Friends: acceptorId } }
  ).catch(err => res.status(404).json(err));
  User.findOneAndUpdate(
    { _id: ObjectId(acceptorId) },
    { $push: { Friends: requestorId } }
  )
    .populate("Friends")
    .then(Friends => res.json(Friends))
    // .then(user => {
    //     if (user) { // user exists, submit request to DB
    //         return res.end()
    //     }
    //     else { // user not found, inform requestor
    //         return res.status(404).json({
    //             reply: 'Email not found'
    //         });
    //     } // end else
    // }) // end then
    .catch(err => res.status(422).json(err));
});

router.post("/DeleteRequest", function(req, res) {
  User.findOneAndUpdate(
    {
      _id: ObjectId(req.body.requestor)
    },
    {
      $pull: {
        FriendRequestedBy: req.body.acceptor
      }
    }
  ).catch(err => res.status(404).json(err));
  User.findOneAndUpdate(
    {
      _id: ObjectId(req.body.acceptor)
    },
    {
      $pull: {
        FriendRequestedBy: req.body.requestor
      }
    }
  )
    .populate("FriendRequestedBy")
    .then(FriendRequests => res.json(FriendRequests))
    .catch(err => res.status(422).json(err));
});

router.post("/DeleteFriendRequest", function(req, res) {
  User.findOneAndUpdate(
    {
      _id: ObjectId(req.body.rejector)
    },
    {
      $pull: {
        FriendRequestedBy: req.body.requestor
      }
    }
  )
    .populate("FriendRequestedBy")
    .then(FriendRequests => res.json(FriendRequests))
    .catch(err => res.status(422).json(err));
});

router.post("/images", (req, res) => {
  // console.log(req.body.image)
  const image = req.body.image.split(",")[1];
  const type = req.body.type.split("/")[1];
  fs.writeFile(
    "./client/public/images/" + req.body.handle + "." + type,
    image,
    "base64",
    err => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );
  console.log("WHAAAA", req.body.user);
  User.findOneAndUpdate(
    { _id: req.body.user._id },
    {
      $set: {
        path: "/images/" + req.body.handle + "." + type
      }
    }
  );
  Profile.findOneAndUpdate(
    { handle: req.body.handle },
    {
      $set: {
        path: "/images/" + req.body.handle + "." + type
      }
    }
  )
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
});

module.exports = router;
