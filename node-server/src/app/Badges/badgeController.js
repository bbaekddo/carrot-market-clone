const badgeProvider = require("../../app/Badges/badgeProvider");
const badgeService = require("../../app/Badges/badgeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 활동 배지 생성
 * [POST] /app/badges
 */
exports.postBadges = async function (req, res) {
    const {userIdx, badgeType} = req.body;

    // 빈 값 체크
    /*if (!userIdx)
        return res.send(errResponse(baseResponse.SIGNUP_ID_EMPTY));

    if (!badgeType)
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    // 문자열 체크 (특수문자 포함 여부)
    if (containsSpecialChars(userIdx))
        return res.send(errResponse(baseResponse.SIGNUP_ID_CHARACTER));
    if (containsSpecialChars(badgeType))
        return res.send(errResponse(baseResponse.SIGNUP_NAME_CHARACTER));
*/
    const createBadgeResponse = await badgeService.createBadge(
        userIdx,
        badgeType
    );

    return res.send(createBadgeResponse);
};

/**
 * API No. 2
 * API Name : 전체 사용자 조회
 * [GET] /app/users
 */
exports.getBadges = async function (req, res) {

    const goldBadge = req.query.check-gold;

    if (!goldBadge) {
        // 배지 전체 조회
        const badgeList = await badgeProvider.retrieveBadgeList();

        return res.send(response(baseResponse.SUCCESS, badgeList));

    } else {
        // 황금배지 여부로 배지 조회
        const badgeListByGoldBadge = await badgeProvider.retrieveBadgeListByGoldBadge(goldBadge);
        return res.send(response(baseResponse.SUCCESS, badgeListByGoldBadge));
    }
};

/**
 * API No. 3
 * API Name : 특정 id로 사용자 조회
 * [GET] /app/users/:userId
 */
exports.getBadgeByUserIdx = async function (req, res) {

    const userIdx = req.params.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const badgeByUserIdx = await badgeProvider.retrieveBadgeByIdx(userIdx);

    return res.send(response(baseResponse.SUCCESS, badgeByUserIdx));
};

/**
 * API No. 4
 * API Name : 특정 배지 수정/삭제
 * [PATCH] /app/badges/:badgeId
 */
exports.patchBadges = async function (req, res) {

    const badgeId = req.params.badgeId;
    const {badgeType, goldBadge, status} = req.body;

    const editBadgeResponse = await badgeService.editBadge(
        badgeId,
        badgeType,
        goldBadge,
        status
    );

    return res.send(editBadgeResponse);
    // }
};

/**
 * API No. 5
 * API Name : 배지 종류 생성
 * [POST] /app/badges/types
 */
exports.postBadgeTypes = async function (req, res) {
    const {name, content, image} = req.body;

    const createBadgeTypeResponse = await badgeService.createBadgeType(
        name,
        content,
        image
    );

    return res.send(createBadgeTypeResponse);
};


/**
 * API No. 6
 * API Name : 배지 종류 조회
 * [GET] /app/badges/types
 */
exports.getBadgeTypes = async function (req, res) {

    // 배지 종류 전체 조회
    const badgeTypeList = await badgeProvider.retrieveBadgeTypeList();

    return res.send(response(baseResponse.SUCCESS, badgeTypeList));

};

/**
 * API No. 7
 * API Name : 특정 배지 종류 수정/삭제
 * [PATCH] /app/badges/types/:badgeType
 */
exports.patchBadgeTypes = async function (req, res) {

    const badgeTypeId = req.params.badgeType;
    const {name, content, image, status} = req.body;

    const editBadgeTypeResponse = await badgeService.editBadgeType(
        badgeTypeId,
        name,
        content,
        image,
        status
    );

    return res.send(editBadgeTypeResponse);
    // }
};

/**
 * API No. 8
 * API Name : 배지 사진 생성
 * [POST] /app/badges/imagees
 */
exports.postBadgeImages = async function (req, res) {

    const data = req.body;

    const createBadgeImageResponse = await badgeService.createBadgeImage(data);

    return res.send(createBadgeImageResponse);
};


/**
 * API No. 9
 * API Name : 배지 사진 조회
 * [GET] /app/badges/images
 */
exports.getBadgeImages = async function (req, res) {

    // 배지 사진 전체 조회
    const badgeImageList = await badgeProvider.retrieveBadgeImageList();

    return res.send(response(baseResponse.SUCCESS, badgeImageList));

};

/**
 * API No. 10
 * API Name : 특정 배지 사진 수정/삭제
 * [PATCH] /app/badges/images/:badgeIamge
 */
exports.patchBadgeImages = async function (req, res) {

    const badgeImageId = req.params.badgeImage;
    const data = req.body;

    const editBadgeImageResponse = await badgeService.editBadgeImage(
        badgeImageId,
        data
    );

    return res.send(editBadgeImageResponse);
    // }
};