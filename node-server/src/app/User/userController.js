const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const {log} = require("winston");

// 특수문자 포함 여부 검증
function containsSpecialChars(str) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

/**
 * API No. 1
 * API Name : 사용자 생성 (회원가입)
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: id, pswd, name, nickname
     */
    const {id, pswd, name, nickname, location} = req.body;

    // 빈 값 체크
    if (!id)
        return res.send(errResponse(baseResponse.SIGNUP_ID_EMPTY));
    
    if (!pswd)
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    
    if (!name)
        return res.send(errResponse(baseResponse.SIGNUP_NAME_EMPTY));
    
    if (!nickname)
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    // 길이 체크
    if (id.length > 20)
        return res.send(errResponse(baseResponse.SIGNUP_ID_LENGTH));
    
    if (pswd.length < 8 || pswd.length > 20)
        return res.send(errResponse(baseResponse.SIGNUP_ID_LENGTH));
    
    if (name.length > 10)
        return res.send(errResponse(baseResponse.SIGNUP_NAME_LENGTH));
    
    if (nickname.length > 20)
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_LENGTH));
    
    // 문자열 체크 (특수문자 포함 여부)
    if (containsSpecialChars(id))
        return res.send(errResponse(baseResponse.SIGNUP_ID_CHARACTER));
    if (containsSpecialChars(name))
        return res.send(errResponse(baseResponse.SIGNUP_NAME_CHARACTER));
    if (containsSpecialChars(nickname))
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_CHARACTER));


    const signUpResponse = await userService.createUser(
        id,
        pswd,
        name,
        nickname,
        location
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 전체 사용자 조회
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {
    
    const userName = req.query.name;
    const userStatus = req.query.status;
    
    if (!userName) {
        if (!userStatus) {
            // 사용자 전체 조회
            const userList = await userProvider.retrieveUserList();
    
            return res.send(response(baseResponse.SUCCESS, userList));
            
        } else{
            // 계정 상태로 사용자 조회
            const userListByUserStatus = await userProvider.retrieveUserListByStatus(userStatus);
            
            return res.send(response(baseResponse.SUCCESS, userListByUserStatus));
            
        }
    } else {
        // 이름으로 사용자 조회
        const userListByName = await userProvider.retrieveUserListByName(userName);
        return res.send(response(baseResponse.SUCCESS, userListByName));
    }
};

/**
 * API No. 3
 * API Name : 특정 id로 사용자 조회
 * [GET] /app/users/:userId
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUserById(userId);
    
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 4
 * API Name : 특정 닉네임으로 사용자 조회
 * [GET] /app/users/:userNickname
 */
exports.getUserByNickname = async function (req, res) {
    
    /**
     * Path Variable: userNickname
     */
    const userNickname = req.params.userNickname;
    
    if (!userNickname) return res.send(errResponse(baseResponse.USER_USERNICKNAME_EMPTY));
    
    const userByUserNickname = await userProvider.retrieveUserByNickname(userNickname);
    return res.send(response(baseResponse.SUCCESS, userByUserNickname));
};

/**
 * API No. 5
 * API Name : 특정 사용자 수정/삭제
 * [PATCH] /app/users/:userIdx
 */
exports.patchUsers = async function (req, res) {
    
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const {id, password, name, nickname} = req.body;
    
    if (userIdxFromJWT !== Number(userIdx)) {
        return res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    
    const editUserInfo = await userService.editUser(
        userIdx,
        id,
        password,
        name,
        nickname
    );
    
    return res.send(editUserInfo);
};

/**
 * API No. 9
 * API Name : 전체/특정 사용자 프로필 사진 조회
 * [GET] /app/users/images
 */
exports.getImages = async function (req, res) {
    
    /**
     * Query String: userImageId
     */
    const userImageId = req.params.imageId;
    
    if (!userImageId) {
        // 프로필 사진 전체 조회
        const userImageListResult = await userProvider.retrieveUserImageList();
        return res.send(response(baseResponse.SUCCESS, userImageListResult));
    } else {
        // 프로필 사진 검색 조회
        const userImageListByImageId = await userProvider.retrieveUserImageListByImageId(userImageId);
        return res.send(response(baseResponse.SUCCESS, userImageListByImageId));
    }
};

/**
 * API No. 10
 * API Name : 특정 사용자 프로필 사진 수정/삭제
 * [PUT] /app/users/images/:imageId
 */
exports.patchImages = async function (req, res) {
    
    const userImageId = req.params.imageId;
    const userImageData = req.body.data;
    
    const editUserImage = await userService.editUserImage(userImageId, userImageData);
    
    return res.send(editUserImage);
};

/**
 * API No. 12
 * API Name : 전체/특정 사용자 위치 정보 조회
 * [GET] /app/users/locations
 */
exports.getLocations = async function (req, res) {
    
    /**
     * Query String: userLocationId
     */
    const userLocationId = req.params.locationId;
    
    if (!userLocationId) {
        //  사용자 위치 전체 조회
        const userLocationListResult = await userProvider.retrieveUserLocationList();
        return res.send(response(baseResponse.SUCCESS, userLocationListResult));
    } else {
        // 사용자 위치 검색 조회
        const userLocationListByLocationId = await userProvider.retrieveUserLocationListByLocationId(userLocationId);
        return res.send(response(baseResponse.SUCCESS, userLocationListByLocationId));
    }
};

/**
 * API No. 13
 * API Name : 특정 사용자 위치 정보 수정/삭제
 * [GET] /app/users/locations/:locationId
 */
exports.patchLocations = async function (req, res) {
    
    const userLocationId = req.params.locationId;
    const userLocation = req.body.location;
    const userLocationAuth = req.body.auth;
    const userLocationAuthCount = req.body.auth_count;
    
    const editUserLocation = await userService.editUserLocation(userLocationId, userLocation, userLocationAuth, userLocationAuthCount);
    
    return res.send(editUserLocation);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, password
 */
exports.login = async function (req, res) {

    const {id, password} = req.body;

    // TODO: id, password 형식적 Validation
    const signInResponse = await userService.postSignIn(id, password);

    return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS), userIdResult);
// };