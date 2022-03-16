/////////// SELECT ///////////
// 카테고리 ID 조회
async function selectCategoryId(connection, category) {
    const selectCategoryIdQuery = `
        SELECT id
        FROM Categoires
        WHERE Categoires.name = ?;
    `;
    const [categoryIdRows] = await connection.query(selectCategoryIdQuery, category);
    return categoryIdRows;
}

// 카테고리로 상품 조회
async function selectItemByCategory(connection, categoryId) {
    const selectItemByCategoryQuery = `
        SELECT I.name AS name, content, price, L.name AS location, lookupCount, proposal
        FROM Items AS I, Locations AS L
        WHERE I.location = L.id AND
              I.category = ?;
    `;
    const [itemRows] = await connection.query(selectItemByCategoryQuery, categoryId);
    return itemRows;
}

// 게시글 ID로 상품 조회
async function selectItemByItempostId(connection, itemId) {
    const selectItemByItempostIdQuery = `
        SELECT PI.data AS profileImage, U.nickname AS seller, mannerTemperature, L1.name AS sellerLocation,
               I.name AS title, C.name AS category, content, price, L2.name AS itemLocation, lookupCount, proposal
        FROM ItemPosts AS IP, Items AS I, Categoires AS C, Users AS U, UserLocations AS UL,
             Locations AS L1, Locations AS L2, ProfileImages AS PI
        WHERE IP.seller = U.idx AND
            U.location1 = UL.id AND
            UL.location = L1.id AND
            U.profileImg = PI.id AND
            IP.item = I.id AND
            I.category = C.id AND
            I.location = L2.id AND
            IP.id = ?;
    `;
    const [itemByItempostIdRows] = await connection.query(selectItemByItempostIdQuery, itemId);
    return itemByItempostIdRows;
}

// 카테고리 조회
async function selectCategory(connection) {
    const selectCategoryQuery = `
        SELECT name, CI.data AS image
        FROM Categoires, CategoryImages AS CI
        WHERE Categoires.image = CI.id;
    `;
    const [categoryRows] = await connection.query(selectCategoryQuery);
    return categoryRows;
}

// 게시글 조회
async function selectItempostById(connection, itempostId) {
    const selectItempostByIdQuery = `
        SELECT item, seller
        FROM ItemPosts
        WHERE ItemPosts.id = ?;
    `;
    const [itempostRows] = await connection.query(selectItempostByIdQuery, itempostId);
    return itempostRows;
}

// 게시글 조회
async function selectItempostByItemId(connection, itemId) {
    const selectItempostByItemIdQuery = `
        SELECT id, seller
        FROM ItemPosts
        WHERE ItemPosts.item = ?;
    `;
    const [itempostRows] = await connection.query(selectItempostByItemIdQuery, itemId);
    return itempostRows;
}

// 사진 ID로 게시글 조회
async function selectItempostByImageId(connection, imageId) {
    const selectItempostByImageIdQuery = `
        SELECT IP.id AS id, IP.seller AS seller
        FROM ItemPosts AS IP
            LEFT JOIN ItemImages AS II ON II.item = IP.item
        WHERE II.id = ?;
    `;
    const [itempostRows] = await connection.query(selectItempostByImageIdQuery, imageId);
    return itempostRows;
}

// 위치 ID 조회
async function selectLocation(connection, location) {
    const selectLocationQuery = `
        SELECT id
        FROM Locations
        WHERE Locations.address REGEXP ?;
    `;
    const [locationIdRows] = await connection.query(selectLocationQuery, location);
    return locationIdRows;
}

// 상품 사진 조회
async function selectImageByItemId(connection, itemId) {
    const selectImageByItemIdQuery = `
        SELECT id, data, titleImage
        FROM ItemImages
        WHERE item = ?;
    `;
    const [imageByItemId] = await connection.query(selectImageByItemIdQuery, itemId);
    return imageByItemId;
}

// 관심 목록 조회
async function selectWatchlistByItemId(connection, itemId) {
    const selectWatchlistByItemIdQuery = `
        SELECT id, buyer
        FROM Watchlists
        WHERE item = ?;
    `;
    const [watchlistByItemId] = await connection.query(selectWatchlistByItemIdQuery, itemId);
    return watchlistByItemId;
}

