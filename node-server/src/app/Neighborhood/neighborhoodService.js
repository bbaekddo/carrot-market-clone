const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const neighborhoodProvider = require("./neighborhoodProvider");
const userProvider = require("../User/userProvider");
const neighborhoodDao = require("./neighborhoodDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createNeighborhood = async function (userIdx, location, content, topic) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        // 사용자 확인
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        
        // 위치 조회 후 Location id 값 받기
        const locationIdRow = await neighborhoodDao.selectLocation(connection, location);
        if (locationIdRow.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_LOCATION_NOT_EXIST);
        }
        
        // 주제 조회 후 Topic id 값 받기
        const topicIdRow = await neighborhoodDao.selectTopicId(connection, topic);
        if (topicIdRow.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_TOPIC_NOT_EXIST);
        }
        
        // 동네 정보 생성
        const neighborhoodParams = [userIdx, locationIdRow[0].id, content, topicIdRow[0].id];
        const neighborhoodId = await neighborhoodDao.insertNeighborhood(connection, neighborhoodParams);
    
        connection.release();
        
        return {'user': userIdx, 'neighborhoodId': neighborhoodId};
    } catch (err) {
        logger.error(`App - createNeighborhood Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editNeighborhood = async function (userIdx, neighborhoodId, content, topic) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 동네 정보 확인
        const neighborhoodRows = await neighborhoodProvider.getNeighborhoodById(neighborhoodId);
        if (neighborhoodRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST);
        }
        
        // 작성자 확인
        const checkUserIdx = neighborhoodRows[0].userIdx;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.NEIGHBORHOOD_IDX_NOT_MATCH);
        }
        
        // 주제 조회 후 Topic id 값 받기
        const topicIdRow = await neighborhoodDao.selectTopicId(connection, topic);
        if (topicIdRow.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_TOPIC_NOT_EXIST);
        }
        const topicId = topicIdRow[0].id;
        
        // 동네 정보 수정
        const neighborhoodParams = [content, topicId, neighborhoodId];
        await neighborhoodDao.updateNeighborhood(connection, neighborhoodParams);
        connection.release();
        
        return {'userIdx': userIdx, 'neighborhoodId': neighborhoodId};
    } catch (err) {
        logger.error(`App - editNeighborhood Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteNeighborhood = async function (userIdx, neighborhoodId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 동네 정보 확인
        const neighborhoodRows = await neighborhoodProvider.getNeighborhoodById(neighborhoodId);
        if (neighborhoodRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST);
        }
    
        // 작성자 확인
        const checkUserIdx = neighborhoodRows[0].userIdx;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.NEIGHBORHOOD_IDX_NOT_MATCH);
        }
        
        // 동네 정보 상태 확인
        const checkNeighborhoodStatus = neighborhoodRows[0].status;
        if (checkNeighborhoodStatus !== 'RUN') {
            return errResponse(baseResponse.NEIGHBORHOOD_STATUS_NOT_MATCH);
        }
        
        // 동네 정보 삭제
        await neighborhoodDao.deleteNeighborhood(connection, neighborhoodId);
        connection.release();
    
        return {'userIdx': userIdx, 'neighborhoodId': neighborhoodId};
    } catch (err) {
        logger.error(`App - deleteNeighborhood Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createImage = async function (userIdx, neighborhoodId, data) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        // 현재 동네 정보 확인
        const neighborhoodRows = await neighborhoodProvider.getNeighborhoodById(neighborhoodId);
        if (neighborhoodRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST);
        }
    
        // 작성자 확인
        const checkUserIdx = neighborhoodRows[0].userIdx;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.NEIGHBORHOOD_IDX_NOT_MATCH);
        }
        
        // 동네 정보 사진 생성
        const imageParams = [neighborhoodId, data];
        await neighborhoodDao.insertImage(connection, imageParams);
        
        connection.release();
        
        return {'user': userIdx, 'neighborhoodId': neighborhoodId};
    } catch (err) {
        logger.error(`App - createImage Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editImage = async function (userIdx, imageId, data) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 사진 확인
        const imageRows = await neighborhoodProvider.getImageById(imageId);
        if (imageRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_IMAGE_NOT_EXIST);
        }
    
        // 현재 동네 정보 확인
        const checkNeighborhoodId = imageRows[0].post;
        const neighborhoodRows = await neighborhoodProvider.getNeighborhoodById(checkNeighborhoodId);
        if (neighborhoodRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST);
        }
    
        // 작성자 확인
        const checkUserIdx = neighborhoodRows[0].userIdx;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.NEIGHBORHOOD_IDX_NOT_MATCH);
        }
    
        // 동네 정보 사진 수정
        const editImageParams = [data, imageId];
        await neighborhoodDao.updateImage(connection, editImageParams);
    
        connection.release();
    
        return {'userIdx': userIdx, 'imageId': imageId};
    } catch (err) {
        logger.error(`App - editImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteImage = async function (userIdx, imageId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 사진 확인
        const imageRows = await neighborhoodProvider.getImageById(imageId);
        if (imageRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_IMAGE_NOT_EXIST);
        }
    
        // 현재 동네 정보 확인
        const checkNeighborhoodId = imageRows[0].post;
        const neighborhoodRows = await neighborhoodProvider.getNeighborhoodById(checkNeighborhoodId);
        if (neighborhoodRows.length < 1) {
            return errResponse(baseResponse.NEIGHBORHOOD_ID_NOT_EXIST);
        }
    
        // 작성자 확인
        const checkUserIdx = neighborhoodRows[0].userIdx;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.NEIGHBORHOOD_IDX_NOT_MATCH);
        }
    
        // 동네 정보 사진 삭제
        await neighborhoodDao.deleteImage(connection, imageId);
    
        connection.release();
    
        return {'userIdx': userIdx, 'imageId': imageId};
    } catch (err) {
        logger.error(`App - deleteImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}