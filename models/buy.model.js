const db = require("../utils/db");
const { paginate } = require('../config/default.json');

module.exports = {
    async listByUser(username) {
        const sql = `select * from UserBuy where Username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;   
        return rows;
    },

    async pageByBought(username, offset) {
        const sql = `select Courses.* from UserBuy, Courses where UserBuy.CourseId = Courses.CourseId && UserBuy.Username = '${username}' limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        return rows;
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