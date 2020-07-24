const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const compression = require("compression");
const db = require("./db.js");
const { hash, compare } = require("./util/bc.js");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const cloudinary = require("cloudinary");
const secretCode = cryptoRandomString({
  length: 6
});

app.use(compression());

app.use(express.static("./public"));

app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json());

app.use((req, res, next) => {
  next();
});

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(require("csurf")());

app.use((req, res, next) => {
  res.set("x-frame-options", "deny");
  res.cookie("csrftoken", req.csrfToken());
  next();
});

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//multer for file upload
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public" + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 800000
  }
});

//WELCOME
app.get("/welcome", function(req, res) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

//LOGOUT
app.get("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/welcome");
});

//DELETE ACCOUNT
app.get("/deleteaccount", async (req, res) => {
  let user_id = req.session.userId;
  let author_user_id = req.session.userId;
  try {
    const deleteFriendInfo = await db.deleleInfoFriendship(user_id);
    const deleteMsgs = await db.deleteMsgs(user_id);
    const deleteExchanges = await db.deleteExchanges(author_user_id);
    const deleteExchangesPublic = await db.deleteExchangesPublic(
      author_user_id
    );
    const deleteAccount = await db.deleleAccount(user_id);
    req.session.userId = null;
    res.redirect("/welcome");
  } catch (err) {
    console.log(err, "error in delete account");
  }
});

//REGISTRATION
app.post("/registration/submit", (req, res) => {
  let first = req.body.first;
  let last = req.body.last;
  let email = req.body.email;
  let password = req.body.password;

  hash(password).then(hashedPw => {
    password = hashedPw;
    db.registerUser(first, last, email, password)
      .then(function(result) {
        req.session.userId = result.rows[0].id;
        return res.json(result);
      })
      .catch(function(err) {
        return res.json({ error: true });
      });
  });
});

//LOGIN
app.post("/login/submit", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  db.verifyUser(email)
    .then(result => {
      if (result.rows.length === 0) {
        return res.json({ error: true });
      }

      let passwordDB = result.rows[0].password;
      compare(password, passwordDB)
        .then(matchValue => {
          if (matchValue) {
            let id = result.rows[0].id;
            req.session.userId = id;

            res.redirect("/");
          } else {
            return res.json({ error: true });
          }
        })
        .catch(err => {
          return res.json({ error: true });
        });
    })
    .catch(err => {
      return res.json({ error: true });
    });
});

//PROFILE PIC UPLOAD
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.post("/upload", (req, res) => {
  uploader.single("file")(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.json({ error: true });
    } else if (err) {
      return res.json({ error: true });
    }

    let id = req.session.userId;

    if (req.file) {
      let username = req.body.username;
      let title = req.body.title;
      let description = req.body.description;

      cloudinary.uploader.upload(req.file.path, function(result) {
        const url = result.secure_url;

        db.addImage(url, id)
          .then(function(result) {
            return res.json(url);
          })
          .catch(function(error) {
            return res.json({ error: true });
          });
      });
    } else {
      return res.json({ error: true });
    }
  });
});

//USER
app.get("/user", (req, res) => {
  let id = req.session.userId;
  db.getInfoUser(id)
    .then(result => {
      return res.json({
        id: req.session.userId,
        first: result.rows[0].first,
        last: result.rows[0].last,
        bio: result.rows[0].bio,
        url: result.rows[0].url
      });
    })
    .catch(err => {
      return res.sendStatus(500);
    });
});

//OTHER PROFILES INFO BY ID NUMBER
app.get("/user/profile/:id", (req, res) => {
  let id = req.params.id.replace(".json", "");

  if (id === req.session.userId) {
    return res.json({ redirectTo: "/" });
  }

  db.getInfoUser(id)
    .then(result => {
      return res.json({ result });
    })
    .catch(err => {
      return res.sendStatus(500);
    });
});

//ADD OR EDIT BIO
app.post("/uploadbio", (req, res) => {
  let id = req.session.userId;
  let bio = req.body.bio;

  db.addBio(bio, id)
    .then(function(result) {
      return res.json(bio);
    })
    .catch(function(error) {
      return res.json({ error: true });
    });
});

//GET RECENT USERS
app.get("/api/recentusers", (req, res) => {
  let user_id = req.session.userId;
  db.getRecentUsers()
    .then(function(result) {
      const data = result.rows;
      const filtered = data.filter(element => element.id !== user_id);
      return res.json(filtered);
    })
    .catch(function(error) {
      console.log("error in get recent users", error);
    });
});

//FIND USERS
app.get("/search/:val", (req, res) => {
  let val = req.params.val;
  let user_id = req.session.userId;

  db.getMatchingUsers(val)
    .then(function(result) {
      const data = result.rows;
      const filtered = data.filter(element => element.id !== user_id);
      return res.json(filtered);
    })
    .catch(function(error) {
      console.log("error in find users", error);
    });
});

//FRIENDSHIP STATUS
app.get("/friends/:id", (req, res) => {
  let otherUser_id = req.params.id;
  let user_id = req.session.userId;

  db.getFriendshipStatus(otherUser_id, user_id)
    .then(function(result) {
      let data = result.rows[0];
      return res.status(200).json({ data });
    })
    .catch(function(error) {
      console.log("error in friendship status", error);
    });
});

//MAKE FRIEND REQUEST
app.post("/make-friend-request/:id", (req, res) => {
  let otherUser_id = req.params.id;
  let user_id = req.session.userId;

  db.makeFriendRequest(otherUser_id, user_id)
    .then(function(result) {
      return res.json(result);
    })
    .catch(function(error) {
      console.log("error in Make Friend Request", error);
    });
});

