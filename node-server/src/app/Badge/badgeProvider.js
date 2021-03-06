const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");
const badgeDao = require("./badgeDao");

exports.getBadgeByUserIdx = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const badgeResult = await  badgeDao.selectBadgeByUserIdx(connection, userIdx);
    connection.release();
    
    return badgeResult;
}