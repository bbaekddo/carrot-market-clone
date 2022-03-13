const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 특수문자 포함 여부 검증
function containsSpecialChars(str) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

/*
 * API No. 1
 * API Name : 사용자 생성 (회원가입)
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    const {id, password, name, nickname, location} = req.body;

    // 빈 값 체크
    if (!id) {
        return res.send(errResponse(baseResponse.SIGNUP_ID_EMPTY));
    }
    
    if (!password) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    }
    
    if (!name) {
        return res.send(errResponse(baseResponse.SIGNUP_NAME_EMPTY));
    }
    
    if (!nickname) {
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
    }
    
    // 길이 체크
    if (id.length > 20) {
        return res.send(errResponse(baseResponse.SIGNUP_ID_LENGTH));
    }
    
    if (password.length < 8 || password.length > 20) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
    }
    
    if (name.length > 10) {
        return res.send(errResponse(baseResponse.SIGNUP_NAME_LENGTH));
    }
    
    if (nickname.length > 20) {
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_LENGTH));
    }
    
    // 문자열 체크 (특수문자 포함 여부)
    if (containsSpecialChars(id)) {
        return res.send(errResponse(baseResponse.SIGNUP_ID_CHARACTER));
    }
    if (containsSpecialChars(name)) {
        return res.send(errResponse(baseResponse.SIGNUP_NAME_CHARACTER));
    }
    if (containsSpecialChars(nickname)) {
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_CHARACTER));
    }


    const signUpResponse = await userService.createUser(
        id,
        password,
        name,
        nickname,
        location
    );
    
    // 사용자 생성 실패
    if (signUpResponse.isSuccess === false) {
        return res.send(signUpResponse);
    }

    // 사용자 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, signUpResponse));
};

/*
 * API No. 2
 * API Name : 사용자 로그인 (JWT 생성)
 * [POST] /app/login
 */
exports.login = async function (req, res) {
    const {id, password} = req.body;
    
    // 빈 값 체크
    if (!id) {
        return res.send(errResponse(baseResponse.SIGNIN_ID_EMPTY));
    }
    
    if (!password) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
    }
    
    const signInResponse = await userService.signInUser(id, password);
    
    // 사용자 로그인 실패
    if (signInResponse.isSuccess === false) {
        return res.send(signInResponse);
    }
    
    // 사용자 로그인 성공
    return res.send(response(baseResponse.POST_SUCCESS, signInResponse));
};

/*
 * API No. 3
 * API Name : 전체 사용자 조회 + nicknmae으로 사용자 조회
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {
    const userNickname = req.query.nickname;
    
    if (!userNickname) {
        // 사용자 전체 조회
        const userList = await userProvider.getUserList();
    
        return res.send(response(baseResponse.GET_SUCCESS, userList));
    } else {
        const userByNickname = await userProvider.getUserByNickname(userNickname);
        
        // 사용자 조회 실패
        if (userByNickname.length < 1) {
            return res.send(errResponse(baseResponse.USER_USERNICKNAME_NOT_EXIST));
        }
        
        // 사용자 조회 성공
        return res.send(response(baseResponse.GET_SUCCESS, userByNickname));
    }
};

/*
 * API No. 4
 * API Name : 특정 index로 사용자 조회
 * [GET] /app/users/:userIdx
 */
exports.getUserByIdx = async function (req, res) {
    const userIdx = req.params.userIdx;

    const userByUserIdx = await userProvider.getUserByIdx(userIdx);
    
    // 사용자 조회 실패
    if (userByUserIdx.length < 1) {
        return res.send(errResponse(baseResponse.USER_USERIDX_NOT_MATCH));
    }
    
    // 사용자 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, userByUserIdx));
};

/*
 * API No. 5
 * API Name : 특정 사용자 수정
 * [PATCH] /app/users/:userIdx
 */
exports.patchUsers = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {oldPassword, newPassword, nickname} = req.body;
    
    const editUser = await userService.editUser(
        userIdx,
        oldPassword,
        newPassword,
        nickname,
    );
    // 사용자 수정 실패
    if (editUser.isSuccess === false) {
        return res.send(errResponse(editUser));
    }
    
    // 사용자 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editUser));
};

/*
 * API No. 6
 * API Name : 특정 사용자 삭제
 * [PUT] /app/users/:userIdx
 */
exports.deleteUsers = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {password} = req.body;
    
    const deleteUser = await userService.deleteUser(
        userIdx,
        password,
    );
    // 사용자 삭제 실패
    if (deleteUser.isSuccess === false) {
        return res.send(deleteUser);
    }
    
    // 사용자 삭제 성공
    return res.send(response(baseResponse.PUT_SUCCESS, deleteUser));
};


/*
 * API No. 7
 * API Name : 특정 사용자 프로필 사진 조회
 * [GET] /app/users/:userIdx/images
 */
exports.getImages = async function (req, res) {
    const userIdx = req.params.userIdx;
    
    const imageByUserIdx = await userProvider.getImageByUserIdx(userIdx);
    
    // 프로필 사진 조회 실패
    if (imageByUserIdx.isSuccess === false) {
        return res.send(imageByUserIdx);
    }
    
    // 프로필 사진 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, imageByUserIdx));
};

/*
 * API No. 8
 * API Name : 특정 사용자 프로필 사진 수정
 * [PUT] /app/users/:userIdx/images
 */
exports.patchImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {data} = req.body;
    
    const editUserImage = await userService.editUserImage(
        userIdx,
        data
    );
    // 프로필 사진 수정 실패
    if (editUserImage.isSuccess === false) {
        return res.send(editUserImage);
    }
    
    // 프로필 사진 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editUserImage));
};


/*
 * API No. 9
 * API Name : 특정 사용자 프로필 사진 삭제
 * [PUT] /app/users/:userIdx/images
 */
exports.deleteImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    
    const deleteUserImage = await userService.deleteUserImage(
        userIdx,
    );
    // 프로필 사진 삭제 실패
    if (deleteUserImage.isSuccess === false) {
        return res.send(deleteUserImage);
    }
    
    // 프로필 사진 삭제 성공
    return res.send(response(baseResponse.PUT_SUCCESS, deleteUserImage));
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS), userIdResult);
// };