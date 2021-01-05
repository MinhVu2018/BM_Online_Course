const db = require("../utils/db");

module.exports = {
    async getLessonLearned(username, courseid) {
        const sql = `select * from UserLessonLearn where CourseID= '${courseid}' and Username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async updateLearnLesson(lesson) {
        const [result, fields] = await db.add(lesson, 'UserLessonLearn');
        return result;
    },

    async checkExist(lesson) {
        const sql = `select * from UserLessonLearn where Username = '${lesson.Username}' and CourseID = '${lesson.CourseID}' and Lesson = '${lesson.Lesson}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    }
}