const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();
    
    return userListResult;
};

exports.retrieveUserById = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userIdResult;
};

// 사용 안함
exports.retrieveUserByNickname = async function (userNickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userNicknameResult = await userDao.selectUserNickname(connection, userNickname);
    connection.release();
    
    return userNicknameResult;
};

exports.retrieveUserListByName = async function (userName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListByNameResult = await userDao.selectUserName(connection, userName);
    connection.release();
    
    return userListByNameResult;
};


exports.retrieveUserListByStatus = async function (userStatus) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListByStatusResult = await userDao.selectUserStatus(connection, userStatus);
    connection.release();
    
    return userListByStatusResult;
};

exports.userIdCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await userDao.selectUserIdCheck(connection, userId);
  connection.release();

  return userIdCheckResult;
};

exports.userNicknameCheck = async function (userNickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userNicknameCheckResult = await userDao.selectUserNicknameCheck(connection, userNickname);
    connection.release();
    
    return userNicknameCheckResult;
};

exports.retrieveUserImageList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const userImageListResult = await userDao.selectUserImage(connection);
    connection.release();
    
    return userImageListResult;
};

exports.retrieveUserImageListByImageId = async function (userImageId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userImageListByImageId = await userDao.selectUserImageByImageId(connection, userImageId);
    connection.release();
    
    return userImageListByImageId;
};

exports.retrieveUserLocationList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const userLocationListResult = await userDao.selectUserLocation(connection);
    connection.release();
    
    return userLocationListResult;
};

exports.retrieveUserLocationListByLocationId = async function (userLocationId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userLocationListByLocationId = await userDao.selectUserLocationByLocationId(connection, userLocationId);
    connection.release();
    
    return userLocationListByLocationId;
};
