const itemProvider = require("../../app/Item/itemProvider");
const itemService = require("../../app/Item/itemService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/*
 * API No. 1
 * API Name : 상품 게시글 생성
 * [POST] /app/items
 */
exports.postItems = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {name, category, content, price, location, proposal} = req.body;

    // 빈 값 체크
    if (!name) {
        return res.send(errResponse(baseResponse.ITEM_NAME_EMPTY));
    }
    
    if (!category) {
        return res.send(errResponse(baseResponse.ITEM_CATEGORY_EMPTY));
    }
    
    if (!price) {
        return res.send(errResponse(baseResponse.ITEM_PRICE_EMPTY));
    }
    
    if (!location) {
        return res.send(errResponse(baseResponse.ITEM_LOCATION_EMPTY));
    }
   
    // 길이 체크
    if (name.length > 20) {
        return res.send(errResponse(baseResponse.ITEM_NAME_LENGTH));
    }
    
    if (content.length > 20) {
        return res.send(errResponse(baseResponse.ITEM_CONTENT_LENGTH));
    }
    
    // 데이터 타입 체크
    if (typeof price !== 'number') {
        return res.send(errResponse(baseResponse.ITEM_PRICE_TYPE_WRONG))
    }

    const postItemResponse = await itemService.createItem(
        userIdx,
        name,
        category,
        content,
        price,
        location,
        proposal
    );
    
    // 동네 정보 생성 실패
    if (postItemResponse.isSuccess === false) {
        return res.send(postItemResponse);
    }

    // 동네 정보 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, postItemResponse));
};

/*
 * API No. 2
 * API Name : 카테고리로 상품 조회
 * [GET] /app/items
 */
exports.getItemsByCategory = async function (req, res) {
    const category = req.query.category;
    
    // 빈 값 체크
    if (!category) {
        return res.send(errResponse(baseResponse.ITEM_CATEGORY_EMPTY));
    }
    
    const itemByCategory = await itemProvider.getItemByCategory(category);
    
    // 상품 정보 조회 실패
    if (itemByCategory.length < 1) {
        return res.send(errResponse(baseResponse.ITEM_CATEGORY_NOT_EXIST));
    }
    
    // 상품 정보 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, itemByCategory));
};

/*
 * API No. 3
 * API Name : 상품 ID로 상품 조회
 * [GET] /app/items/:itemId
 */
exports.getItemsByItempostId = async function (req, res) {
    const itempostId = req.params.itempostId;
    
    // 빈 값 체크
    if (!itempostId) {
        return res.send(errResponse(baseResponse.ITEM_ITEMPOST_NOT_MATCH));
    }
    
    const itemByItempostId = await itemProvider.getItemByItempostId(itempostId);
    
    // 상품 정보 조회 실패
    if (itemByItempostId.length < 1) {
        return res.send(errResponse(baseResponse.ITEM_ITEMPOST_NOT_EXIST));
    }
    
    // 상품 정보 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, itemByItempostId));
};


/*
 * API No. 4
 * API Name : 상품 수정
 * [PATCH] /app/items/:itemId
 */
exports.patchItems = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const itemId = req.params.itemId;
    const {name, category, content, price} = req.body;
    
    const editItem = await itemService.editItem(
        userIdx,
        itemId,
        name,
        category,
        content,
        price
    );
    
    // 상품 수정 실패
    if (editItem.isSuccess === false) {
        return res.send(editItem);
    }
    
    // 상품 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editItem));
};

/*
 * API No. 4
 * API Name : 상품 삭제
 * [DELETE] /app/items/:itemId
 */
exports.deleteItems = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const itemId = req.params.itemId;
    
    const deleteItem = await itemService.deleteItem(
        userIdx,
        itemId
    );
    
    // 상품 삭제 실패
    if (deleteItem.isSuccess === false) {
        return res.send(deleteItem);
    }
    
    // 상품 삭제 성공
    return res.send(response(baseResponse.DELETE_SUCCESS, deleteItem));
};


