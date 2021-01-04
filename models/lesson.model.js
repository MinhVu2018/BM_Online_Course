const db = require("../utils/db");

module.exports = {
    async getLessonByID(courseid) {
        const sql = `select * from CourseDetail where CourseID= '${courseid}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    }
}