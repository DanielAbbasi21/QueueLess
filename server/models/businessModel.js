const db = require("./db");

exports.getAllBusinesses = (callback) => {
  db.query("SELECT * FROM businesses", callback);
};