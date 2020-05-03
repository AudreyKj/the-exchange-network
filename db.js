const spicePg = require("spiced-pg");

const db = spicePg(
  process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/socialnetwork"
);

function registerUser(first, last, email, password) {
  return db.query(
    `INSERT INTO users(first, last, email, password)
   VALUES ($1, $2, $3, $4) RETURNING id`,
    [first, last, email, password]
  );
}

function getInfoUser(id) {
  return db.query(`SELECT *  FROM users WHERE id=$1`, [id]);
}

function verifyUser(email) {
  return db.query(`SELECT password, id FROM users where email=$1`, [email]);
}

function insertResetCode(email, code) {
  return db.query(
    `INSERT INTO password_reset_codes(email, code) VALUES($1, $2) RETURNING id`,
    [email, code]
  );
}

function verifyCode() {
  return db.query(`SELECT * FROM password_reset_codes
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`);
}

function updatePassword(password, id) {
  return db.query(`UPDATE users SET password=$1 WHERE id=$2`, [password, id]);
}

function addImage(url, id) {
  return db.query(`UPDATE users SET url=$1 WHERE id=$2`, [url, id]);
}

function addBio(bio, id) {
  return db.query(`UPDATE users SET bio=$1 WHERE id=$2`, [bio, id]);
}

function getRecentUsers() {
  return db.query(`SELECT * FROM users ORDER BY ID desc LIMIT 3;`);
}

function getMatchingUsers(val) {
  return db.query(`SELECT * FROM users WHERE first ILIKE $1;`, [val + "%"]);
}

function getFriendshipStatus(otherUser_id, user_id) {
  return db.query(
    `SELECT * FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`,
    [otherUser_id, user_id]
  );
}

function makeFriendRequest(otherUser_id, user_id) {
  return db.query(
    `INSERT INTO friendships(receiver_id, sender_id, accepted)
        VALUES ($1, $2, false) RETURNING *`,
    [otherUser_id, user_id]
  );
}

function acceptFriendRequest(otherUser_id, user_id) {
  return db.query(
    `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2 RETURNING *`,
    [otherUser_id, user_id]
  );
}

function endFriendship(otherUser_id, user_id) {
  return db.query(
    `DELETE FROM friendships WHERE (receiver_id =$1 AND sender_id =$2)
    OR (receiver_id =$2 AND sender_id =$1) RETURNING *`,
    [otherUser_id, user_id]
  );
}

function deleleAccount(user_id) {
  return db.query(
    `DELETE FROM users
        WHERE id = $1`,
    [user_id]
  );
}

function deleleInfoFriendship(user_id) {
  return db.query(
    `DELETE FROM friendships
        WHERE receiver_id = $1 OR sender_id = $1`,
    [user_id]
  );
}

function deleteExchanges(author_user_id) {
  return db.query(
    `DELETE FROM exchange
        WHERE author_user_id = $1`,
    [author_user_id]
  );
}

function deleteExchangesPublic(author_user_id) {
  return db.query(
    `DELETE FROM exchange_public
        WHERE author_user_id = $1`,
    [author_user_id]
  );
}

function deleteMsgs(user_id) {
  return db.query(
    `DELETE FROM messages
        WHERE user_id = $1`,
    [user_id]
  );
}

function getFriendsWannabes(user_id) {
  return db.query(
    `SELECT users.id, first, last, url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id= $1 AND receiver_id = users.id)`,
    [user_id]
  );
}

function getLastMessages() {
  return db.query(
    `SELECT users.id, users.first, users.last,
        messages.user_id, messages.message, messages.id, messages.created_at
        FROM messages LEFT JOIN users ON users.id = messages.user_id
       ORDER BY messages.id DESC LIMIT 10`
  );
}

function storeNewMessage(user_id, message) {
  return db.query(
    `INSERT INTO messages(user_id, message)
        VALUES ($1, $2)
        RETURNING *`,
    [user_id, message]
  );
}

function getInfoForMsg(user_id) {
  return db.query(`SELECT  first, last FROM users WHERE id = $1`, [user_id]);
}

function insertExchangePublic(title, city, description, author_user_id) {
  return db.query(
    `INSERT INTO exchange_public (title, city, description, author_user_id)
VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, city, description, author_user_id]
  );
}

function insertExchange(title, city, description, author_user_id) {
  return db.query(
    `INSERT INTO exchange(title, city, description, author_user_id)
VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, city, description, author_user_id]
  );
}

function findInfoForExchange(author_user_id) {
  return db.query(`SELECT  first, last FROM users WHERE id = $1`, [
    author_user_id
  ]);
}

function getLastExchangesPublic() {
  return db.query(`SELECT users.first, users.last, exchange_public.author_user_id, exchange_public.id,
  exchange_public.title, exchange_public.description, exchange_public.city, exchange_public.created_at
  FROM exchange_public
  LEFT JOIN users
  ON (users.id = exchange_public.author_user_id)
  ORDER BY exchange_public.id DESC LIMIT 10`);
}

function getLastExchangesPrivate(user_id) {
  return db.query(
    `SELECT DISTINCT friendships.receiver_id, friendships.sender_id, friendships.accepted, users.id,
        users.first, users.last, exchange.author_user_id, exchange.id, exchange.title,
        exchange.description, exchange.city, exchange.created_at
        FROM exchange
        LEFT JOIN friendships
        ON (exchange.author_user_id = friendships.sender_id AND friendships.receiver_id = $1 AND friendships.accepted = true)
        OR (exchange.author_user_id = friendships.receiver_id AND friendships.sender_id = $1 AND friendships.accepted = true)
        LEFT JOIN users
        ON (users.id = exchange.author_user_id AND exchange.author_user_id = friendships.sender_id
          AND friendships.receiver_id = $1 AND friendships.accepted = true)
        OR (users.id = exchange.author_user_id AND exchange.author_user_id = friendships.receiver_id
          AND friendships.sender_id = $1 AND friendships.accepted = true)
        OR (exchange.author_user_id = users.id)
        ORDER BY exchange.id DESC LIMIT 10`,
    [user_id]
  );
}

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.insertResetCode = insertResetCode;
exports.verifyCode = verifyCode;
exports.updatePassword = updatePassword;
exports.addImage = addImage;
exports.addBio = addBio;
exports.getInfoUser = getInfoUser;
exports.getRecentUsers = getRecentUsers;
exports.getMatchingUsers = getMatchingUsers;
exports.getFriendshipStatus = getFriendshipStatus;
exports.makeFriendRequest = makeFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.endFriendship = endFriendship;
exports.getFriendsWannabes = getFriendsWannabes;
exports.deleleAccount = deleleAccount;
exports.deleleInfoFriendship = deleleInfoFriendship;
exports.getLastMessages = getLastMessages;
exports.storeNewMessage = storeNewMessage;
exports.getInfoForMsg = getInfoForMsg;
exports.deleteMsgs = deleteMsgs;
exports.deleteExchanges = deleteExchanges;
exports.deleteExchangesPublic = deleteExchangesPublic;
exports.insertExchange = insertExchange;
exports.getLastExchangesPrivate = getLastExchangesPrivate;
exports.getLastExchangesPublic = getLastExchangesPublic;
exports.findInfoForExchange = findInfoForExchange;
exports.insertExchangePublic = insertExchangePublic;
