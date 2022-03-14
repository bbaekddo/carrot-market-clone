const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");
const neighborhoodDao = require("./neighborhoodDao");

// Provider: Read 비즈니스 로직 처리

exports.getNeighborhoodByTopic = async function (topic) {
    const connection = await pool.getConnection(async (conn) => conn);
    const topicIdRow = await neighborhoodDao.selectTopicId(connection, topic);
    const topicId = topicIdRow[0].id;
    const neighborhoodByTopic = await neighborhoodDao.selectNeighborhoodByTopic(connection, topicId);
    connection.release();
    
    return neighborhoodByTopic;
};

exports.getNeighborhoodById = async function (neighborhoodId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const neighborhoodById = await neighborhoodDao.selectNeighborhoodById(connection, neighborhoodId);
    connection.release();
    
    return neighborhoodById;
};

exports.getTopic = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const topic = await neighborhoodDao.selectAllTopic(connection);
    connection.release();
    
    return topic;
};

exports.getImageById = async function (imageId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const image = await neighborhoodDao.selectImageById(connection, imageId);
    connection.release();
    
    return image;
};