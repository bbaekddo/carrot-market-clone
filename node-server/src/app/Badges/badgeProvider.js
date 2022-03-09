// const { pool } = require("../../../config/database");
// const {logger} = require("../../../config/winston");
//
// const badgeDao = require("./badgeDao");
//
// // Provider: Read 비즈니스 로직 처리
//
// exports.retrieveBadgeList = async function () {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const badgeListResult = await badgeDao.selectBadge(connection);
//     connection.release();
//
//     return badgeListResult;
// };
//
// exports.retrieveBadgeListByGoldBadge = async function (goldBadge) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const goldBadgeResult = await badgeDao.selectGoldBadge(connection, goldBadge);
//   connection.release();
//
//   return goldBadgeResult;
// };
//
// // 사용 안함
// exports.retrieveBadgeByUserIdx = async function (userIdx) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userIdxResult = await badgeDao.selectBadgeUserIdx(connection, userIdx);
//     connection.release();
//
//     return userIdxResult;
// };
//
// exports.retrieveBadgeTypeList = async function (userName) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListByNameResult = await badgeDao.selectUserName(connection, userName);
//     connection.release();
//
//     return userListByNameResult;
// };
//
//
// exports.retrieveUserListByStatus = async function (userStatus) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListByStatusResult = await badgeDao.selectUserStatus(connection, userStatus);
//     connection.release();
//
//     return userListByStatusResult;
// };
//
// exports.userIdCheck = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userIdCheckResult = await badgeDao.selectUserIdCheck(connection, userId);
//   connection.release();
//
//   return userIdCheckResult;
// };
//
// exports.userNicknameCheck = async function (userNickname) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userNicknameCheckResult = await badgeDao.selectUserNicknameCheck(connection, userNickname);
//     connection.release();
//
//     return userNicknameCheckResult;
// };
//
// exports.retrieveUserImageList = async function () {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userImageListResult = await badgeDao.selectUserImage(connection);
//     connection.release();
//
//     return userImageListResult;
// };
//
// exports.retrieveUserImageListByImageId = async function (userImageId) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userImageListByImageId = await badgeDao.selectUserImageByImageId(connection, userImageId);
//     connection.release();
//
//     return userImageListByImageId;
// };
//
// exports.retrieveUserLocationList = async function () {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userLocationListResult = await badgeDao.selectUserLocation(connection);
//     connection.release();
//
//     return userLocationListResult;
// };
//
// exports.retrieveUserLocationListByLocationId = async function (userLocationId) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userLocationListByLocationId = await badgeDao.selectUserLocationByLocationId(connection, userLocationId);
//     connection.release();
//
//     return userLocationListByLocationId;
// };