/////////// INSERT ///////////
// 상품 생성
async function insertItem(connection, itemParams) {
    const insertItemQuery = `
        INSERT INTO Items SET
        name = ?, category = ?, content = ?, price = ?, location = ?, proposal = ?;
    `;
    const [itemRows] = await connection.query(insertItemQuery, itemParams);
    return itemRows.insertId;
}

// 게시글 생성
async function insertItemPost(connection, itemId, userIdx) {
    const insertItemPostQuery = `
        INSERT INTO ItemPosts SET
        item = ?, seller = ?, buyer = ?;
    `;
    const itempostParams = [itemId, userIdx, 5];
    const [itempostRows] = await connection.query(insertItemPostQuery, itempostParams);
    return itempostRows.insertId;
}

// 상품 사진 생성
async function insertImage(connection, imageParams) {
    const insertImageQuery = `
        INSERT INTO ItemImages SET
        item = ?, data = ?, titleImage = ?;
    `;
    await connection.query(insertImageQuery, imageParams);
}

// 관심 목록 생성
async function insertWatchlist(connection, watchlistParams) {
    const insertWatchlistQuery = `
        INSERT INTO Watchlists SET
        item = ?, buyer = ?;
    `;
    await connection.query(insertWatchlistQuery, watchlistParams);
}

/////////// UPDATE & DELETE ///////////
// 상품 수정
async function updateItem(connection, itemParams) {
    const updateItemQuery = `
        UPDATE Items SET
        name = ?, category = ?, content = ?, price = ?
        WHERE id = ?;
    `;
    await connection.query(updateItemQuery, itemParams);
}

// 게시글 삭제
async function deleteItempostByItemId(connection, itemId) {
    const deleteItempostByItemIdQuery = `
        DELETE FROM ItemPosts
        WHERE item = ?;
    `;
    await connection.query(deleteItempostByItemIdQuery, itemId);
}

// 상품 ID로 사진 삭제
async function deleteImageByItemId(connection, itemId) {
    const deleteImageByItemIdQuery = `
        DELETE FROM ItemImages
        WHERE item = ?;
    `;
    await connection.query(deleteImageByItemIdQuery, itemId);
}

// 상품 ID로 관심 목록 삭제
async function deleteWatchlistByItemId(connection, itemId) {
    const deleteWatchlistByItemIdQuery = `
        DELETE FROM Watchlists
        WHERE item = ?;
    `;
    await connection.query(deleteWatchlistByItemIdQuery, itemId);
}

// 상품 삭제
async function deleteItem(connection, itemId) {
    const deleteItemQuery = `
        DELETE FROM Items
        WHERE id = ?;
    `;
    await connection.query(deleteItemQuery, itemId);
}

// 상품 사진 수정
async function updateImage(connection, editImageParams) {
    const updateImageQuery = `
        UPDATE ItemImages SET
        data = ?
        WHERE id = ?;
    `;
    await connection.query(updateImageQuery, editImageParams);
}

// 상품 사진 삭제
async function deleteImage(connection, imageId) {
    const deleteImageQuery = `
        DELETE FROM ItemImages
        WHERE id = ?;
    `;
    await connection.query(deleteImageQuery, imageId);
}

// 관심 목록 삭제
async function deleteWatchlist(connection, deleteParams) {
    const deleteWatchlistQuery = `
        DELETE FROM Watchlists
        WHERE item = ? AND buyer = ?;
    `;
    await connection.query(deleteWatchlistQuery, deleteParams);
}

module.exports = {
    selectCategoryId,
    selectItemByItempostId,
    selectItemByCategory,
    selectCategory,
    selectItempostById,
    selectItempostByItemId,
    selectItempostByImageId,
    selectLocation,
    selectImageByItemId,
    selectWatchlistByItemId,
    insertItem,
    insertItemPost,
    insertImage,
    insertWatchlist,
    updateItem,
    deleteItempostByItemId,
    deleteImageByItemId,
    deleteWatchlistByItemId,
    deleteItem,
    updateImage,
    deleteImage,
    deleteWatchlist
};
