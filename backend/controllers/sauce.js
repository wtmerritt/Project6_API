const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  req.body.sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    imageUrl: url + "/images/" + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    usersLiked: [],
    usersDisliked: [],
    userId: req.body.sauce.userId,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
      console.log("Error with creating a new sauce: ", error);
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      imageUrl: url + "/images/" + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      usersLiked: [],
      usersDisliked: [],
      userId: req.body.sauce.userId,
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      imageUrl: req.body.imageUrl,
      mainPepper: req.body.mainPepper,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
      userId: req.body.userId,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Deleted Sauce!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
      console.log("No sauce found ...", error);
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      const sauceId = req.params.id;
      const like = req.body.like;
      const userId = req.body.userId;
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;

      // Looking to see if user exist in the array
      function findUser(id) {
        return id === userId;
      }

      if (like === 0) {
        if (usersLiked.find(findUser)) {
          const newUsersLiked = usersLiked.filter((item) => {
            return item !== userId;
          });
          sauce.usersLiked = newUsersLiked;
          sauce.likes--;
        } else if (usersDisliked.find(findUser)) {
          const newUsersDisliked = usersDisliked.filter((item) => {
            return item !== userId;
          });
          sauce.usersDisliked = newUsersDisliked;
          sauce.dislikes--;
        }
      } else if (like === 1) {
        const foundUserId = usersLiked.find(findUser);

        // If user exist don't add userid to array and increase the likes counter;        
        if (!foundUserId) {          
          usersLiked.push(userId);
          sauce.likes++;
        }
      } else if (like === -1) {
        const foundUserId = usersLiked.find(findUser);

        // If user exist don't add userid to array and increase the dislikes counter;
        if (!foundUserId) {          
          usersDisliked.push(userId);
          sauce.dislikes++;
        }
      }

      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
          res.status(201).json({
            message: "Sauce successfully!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
      console.log("No Like made ...", error);
    });
};
