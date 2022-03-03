const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// 특수문자 포함 여부 검증
function containsSpecialChars(str) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

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
        return res.send(response(baseResponse.SIGNUP_ID_EMPTY));
    
    if (!pswd)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    
    if (!name)
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    
    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    // 길이 체크
    if (id.length > 20)
        return res.send(response(baseResponse.SIGNUP_ID_LENGTH));
    
    if (pswd.length < 8 || pswd.length > 20)
        return res.send(response(baseResponse.SIGNUP_ID_LENGTH));
    
    if (name.length > 10)
        return res.send(response(baseResponse.SIGNUP_NAME_LENGTH));
    
    if (nickname.length > 20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    
    // 문자열 체크 (특수문자 포함 여부)
    if (containsSpecialChars(id))
        return res.send(response(baseResponse.SIGNUP_ID_CHARACTER));
    if (containsSpecialChars(name))
        return res.send(response(baseResponse.SIGNUP_NAME_CHARACTER));
    if (containsSpecialChars(nickname))
        return res.send(response(baseResponse.SIGNUP_NICKNAME_CHARACTER));


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

    /**
     * Query String: idx
     */
    const idx = req.query.idx;

    if (!idx) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByIdx = await userProvider.retrieveUserList(idx);
        return res.send(response(baseResponse.SUCCESS, userListByIdx));
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
 * API Name : 특정 이름으로 사용자 조회
 * [GET] /app/users/?name=userName
 */
exports.getUserByName = async function (req, res) {
    
    /**
     * Query String: userName
     */
    const userName = req.query.userName;
    
    if (!userName) {
        return res.send(errResponse(baseResponse.USER_USERNAME_EMPTY));
    } else {
        // 이름별 사용자 검색 조회
        const userListByName = await userProvider.retrieveUserListByName(userName);
        return res.send(response(baseResponse.SUCCESS, userListByName));
    }
};

/**
 * API No. 6
 * API Name : 특정 상태로 사용자 조회
 * [GET] /app/users/?status=userStatus
 */
exports.getUserByStatus = async function (req, res) {
    
    /**
     * Query String: userStatus
     */
    const userStatus = req.params.userStatus;
    
    if (!userStatus) return res.send(errResponse(baseResponse.USER_USERSTATUS_EMPTY));
    
    const userByUserStatus = await userProvider.retrieveUser(userStatus);
    return res.send(response(baseResponse.SUCCESS, userByUserStatus));
};

/**
 * API No. 7
 * API Name : 특정 사용자 수정/삭제
 * [PATCH] /app/users/:userIdx
 */
exports.patchUsers = async function (req, res) {
    
    // jwt - userIdx, path variable :userIdx
    
    // const userIdxFromJWT = req.verifiedToken.userIdx;
    
    const userIdx = req.params.userIdx;
    const userId = req.body.id;
    const userPswd = req.body.pswd;
    const userName = req.body.name;
    const userNickname = req.body.nickname;
    
    // if (userIdFromJWT != userId) {
    //     res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // } else {
    //     if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
    
    const editUserInfo = await userService.editUser(userIdx, userId, userPswd, userName, userNickname);
    
    return res.send(editUserInfo);
    // }
};

/**
 * API No. 8
 * API Name : 사용자 프로필 사진 생성
 * [POST] /app/users/images
 */
exports.postImages = async function (req, res) {
    
    /**
     * Body: data
     */
    const data = req.body;
    
    // 형식 체크 (by 정규표현식)
    if (typeof data != 'string')
        return res.send(response(baseResponse.USER_IMAGE_NOT_MATCH));
    
    const imageUpResponse = await userService.createUserImage(
        data
    );
    
    return res.send(imageUpResponse);
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
    const userImageId = req.query.id;
    
    if (!userImageId) {
        // 프로필 사진 전체 조회
        const userImageListResult = await userProvider.retrieveUserImageList();
        return res.send(response(baseResponse.SUCCESS, userImageListResult));
    } else {
        // 프로필 사진 검색 조회
        const userImageListByImageId = await userProvider.retrieveUserImageList(userImageId);
        return res.send(response(baseResponse.SUCCESS, userImageListByImageId));
    }
};

/**
 * API No. 10
 * API Name : 특정 사용자 프로필 사진 수정/삭제
 * [PUT] /app/users/images/:imageId
 */
exports.putImages = async function (req, res) {
    
    const userImageId = req.params.userImageId;
    const userImageData = req.body.data;
    
    const editUserImage = await userService.editUserImage(userImageData);
    
    return res.send(editUserImage);
};

/**
 * API No. 11
 * API Name : 사용자 위치 정보 생성
 * [POST] /app/users/locations
 */
exports.postLocations = async function (req, res) {
    
    /**
     * Body: auth, auth_count
     */
    const {auth, auth_count} = req.body;
    
    // 형식 체크 (by 정규표현식)
    if (auth !== 'N' || auth !== 'Y')
        return res.send(response(baseResponse.USER_LOCATION_AUTH_NOT_MATCH));
    if (auth_count < 0 || typeof auth_count != 'number')
        return res.send(response(baseResponse.USER_LOCATION_AUTH_COUNT_NOT_MATCH));
    
    const locationUpResponse = await userService.createUserLocation(
        auth,
        auth_count
    );
    
    return res.send(locationUpResponse);
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
    const userLocationId = req.query.id;
    
    if (!userLocationId) {
        //  사용자 위치 전체 조회
        const userLocationListResult = await userProvider.retrieveUserLocationList();
        return res.send(response(baseResponse.SUCCESS, userLocationListResult));
    } else {
        // 사용자 위치 검색 조회
        const userLocationListByLocationId = await userProvider.retrieveUserLocationList(userLocationId);
        return res.send(response(baseResponse.SUCCESS, userLocationListByLocationId));
    }
};

/**
 * API No. 13
 * API Name : 특정 사용자 위치 정보 수정/삭제
 * [GET] /app/users/locations/:locationId
 */
exports.patchLocations = async function (req, res) {
    
    const locationId = req.params.locationId;
    const locationAuth = req.body.auth;
    const locationAuthCount = req.body.auth_count;
    
    const editUserLocation = await userService.editUserLocation(locationAuth, locationAuthCount);
    
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

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
