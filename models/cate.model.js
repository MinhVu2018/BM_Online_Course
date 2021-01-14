const db = require("../utils/db");

module.exports = {
    async allCate() {
        const sql = `SELECT Categories.*, (SELECT COUNT(*) FROM Courses WHERE Courses.Category = Categories.CatId) AS NumCourses FROM Categories`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async getListCateName() {
        const sql = `select CatName from Categories`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async singleByCateName(catename) {
        const sql = `select * from Categories where CatName = '${catename}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async singleByCateId(cateid) {
        const sql = `select * from Categories where CatId = '${cateid}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async getId(catename) {
        const sql = `select CatId from Categories where CatName = '${catename}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0].CatId;
    },

    async lastCate() {
        const sql = `select CatId from Categories order by CatId DESC limit 1`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async add(cate) {
        const [result, fields] = await db.add(cate, 'Categories');
        return result;
    },

    async checkCateNumCourse(catename){
        const sql = `select count(*) as numCourses from Categories, Courses where CatName = '${catename}' && Categories.CatId = Courses.Category`;
        const [rows, fields] = await db.load(sql);
        return rows[0];
    },

    async deleteCate(catename){
        const sql = `delete from Categories where CatName = '${catename}'`;
        const [result, fields] = await db.load(sql);
        return result;
    },

    async updateName(cateid, catename){
        const sql = `update Categories set CatName = '${catename}' where CatId = '${cateid}'`;
        const [result, fields] = await db.load(sql);
        return result;
    },
}