/*
 * API No. 5
 * API Name : 상품 사진 생성
 * [POST] /app/items/images
 */
exports.postItemImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const {itemId, data, titleImage} = req.body;
    
    // 빈 값 체크
    if (!itemId) {
        return res.send(errResponse(baseResponse.ITEM_ID_EMPTY));
    }
    
    if (!data) {
        return res.send(errResponse(baseResponse.ITEM_IMAGE_EMPTY));
    }
   
    const postItemImageResponse = await itemService.createItemImage(
        userIdx,
        itemId,
        data,
        titleImage
    );
    
    // 상품 사진 생성 실패
    if (postItemImageResponse.isSuccess === false) {
        return res.send(postItemImageResponse);
    }
    
    // 상품 사진 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, postItemImageResponse));
};


/*
 * API No. 6
 * API Name : 상품 사진 수정
 * [PATCH] /app/items/images/:imageId
 */
exports.patchItemImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const imageId = req.params.imageId;
    const {data} = req.body;
    
    const editItemImage = await itemService.editItemImage(
        userIdx,
        imageId,
        data
    );
    
    // 상품 사진 수정 실패
    if (editItemImage.isSuccess === false) {
        return res.send(editItemImage);
    }
    
    // 상품 사진 수정 성공
    return res.send(response(baseResponse.PUT_SUCCESS, editItemImage));
};

/*
 * API No. 7
 * API Name : 상품 사진 삭제
 * [DELETE] /app/items/images/:imageId
 */
exports.deleteItemImages = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const imageId = req.params.imageId;
    
    const deleteItemImage = await itemService.deleteItemImage(
        userIdx,
        imageId
    );
    
    // 상품 사진 삭제 실패
    if (deleteItemImage.isSuccess === false) {
        return res.send(deleteItemImage);
    }
    
    // 상품 사진 삭제 성공
    return res.send(response(baseResponse.DELETE_SUCCESS, deleteItemImage));
};

/*
 * API No. 8
 * API Name : 카테고리 조회
 * [GET] /app/items/categories
 */
exports.getCategories = async function (req, res) {
    const category = await itemProvider.getCategory();
    
    // 카테고리 조회 실패
    if (category.length < 1) {
        return res.send(errResponse(baseResponse.CATEGORY_NOT_EXIST));
    }
    
    // 카테고리 조회 성공
    return res.send(response(baseResponse.GET_SUCCESS, category));
};

/*
 * API No. 9
 * API Name : 관심 목록 생성
 * [POST] /app/items/watchlists
 */
exports.postWatchlists = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const itemId = req.params.itemId;
    
    // 빈 값 체크
    if (!itemId) {
        return res.send(errResponse(baseResponse.ITEM_ID_EMPTY));
    }
    
    const postWatchlist = await itemService.createWatchlist(
        userIdx,
        itemId
    );
    
    // 관심 목록 생성 실패
    if (postWatchlist.isSuccess === false) {
        return res.send(postWatchlist);
    }
    
    // 관심 목록 생성 성공
    return res.send(response(baseResponse.POST_SUCCESS, postWatchlist));
}

/*
 * API No. 10
 * API Name : 관심 목록 삭제
 * [DELETE] /app/items/watchlists
 */
exports.deleteWatchlists = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const itemId = req.params.itemId;
    
    // 빈 값 체크
    if (!itemId) {
        return res.send(errResponse(baseResponse.ITEM_ID_EMPTY));
    }
    
    const deleteWatchlist = await itemService.deleteWatchlist(
        userIdx,
        itemId
    );
    // 관심 목록 삭제 실패
    if (deleteWatchlist.isSuccess === false) {
        return res.send(deleteWatchlist);
    }
    
    // 관심 목록 삭제 성공
    return res.send(response(baseResponse.DELETE_SUCCESS, deleteWatchlist));
};