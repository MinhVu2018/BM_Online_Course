const db = require("../utils/db");
const { paginate } = require('../config/default.json');

module.exports = {
    async singleByID(id) {
        const sql = `select * from Courses where CourseID= '${id}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async allCourse() {
        const sql = `select * from Courses`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async relativeCourses(courseid, cate) {
        const sql = `select * from Courses where CourseID != '${courseid}' and Category = '${cate}' order by NumberStudent DESC limit 5`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async addCourse(course) {
        const [result, fields] = await db.add(course, 'Courses');
        return result;
    },
    
    async numStudent(id) {
        const sql = `select NumberStudent from Courses where CourseID = '${id}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async updateStudent(num, id) {
        const sql = `update Courses set NumberStudent = '${num}' where CourseID = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    //current view of a course
    async numView(id) {
        const sql = `select View from Courses where CourseID = '${id}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async updateView(id, view) {
        const sql = `update Courses set View = '${view}' where CourseID = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    //total course number
    async numberCourse() {
        const sql = `select * from Courses`;
        const [rows, fields] = await db.load(sql);
        return rows.length;
    },
    
    async sortHighlight() {
        const sql = `select * from Courses order by Preview DESC limit 5`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    async sortByDate() {
        const sql = `select * from Courses order by DateStart DESC limit 10`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    async sortByView() {
        const sql = `select * from Courses order by View DESC limit 10`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    async sortCategory() {
        const sql = `select Category, sum(NumberStudent) from Courses group by Category order by sum(NumberStudent) DESC limit 2`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    //get list of product depend on category
    async getByCategory(catId) {
        const sql = `select * from Courses where Category = ${catId}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    async pageByCat(catId, offset) {
        const sql = `select * from Courses where Category = ${catId} limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async updatePreview(id, new_preview, new_number) {
        const sql = `update Courses set Preview = '${new_preview}', NumPreview = '${new_number}' where CourseID = '${id}'`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async getByTeacher(teacher) {
        const sql = `select * from Courses where Teacher = '${teacher}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

    async pageByTeacherCourses(teacher, offset) {
        const sql = `select * from Courses where Teacher = '${teacher}' limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async update(id, status, des, detail_des) {
        const sql = `update Courses set Status = '${status}', Description = '${des}', DetailDescription = '${detail_des}', Status = '${status}' where CourseID = '${id}'`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
}