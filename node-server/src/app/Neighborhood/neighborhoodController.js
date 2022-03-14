const neighborhoodProvider = require("../../app/Neighborhood/neighborhoodProvider");
const neighborhoodService = require("../../app/Neighborhood/neighborhoodService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/*
 * API No. 1
 * API Name : 동네 정보 생성
 * [POST] /app/neighborhoods
 */
exports.postNeighborhoods = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {location, content, topic} = req.body;

    // 빈 값 체크
    if (!location) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_LOCATION_EMPTY));
    }
    
    if (!content) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_CONTENT_EMPTY));
    }
    
    if (!topic) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_TOPIC_EMPTY));
    }
    
    // 길이 체크
    if (content.length > 20) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_CONTENT_LENGTH));
    }

    const postNeighborhoodResponse = await neighborhoodService.createNeighborhood(
        userIdx,
        location,
        content,
        topic
    );
    
    // 동네 정보 생성 실패
    if (postNeighborhoodResponse.isSuccess === false) {
        return res.send(postNeighborhoodResponse);
    }

    // 동네 정보 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, postNeighborhoodResponse));
};

/*
 * API No. 2
 * API Name : 특정 주제로 동네 정보 조회
 * [GET] /app/neighborhoods
 */
exports.getNeighborhoodsByTopic = async function (req, res) {
    const topic = req.query.topic;
    
    // 빈 값 체크
    if (!topic) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_TOPIC_EMPTY));
    }
    
    const neighborhoodByTopic = await neighborhoodProvider.getNeighborhoodByTopic(topic);
    
    // 동네 정보 조회 실패
    if (neighborhoodByTopic.length < 1) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_TOPIC_NOT_EXIST));
    }
    
    // 동네 정보 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, neighborhoodByTopic));
};

/*
 * API No. 3
 * API Name : id로 동네 정보 조회
 * [GET] /app/neighborhoods/:neighborhoodId
 */
exports.getNeighborhoods = async function (req, res) {
    const neighborhoodId = req.params.neighborhoodId;
    
    // 빈 값 체크
    if (!neighborhoodId) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_ID_EMPTY));
    }
    
    const getNeighborhood = await neighborhoodProvider.getNeighborhoodById(neighborhoodId);
    
    // 특정 동네 정보 조회 실패
    if (getNeighborhood.length < 1) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST));
    }
    
    // 특정 동네 정보 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, getNeighborhood));
};

/*
 * API No. 4
 * API Name : 동네 정보 수정
 * [PATCH] /app/neighborhoods/:neighborhoodId
 */
exports.patchNeighborhoods = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const neighborhoodId = req.params.neighborhoodId;
    const {content, topic} = req.body;
    
    const editNeighborhood = await neighborhoodService.editNeighborhood(
        userIdx,
        neighborhoodId,
        content,
        topic
    );
    // 동네 정보 수정 실패
    if (editNeighborhood.isSuccess === false) {
        return res.send(editNeighborhood);
    }
    
    // 동네 정보 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editNeighborhood));
};

/*
 * API No. 5
 * API Name : 동네 정보 삭제
 * [PUT] /app/neighborhoods/:neighborhoodId
 */
exports.deleteNeighborhoods = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const neighborhoodId = req.params.neighborhoodId;
    
    const deleteNeighborhood = await neighborhoodService.deleteNeighborhood(
        userIdx,
        neighborhoodId
    );
    // 동네 정보 삭제 실패
    if (deleteNeighborhood.isSuccess === false) {
        return res.send(deleteNeighborhood);
    }
    
    // 동네 정보 삭제 성공
    return res.send(response(baseResponse.DELETE_SUCCESS, deleteNeighborhood));
};

/*
 * API No. 6
 * API Name : 동네 정보 주제 조회
 * [GET] /app/neighborhoods/topics
 */
exports.getTopics = async function (req, res) {
    const getTopic = await neighborhoodProvider.getTopic();
    
    // 동네 정보 주제 조회 실패
    if (getTopic.isSuccess === false) {
        return res.send(getTopic);
    }
    
    // 동네 정보 주제 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, getTopic));
};

/*
 * API No. 7
 * API Name : 동네 정보 사진 생성
 * [POST] /app/neighborhoods/images
 */
exports.postImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const neighborhoodId = req.params.neighborhoodId;
    const {data} = req.body;
    
    // 빈 값 체크
    if (!neighborhoodId) {
        return res.send(errResponse(baseResponse.NEIGHBORHOOD_ID_EMPTY));
    }
    
    const postImage = await neighborhoodService.createImage(
        userIdx,
        neighborhoodId,
        data
    );
    
    // 동네 정보 사진 생성 실패
    if (postImage.isSuccess === false) {
        return res.send(postImage);
    }
    
    // 동네 정보 사진 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, postImage));
    
}

/*
 * API No. 8
 * API Name : 동네 정보 사진 수정
 * [PATCH] /app/neighborhoods/images
 */
exports.patchImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const imageId = req.params.imageId;
    const {data} = req.body;
    
    const editImage = await neighborhoodService.editImage(
        userIdx,
        imageId,
        data
    );
    // 동네 정보 사진 수정 실패
    if (editImage.isSuccess === false) {
        return res.send(editImage);
    }
    
    // 동네 정보 사진 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editImage));
};

/*
 * API No. 9
 * API Name : 동네 정보 사진 삭제
 * [PUT] /app/neighborhoods/images
 */
exports.deleteImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const imageId = req.params.imageId;
    
    const deleteImage = await neighborhoodService.deleteImage(
        userIdx,
        imageId
    );
    // 동네 정보 사진 삭제 실패
    if (deleteImage.isSuccess === false) {
        return res.send(deleteImage);
    }
    
    // 동네 정보 사진 삭제 성공
    return res.send(response(baseResponse.DELETE_SUCCESS, deleteImage));
};