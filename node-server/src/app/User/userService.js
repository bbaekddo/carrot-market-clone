const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (id, pswd, name, nickname, location) {
    try {
        // ID 중복 확인
        const idRows = await userProvider.userIdCheck(id);
        if (idRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_ID);
    
        // 닉네임 중복 확인
        const nickNameRows = await userProvider.userNicknameCheck(nickname);
        if (nickNameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        // 비밀번호 암호화
        // const hashedPassword = await crypto
        //     .createHash("sha512")
        //     .update(password)
        //     .digest("hex");
        const connection1 = await pool.getConnection(async (conn) => conn);
        const connection2 = await pool.getConnection(async (conn) => conn);
        const connection3 = await pool.getConnection(async (conn) => conn);
        const connection4 = await pool.getConnection(async (conn) => conn);
        // 사용자 위치1 생성 후 id 값 받기
        const userLocation1 = await userDao.insertUserLocation(connection1, location);
        // 사용자 위치2는 미정으로 생성 후 id 값 받기
        const userLocation2 = await userDao.insertUserLocation(connection2, 1);
        const userProfile_img = await userDao.insertUserImage(connection3);
        
        const insertUserInfoParams = [id, pswd, name, nickname, userProfile_img, userLocation1, userLocation2];
        const insertUserResult = await userDao.insertUserInfo(connection4, insertUserInfoParams);
        
        console.log(`추가된 사용자 Index : ${insertUserResult[0]}`)
    
        connection1.release();
        connection2.release();
        connection3.release();
        connection4.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
//
//         const selectEmail = emailRows[0].email
//
//         // 비밀번호 확인
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//
//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
//
//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }
//
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);
//
//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }
//
//         console.log(userInfoRows[0].id) // DB의 userId
//
//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

exports.editUser = async function (idx, id, pswd, name, nickname) {
    try {
        console.log(`수정할 사용자 : ${idx}`);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUser(connection, idx, id, pswd, name, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}