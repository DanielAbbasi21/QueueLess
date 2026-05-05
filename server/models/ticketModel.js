const db = require("./db");

exports.createTicket = (user_id, business_id, message, callback) => {
  const query = `
    INSERT INTO tickets (user_id, business_id, message)
    VALUES (?, ?, ?)
  `;
  db.query(query, [user_id, business_id, message], callback);
};

exports.getAllTickets = (callback) => {
  const query = `
    SELECT 
      tickets.id,
      users.name AS user,
      businesses.name AS business,
      tickets.message,
      tickets.status,
      tickets.created_at
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    JOIN businesses ON tickets.business_id = businesses.id
    ORDER BY tickets.created_at ASC
  `;
  db.query(query, callback);
};

exports.startTicket = (id, callback) => {
 const resetQuery = "UPDATE tickets SET status = 'waiting' WHERE status = 'active'";
 const startQuery = `
  UPDATE tickets 
  SET status = 'active' 
  WHERE id = ? AND status = 'waiting'
 `;

 db.query(resetQuery, () => {
   db.query(startQuery, [id], callback);
 });
};

exports.doneTicket = (id, callback) => {
  const query = `
    UPDATE tickets
    SET status = 'done', completed_at = NOW()
    WHERE id = ?
  `;

  db.query(query, [id], callback);
};