//RETRIVE FRIENDS AND FRIEND REQUESTS
app.get("/friends-wannabes", (req, res) => {
  let user_id = req.session.userId;

  db.getFriendsWannabes(user_id)
    .then(function(result) {
      return res.json(result.rows);
    })
    .catch(function(error) {
      console.log("error in get Friends or Wannabes", error);
    });
});

//ACCEPT FRIEND REQUEST - FRIEND PAGE
app.post("/accept-friend-request", (req, res) => {
  let otherUser_id = req.body.user;
  let user_id = req.session.userId;

  db.acceptFriendRequest(otherUser_id, user_id)
    .then(function(result) {
      return res.json(result.rows[0]);
    })
    .catch(function(error) {
      console.log("error in accept friend request", error);
    });
});

//ACCEPT FRIEND REQUEST - FIND PEOPLE PAGE
app.post("/accept-friend-request/:otherUser_id", (req, res) => {
  let otherUser_id = req.params.otherUser_id;
  let user_id = req.session.userId;

  db.acceptFriendRequest(otherUser_id, user_id)
    .then(function(result) {
      return res.json(result.rows[0]);
    })
    .catch(function(error) {
      console.log("error in accept friend request", error);
    });
});

//END FRIENDSHIP OR CANCEL FRIEND REQUEST - FIND PEOPLE PAGE
app.post("/end-friendship/:otherUser_id", (req, res) => {
  let otherUser_id = req.params.otherUser_id;
  let user_id = req.session.userId;

  db.endFriendship(otherUser_id, user_id)
    .then(function(result) {
      return res.json(otherUser_id);
    })
    .catch(function(error) {
      console.log("error in end friendship", error);
    });
});

//END FRIENDSHIP OR CANCEL FRIEND REQUEST - FRIEND PAGE
app.post("/end-friendship", (req, res) => {
  let otherUser_id = req.body.user.id;
  let user_id = req.session.userId;

  db.endFriendship(otherUser_id, user_id)
    .then(function(result) {
      return res.json(otherUser_id);
    })
    .catch(function(error) {
      console.log("error in end friendship", error);
    });
});

//GETTING  EXCHANGES POSTS
app.get("/getexchanges", (req, res) => {
  let user_id = req.session.userId;

  db.getLastExchangesPublic()
    .then(result => {
      let data = [];

      data.push(result.rows);

      db.getLastExchangesPrivate(user_id)
        .then(function(result) {
          for (let i = 0; i < result.rows.length; i++) {
            if (
              result.rows[i].author_user_id === user_id ||
              result.rows[i].receiver_id === user_id ||
              result.rows[i].sender_id === user_id
            ) {
              data.push(result.rows[i]);
            }
          }

          if (data.length === 0) {
            return;
          } else {
            const flatten = data.flat();
            return res.json(flatten);
          }
        })
        .catch(function(error) {
          console.log("error - get/last exchanges - private", error);
        });
    })
    .catch(error => {
      console.log("error - get/last exchanges", error);
    });
});

//SUBMIT AN EXCHANGE POST
app.post("/postexchange", (req, res) => {
  let author_user_id = req.session.userId;
  const { title, city, description } = req.body;
  console.log("req.body", req.body);

  if (req.body.privacy === "onlyFriends") {
    db.insertExchange(title, city, description, author_user_id)
      .then(function(result) {
        const data = result.rows[0];
        db.findInfoForExchange(author_user_id)
          .then(function(result) {
            const infoExchange = result.rows[0];
            const fullInfo = { ...data, ...infoExchange };
            return res.json(fullInfo);
          })
          .catch(function(error) {
            return res.json({ error: true });
          });
      })
      .catch(function(error) {
        return res.json({ error: true });
      });
  } else if (req.body.privacy === "public") {
    db.insertExchangePublic(title, city, description, author_user_id)
      .then(function(result) {
        const data = result.rows[0];
        db.findInfoForExchange(author_user_id)
          .then(function(result) {
            const infoExchange = result.rows[0];
            const fullInfo = { ...data, ...infoExchange };
            return res.json(fullInfo);
          })
          .catch(function(error) {
            return res.json({ error: true });
          });
      })
      .catch(function(error) {
        return res.json({ error: true });
      });
  }
});

app.get("*", function(req, res) {
  if (!req.session.userId) {
    res.redirect("welcome");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

server.listen(process.env.PORT || 8080, function() {
  console.log("server listening.");
});

// CHAT WITH SOCKET.IO
io.on("connection", function(socket) {
  if (!socket.request.session.userId) {
    return socket.disconnect(true);
  }

  const userId = socket.request.session.userId;

  db.getLastMessages(userId)
    .then(result => {
      const reversed = result.rows.reverse();
      io.sockets.emit("chatMessages", reversed);
    })
    .catch(error => console.log("error in get last messages", error));

  socket.on("newChatMessage", newChatMessage => {
    let message = newChatMessage;
    let user_id = userId;

    db.storeNewMessage(user_id, message)
      .then(result => {
        const data = result.rows[0];

        db.getInfoForMsg(user_id)
          .then(result => {
            const infoMsg = result.rows[0];
            const fullInfo = { ...data, ...infoMsg };
            newChatMessage = fullInfo;

            io.sockets.emit("newChatMessage", newChatMessage);
          })
          .catch(error => console.log("error in storeNewMessage", error));
      })
      .catch(error => console.log("error in storeNewMessage", error));
  });
});
