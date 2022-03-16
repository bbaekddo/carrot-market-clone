const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const itemProvider = require("./itemProvider");
const userProvider = require("../User/userProvider");
const itemDao = require("./itemDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createItem = async function (userIdx, name, category, content, price, location, proposal) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        // 사용자 확인
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        
        // 위치 조회 후 Location id 값 받기
        const locationIdRow = await itemDao.selectLocation(connection, location);
        if (locationIdRow.length < 1) {
            return errResponse(baseResponse.ITEM_LOCATION_NOT_EXIST);
        }
        const locationId = locationIdRow[0].id;
        
        // 카테고리 조회 후 Category id 값 받기
        const categoryIdRow = await itemDao.selectCategoryId(connection, category);
        if (categoryIdRow.length < 1) {
            return errResponse(baseResponse.CATEGORY_NOT_EXIST);
        }
        const categoryId = categoryIdRow[0].id;
        
        try {
            await connection.beginTransaction();
    
            // 상품 생성
            const itemParams = [name, categoryId, content, price, locationId, proposal];
            const itemId = await itemDao.insertItem(connection, itemParams);
    
            // 상품 생성 후 게시글 생성
            const itempostId = await itemDao.insertItemPost(connection, itemId, userIdx);
            
            await connection.commit();
    
            return {'postId': itempostId, 'seller': userIdx, 'itemId': itemId};
        } catch (err) {
            await connection.rollback();
            
            return err;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`App - createItem Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editItem = async function (userIdx, itemId, name, category, content, price) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 상품 확인
        const itempostRow = await itemDao.selectItempostByItemId(connection, itemId);
        if (itempostRow.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
        
        // 작성자 확인
        const checkUserIdx = itempostRow[0].seller;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.ITEM_USER_NOT_MATCH);
        }
    
        // 카테고리 조회 후 Category id 값 받기
        const categoryIdRow = await itemDao.selectCategoryId(connection, category);
        if (categoryIdRow.length < 1) {
            return errResponse(baseResponse.CATEGORY_NOT_EXIST);
        }
        const categoryId = categoryIdRow[0].id;
       
        // 상품 수정
        const itemParams = [name, categoryId, content, price, itemId];
        await itemDao.updateItem(connection, itemParams);
        connection.release();
        
        return {'userIdx': userIdx, 'itemId': itemId};
    } catch (err) {
        logger.error(`App - editItem Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteItem = async function (userIdx, itemId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 상품 확인
        const itempostRows = await itemDao.selectItempostByItemId(connection, itemId);
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
    
        // 작성자 확인
        const checkUserIdx = itempostRows[0].seller;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.ITEM_USER_NOT_MATCH);
        }
        
        try {
            await connection.beginTransaction();
    
            // 상품 삭제
            await itemDao.deleteItempostByItemId(connection, itemId);
            await itemDao.deleteImageByItemId(connection, itemId);
            await itemDao.deleteItem(connection, itemId);
            
            await connection.commit();
    
            return {'userIdx': userIdx, 'itemId': itemId};
        } catch (err) {
            await connection.rollback();
            
            return err;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`App - deleteItem Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createItemImage = async function (userIdx, itemId, data, titleImage) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 상품 확인
        const itempostRows = await itemDao.selectItempostByItemId(connection, itemId);
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
    
        // 작성자 확인
        const checkUserIdx = itempostRows[0].seller;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.ITEM_USER_NOT_MATCH);
        }
        
        // 상품 사진 생성
        const imageParams = [itemId, data, titleImage];
        await itemDao.insertImage(connection, imageParams);
        
        connection.release();
        
        return {'userIdx': userIdx, 'itemId': itemId};
    } catch (err) {
        logger.error(`App - createItemImage Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editItemImage = async function (userIdx, imageId, data) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 상품 확인
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
    
        // 작성자 확인
        const checkUserIdx = itempostRows[0].seller;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.ITEM_USER_NOT_MATCH);
        }
    
        // 상품 사진 수정
        const editImageParams = [data, imageId];
        await itemDao.updateImage(connection, editImageParams);
    
        connection.release();
    
        return {'userIdx': userIdx, 'imageId': imageId};
    } catch (err) {
        logger.error(`App - editItemImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteItemImage = async function (userIdx, imageId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 현재 상품 확인
        const itempostRows = await itemDao.selectItempostByImageId(connection, imageId);
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
    
        // 작성자 확인
        const checkUserIdx = itempostRows[0].seller;
        if (checkUserIdx !== userIdx) {
            return errResponse(baseResponse.ITEM_USER_NOT_MATCH);
        }
    
        // 상품 사진 삭제
        await itemDao.deleteImage(connection, imageId);
    
        connection.release();
    
        return {'userIdx': userIdx, 'imageId': imageId};
    } catch (err) {
        logger.error(`App - deleteImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createWatchlist = async function (userIdx, itemId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 사용자 확인
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        const userNickname = userRows[0].nickname;
        
        // 현재 상품 확인
        const itempostRows = await itemDao.selectItempostByItemId(connection, itemId);
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
        
        // 관심 목록 생성
        const watchlistParams = [itemId, userIdx];
        await itemDao.insertWatchlist(connection, watchlistParams);
        
        connection.release();
        
        return {'itemId': itemId, 'buyer': userNickname};
    } catch (err) {
        logger.error(`App - createWatchlist Service error\n: ${err.message}`);
        
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteWatchlist = async function (userIdx, imageId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
    
        // 사용자 확인
        const userRows = await userProvider.getUserByIdx(userIdx);
        if (userRows.length < 1) {
            return errResponse(baseResponse.USER_USERIDX_NOT_MATCH);
        }
        const userNickname = userRows[0].nickname;
    
        // 현재 상품 확인
        const itempostRows = await itemDao.selectItempostByItemId(connection, itemId);
        if (itempostRows.length < 1) {
            return errResponse(baseResponse.ITEM_ID_NOT_MATCH);
        }
        
        // 관심 목록 삭제
        const deleteParams = [imageId, userIdx];
        await itemDao.deleteWatchlist(connection, deleteParams);
        
        connection.release();
        
        return {'imageId': imageId, "buyer": userNickname};
    } catch (err) {
        logger.error(`App - deleteWatchlist Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
