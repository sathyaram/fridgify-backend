const express = require("express");
const router = express.Router();
const { Item, Category } = require("../db/models/index");
const passport = require("passport");

// router.get('/',(req, res) => {
//   res.sendFile(__dirname + '../../frontend/build/index.html')
// })

// GET for Categories
router.get("/api/categories", (req, res, next) => {
  Category.find()
    .then(items => {
      res.json(items);
    })
    .catch(next);
});

// temporary POST for Categories
router.post("/api/categories", (req, res, next) => {
  Category.create(req.body)
    .then(category => {
      res.send(category);
    })
    .catch(next);
});

// get a list of items from the db
router.get("/api/items", (req, res, next) => {
  Item.find()
    .then(items => {
      res.json(items);
    })
    .catch(next);
});

// add a new item to the db
router.post("/api/items", (req, res, next) => {
  console.log("adding an item");
  console.log(req.body);
  Item.create(req.body)
    .then(item => {
      res.send(item);
    })
    .catch(next);
});

// get the item in the db
router.get("/api/items/:id", (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      res.json(item);
    })
    .catch(err => {
      console.log(err);
    });
});

// update the item in the db
router.put("/api/items/:id", (req, res, next) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
    Item.findOne({ _id: req.params.id }).then(item => {
      res.send(item);
    });
  });
});

// delete an item from db
router.delete("/api/items/:id", (req, res, next) => {
  Item.findByIdAndRemove({ _id: req.params.id }).then(item => {
    res.send(item);
  });
});

// POST /signup

router.post('/signup', (req, res, next) => {
  const auth = passport.authenticate("local-signup", (err, user, info) => {
    if (err) {
      //some unrecoverable error
      res.send(401, {message: err.message, signedUp: false});
    } else if (user) {
      //all's well
      res.send({ signedUp: true });
    } else {
      //There is no user, which means signup failed - so get the message out of info, and send
      //not signed up
      res.send(401, {message: info.message, signedUp: false});
    }
  });
  auth(req, res, next);
});

router.post('/login', (req, res, next) => {
  const auth = passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      //some unrecoverable error
      res.send(401, {message: err.message, loggedIn: false});
    } else if (user) {
      //all's well
      res.send({ loggedIn: true });
    } else {

      res.send(401, {message: info.message, loggedIn: false});
    }
  })
  auth(req, res, next);
})


module.exports = router;
