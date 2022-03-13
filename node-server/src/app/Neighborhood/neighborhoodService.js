const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./neighborhoodProvider");
const userDao = require("./neighborhoodDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {errResponse} = require("../../../config/response");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (id, password, name, nickname, location) {
    try {
        // ID 중복 확인
        const idRows = await userProvider.getUserById(id);
        if (idRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_ID);
        }
        
        // 닉네임 중복 확인
        const nickNameRows = await userProvider.getUserByNickname(nickname);
        if (nickNameRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }
        
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        
        const connection = await pool.getConnection(async (conn) => conn);
        
        try{
            await connection.beginTransaction();
            // 사용자 위치1 생성 후 Location id 값 받기
            const userLocation1 = await userDao.insertUserLocation(connection, location);
            // 사용자 위치2는 미정으로 생성 후 Location id 값 받기
            const userLocation2 = await userDao.insertUserLocation(connection, 1);
            // 사용자 프로필 사진 id 값 받기
            const userProfileImg = await userDao.insertUserImage(connection);
            // 사용자 정보 생성 배열
            const userParams = [id, hashedPassword, name, nickname, userProfileImg, userLocation1, userLocation2];
            // 사용자 생성
            await userDao.insertUser(connection, userParams);
            await connection.commit();
            
            return {'id': id, 'nickname': nickname};
        } catch (err) {
            await connection.rollback();
            
            return err;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.signInUser = async function (id, password) {
    try {
        // ID 확인
        const userRows = await userProvider.getUserById(id);
        if (userRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_ID_WRONG);
        }
    
        // 비밀번호 암호화 (비교용)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        
        // 비밀번호 확인
        const passwordCheck = await userProvider.getPassword(id);
        if (passwordCheck !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
    
        // 계정 상태 확인
        const statusCheck = userRows[0].status;
        if (statusCheck === 'STOP') {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (statusCheck === 'DELETED') {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        // JWT 발급
        const token = await jwt.sign(
            {
                // idRows에서 가져온 사용자 정보 활용
                userIdx: userRows[0].idx,
            },
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            }
        );

        return {'userIdx': userRows[0].idx, 'jwt': token};
    } catch (err) {
        logger.error(`App - signInUser Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userIdx, oldPassword, newPassword, nickname) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 사용자 정보
        const userRows = await userProvider.getUserByIdx(userIdx);
        // 비밀번호 암호화 (비교용)
        const hashedOldPassword = await crypto
            .createHash("sha512")
            .update(oldPassword)
            .digest("hex");
        
        // 비밀번호 암호화 (새 비밀번호 입력)
        const hashedNewPassword = await crypto
            .createHash("sha512")
            .update(newPassword)
            .digest("hex");
        
        // 비밀번호 확인
        const userId = userRows[0].id;
        const passwordCheck = await userProvider.getPassword(userId);
        if (passwordCheck !== hashedOldPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        
        // 닉네임 중복확인
        const userNicknameRows = await userProvider.getUserByNickname(nickname);
        if (userNicknameRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }
        
        // 사용자 정보 수정
        const userParams = [hashedNewPassword, nickname, userIdx];
        await userDao.updateUser(connection, userParams);
        connection.release();
        
        return {'userIdx': userIdx, 'nickname': nickname};
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteUser = async function (userIdx, password) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 사용자 정보
        const userRows = await userProvider.getUserByIdx(userIdx);
        // 비밀번호 암호화 (비교용)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
    
        // 비밀번호 확인
        const userId = userRows[0].id;
        const passwordCheck = await userProvider.getPassword(userId);
        if (passwordCheck !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        
        // 계정 상태 확인
        const userStatus = userRows[0].status;
        if (userStatus === 'DELETED') {
            return errResponse(baseResponse.DELETE_WITHDRAWAL_ACCOUNT);
        }
        
        // 사용자 정보 삭제
        await userDao.deleteUser(connection, userIdx);
        connection.release();
        
        return {'userIdx': userIdx};
    } catch (err) {
        logger.error(`App - deleteUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserImage = async function (userIdx, data) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        // 현재 사용자 정보
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        // 프로핈 사진 수정
        const imageId = userRows[0].profileImg;
        await userDao.updateImage(connection, imageId, data);
        connection.release();
    
        return {'userIdx': userIdx, 'imageId': imageId};
        // connection2.release();
    } catch (err) {
        logger.error(`App - editUserImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteUserImage = async function (userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        // 현재 사용자 정보
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        // 프로핈 사진 삭제
        const imageId = userRows[0].profileImg;
        const data = null;
        await userDao.updateImage(connection, imageId, data);
        connection.release();
        
        return {'userIdx': userIdx, 'imageId': imageId};
        // connection2.release();
    } catch (err) {
        logger.error(`App - deleteUserImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}