const db = require("../utils/db");

module.exports = {
    async addComment(comment) {
        const [result, fields] = await db.add(comment, 'Comment');
        return result;
    },

    async checkExist(courseid, username) {
        const sql = `select * from Comment where Username = '${username}' and CourseID = '${courseid}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async newestComment(id) {
        const sql = `select * from Comment where CourseID = '${id}' order by Date DESC limit 5`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    }
}