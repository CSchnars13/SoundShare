import User from '../models/user';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getUsers(req, res) {
  User.find().sort('-role').exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ users });
  });
}

export function getInactiveUsers(req, res){
  User.find({active: false}).exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    else{
      res.json({ users });
    }
  });
}

export function deleteUsers(req, res) {
  User.remove({}).exec((err) => {
    if (err){
      console.log(err);
      res.status(500).send(err);
    }
    console.log("users deleted");
  });
}

export function getUser(req, res) {
  User.findOneAndUpdate({ email: req.params.email }, {$set:{active:true}}, {new: true}).populate("subscribed").exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else{
      res.json({ user });
  }
  });
}

export function addUser(req, res) {
  if (!req.body.user.name || !req.body.user.email || !req.body.user.password) {
    return res.status(403).end();
  }

  var name = req.body.user.name;
  var email = req.body.user.email;
  var password = req.body.user.password;

  const newUser = new User({name: name, email: email, password: password, active: true, albums: [], events: [], subscribed: []});

  newUser.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    else{
      res.json({ user: saved });
    }
  });
}

export function signOutUser(req, res) {
  User.findOneAndUpdate({ email: req.params.email }, {$set:{active:false}}, {new: true}).exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else{
      res.json({ user });
  	}
  });
}

export function addAlbum(req, res) {
  if (!req.body.album.title || !req.body.album.artist || !req.body.album.date || !req.body.album.rating || !req.body.album.comment ) {
    res.status(403).end();
  }

  const newAlbum = req.body.album;

    User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else{
      user.albums = [newAlbum, ...user.albums];
      user.save(function(err){
        if (err)
          return res.status(500).send(err);
      });
      res.json({ album: user.albums[0] });
    }
  });
}

export function addFollow(req, res) {

  const subscribedID = req.body.subscriber.id;

    User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else{
      user.subscribed = [subscribedID, ...user.subscribed];
      user.save(function(err){
        if (err)
          return res.status(500).send(err);
      });
    }
    
    User.find({ _id: subscribedID }).exec((err, user2) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else{
        console.log(user2);
        res.json({ subscribed: user2});
      }
    });
  });
    
}

export function addEvent(req, res) {
  if (!req.body.event.name || !req.body.event.location || !req.body.event.date ) {
    return res.status(403).end();
  }

  const newEvent = req.body.event;

    User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else{
      user.events = [newEvent, ...user.events];
      user.save(function(err){
        if (err)
          return res.status(500).send(err);
      });
      res.json({ event: user.events[0] });
    }
  });
}


