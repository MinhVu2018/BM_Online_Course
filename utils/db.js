const mysql = require('mysql2');
const mysql_opts = require('../config/default.json').mysql;

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
    load(sql) {
        return promisePool.query(sql); //return [rows, fields]
    },

    add(entity, table_name) {
        const sql = `insert into ${table_name} set ?`;
        return promisePool.query(sql, entity);
    },

    del(condition, table_name) {
        const sql = `delete from ${table_name} where ?`;
        return promisePool.query(sql, condition);
    }
}

