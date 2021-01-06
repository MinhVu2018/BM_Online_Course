const { update } = require("../utils/db");
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
    },
    async addLesson(lesson) {
        const [result, fields] = await db.add(lesson, 'CourseDetail');
        return result;
    }, 
    async update(cid, lid, video) {
        const sql = `update CourseDetail set Video = '${video}' where CourseID = '${lid}' and Lesson = '${lid}'`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
}