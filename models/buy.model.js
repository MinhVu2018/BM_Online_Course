const db = require("../utils/db");

module.exports = {
    async listByUser(username) {
        const sql = `select * from UserBuy where Username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
        return null;
  
        return rows[0];
    },

    async ifUserBuy(username, courseid) {
        const sql =`select * from UserBuy where Username = '${username}' and CourseID = ${courseid}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
        return null;
  
        return rows[0];
    },

    async add(username, courseid) {
        const [result, fields] = await db.add({'Username': username, 'CourseID': courseid}, 'UserBuy');
        return result;
    },
  };