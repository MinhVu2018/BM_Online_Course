const db = require("../utils/db");

module.exports = {
    async getLessonByCourseID(courseid) {
        const sql = `select * from CourseDetail where CourseID= '${courseid}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },
    async singeLessonByID(courseid, lessonid) {
        const sql = `select * from CourseDetail where CourseID= '${courseid}' and Lesson = '${lessonid}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
}