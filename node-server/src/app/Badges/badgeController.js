const badgeProvider = require("../../app/Badges/badgeProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : User Index로 활동 배지 조회
 * [GET] /app/badges
 */
exports.getBadgeByUserIdx = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    
    // 빈 값 체크
    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }
    
    const badgeByUserIdx = await badgeProvider.getBadgeByUserIdx(userIdx);
    if (badgeByUserIdx.length <1) {
        return res.send(errResponse(baseResponse.USER_USERIDX_NOT_MATCH));
    }
    
    return res.send(response(baseResponse.GET_SUCCESS, badgeByUserIdx));
};