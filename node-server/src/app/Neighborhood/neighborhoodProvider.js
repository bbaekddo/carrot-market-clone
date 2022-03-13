const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");
const userDao = require("./neighborhoodDao");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 비즈니스 로직 처리

exports.getUserList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectAllUser(connection);
    connection.release();
    
    return userListResult;
};

exports.getUserByIdx = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdxResult = await userDao.selectUserByIdx(connection, userIdx);
    connection.release();
    
    return userIdxResult;
};

exports.getUserById = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdResult = await userDao.selectUserById(connection, userId);
    connection.release();
    
    return userIdResult;
};

exports.getUserByNickname = async function (userNickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userNicknameResult = await userDao.selectUserByNickname(connection, userNickname);
    connection.release();
    
    return userNicknameResult;
};

exports.getImageByUserIdx = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    // 사용자 Idx 확인
    const userRows = await userDao.selectUserByIdx(connection, userIdx);
    if (userRows.length < 1) {
        return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
    }
    
    // 프로필 사진 데이터 불러오기
    const imageId = userRows[0].profileImg;
    const imageResult = await userDao.selectImageByImageId(connection, imageId);
    connection.release();
    
    return imageResult;
};

exports.getPassword = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordResult = await userDao.selectPasswordById(
        connection,
        userId
    );
    connection.release();
    
    return passwordResult;
};