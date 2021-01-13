const db = require("../utils/db");

module.exports = {
    async singleByUserName(username) {
        const sql = `select * from Users where Username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
        return null;
  
        return rows[0];
    },
    
    async singleByEmail(email) {
        const sql = `select * from Users where Email = '${email}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async allUser() {
        const sql = `select * from Users`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
          return null;
        return rows;
    },

    async updateType(username, type) {
        const [result, fields] = await db.update(type, 'Type', username, 'Users');
        return result;
    },
    async add(user) {
        const [result, fields] = await db.add(user, 'Users');
        return result;
    },

    async updateName(username, name) {
        const [result, fields] = await db.update(name, 'Name', username, 'Users');
        return result;
    },

    async updateEmail(username, email) {
        const [result, fields] = await db.update(email, 'Email', username, 'Users');
        return result;
    },

    async updatePass(username, pass) {
        const [result, fields] = await db.update(pass, 'Password', username, 'Users');
        return result;
    },

    async deleteUser(username) {
        const sql = `delete from Users where Username = '${username}'`;
        const [result, fields] = await db.load(sql);
        return result;
    },

    async listType(type) {
        const sql = `select * from Users where Type = '${type}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
          return null;
    
        return rows;
    } 
  };