const db = require("../utils/db");
const { paginate } = require('../config/default.json');

module.exports = {
    async singleByID(id) {
        const sql = `select * from Courses where CourseID = ${username}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async sortHighlight() {
        const sql = `select * from Courses order by Preview DESC limit 4`;
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
        const sql = `select Category, sum(NumberStudent) from Courses group by Category order by sum(NumberStudent) DESC`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) 
            return null;
        return rows;
    },

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
    }
}