const db = require("../utils/db");
const { paginate } = require('../config/default.json');

module.exports = {
    async listByUser(username) {
        const sql = `select * from UserLike where Username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async pageByFav(username, offset) {
        const sql = `select Courses.* from UserLike, Courses where UserLike.CourseId = Courses.CourseId && UserLike.Username = '${username}' limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async ifUserLike(username, courseid) {
        const sql =`select * from UserLike where Username = '${username}' and CourseID = ${courseid}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async add(username, courseid) {
        const [result, fields] = await db.add({'Username': username, 'CourseID': courseid}, 'UserLike');
        return result;
    },

    async remove(username, courseid) {
        const sql=`Username = '${username}' and CourseID = ${courseid}`
        const [result, fields] = await db.del(sql, 'UserLike');
        return result;
    },

    async deleteByUser(username) {
        const sql = `delete from UserLike where Username = '${username}'`;
        const [result, fields] = await db.load(sql);
        return result;
    },
    
    async deleteByID(id) {
        const sql = `delete from UserLike where CourseID = '${id}'`;
        const [result, fields] = await db.load(sql);
        return result;
    }
};