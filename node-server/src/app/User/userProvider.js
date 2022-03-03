const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (idx) {
  if (!idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserIndex(connection, idx);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUserById = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userIdResult[0];
};

exports.retrieveUserByNickname = async function (userNickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userNicknameResult = await userDao.selectUserNickname(connection, userNickname);
    connection.release();
    
    return userNicknameResult[0];
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
