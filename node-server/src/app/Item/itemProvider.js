const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");
const itemDao = require("./itemDao");

// Provider: Read 비즈니스 로직 처리

exports.getItemByCategory = async function (category) {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryIdRow = await itemDao.selectCategoryId(connection, category);
    const categoryId = categoryIdRow[0].id;
    const itemByCategory = await itemDao.selectItemByCategory(connection, categoryId);
    connection.release();
    
    return itemByCategory;
};

exports.getItemByItempostId = async function (itempostId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const itempostRow = await itemDao.selectItempostById(connection, itempostId);
    const itemId = itempostRow[0].item;
    const sellerUserIdx = itempostRow[0].seller;
    const itemByItempostId = await itemDao.selectItemByItempostId(connection, itemId, sellerUserIdx);
    connection.release();
    
    return itemByItempostId;
};

exports.getCategory = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryRows = await itemDao.selectCategory(connection);
    connection.release();
    
    return categoryRows;
};