// FILE UPLOAD FOR PROFILE PIC + RESET CODE BY EMAIL with AWS (not added in production)

//const ses = require("./ses.js");
//const s3 = require("./s3.js");

// const multer = require("multer");
// const uidSafe = require("uid-safe");
// const path = require("path");
//
// const diskStorage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, __dirname + "/uploads");
//   },
//   filename: function(req, file, callback) {
//     uidSafe(24).then(function(uid) {
//       callback(null, uid + path.extname(file.originalname));
//     });
//   }
// });
//
// const uploader = multer({
//   storage: diskStorage,
//   limits: {
//     fileSize: 2097152
//   }
// });

//UPLOAD PROFILE PIC
// app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
//   let id = req.session.userId;
//
//   if (req.file) {
//     const name1 = "https://s3.amazonaws.com/retina-imageboard/";
//     const url = name1 + id + "/" + req.file.filename;
//
//     db.addImage(url, id)
//       .then(function(result) {
//         return res.json(url);
//       })
//       .catch(function(error) {
//         return res.json({ error: true });
//       });
//   } else {
//     return res.json({ error: true });
//   }
// });

//PASSWORD RESET - VERIFY EMAIL
// app.post("/password/reset/start", (req, res) => {
//   let email = req.body.email;
//   let subject = "code to reset your password from social network";
//   let code = cryptoRandomString({ length: 10 });
//   let message = code;
//
//   db.verifyUser(email)
//     .then(result => {
//       if (result.rows.length == 0) {
//         return res.json({ error: true });
//       } else {
//         db.insertResetCode(email, code)
//           .then(result => {
//             return ses.sendEmail(email, subject, message);
//           })
//           .then(result => {
//             return res.json({ reset: true });
//           })
//           .catch(err => {
//             console.log("error", err);
//             return res.json({ error: true });
//           });
//       }
//     })
//     .catch(err => {
//       return res.json({ error: true });
//     });
// });
//
// //PASSWORD RESET - VERIFY CODE
// app.post("/password/reset/verify", (req, res) => {
//   let inputCode = req.body.code;
//   let password = req.body.password;
//   let id = req.session.userId;
//
//   db.verifyCode()
//     .then(result => {
//       const matchingitem = result.rows.filter(item => item.code === inputCode);
//
//       let codeDB = matchingitem[0].code;
//       codeDB.trim();
//       inputCode.trim();
//
//       if (codeDB === inputCode) {
//         hash(password)
//           .then(hashedPw => {
//             password = hashedPw;
//
//             req.session.userID = matchingitem[0].id;
//
//             db.updatePassword(password, id)
//               .then(result => {
//                 return res.json({ verified: true });
//               })
//               .catch(err => {
//                 return res.json({ error: true });
//               });
//           })
//           .catch(err => {
//             return res.json({ error: true });
//           });
//       } else {
//         return res.json({ error: true });
//       }
//     })
//     .catch(err => {
//       return res.json({ error: true });
//     });
// });
