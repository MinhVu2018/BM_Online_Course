const db = require("../utils/db");

module.exports = {
    async allCate() {
        const sql = `select * from Category`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows;
    }
}