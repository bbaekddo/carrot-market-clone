/////////// SELECT ///////////
// 동네 정보 조회
async function selectNeighborhoodById(connection, neighborhoodId) {
    const selectNeighborhoodQuery = `
        SELECT user AS userIdx, nickname, Locations.name AS location, content, Topics.name AS topic, Neighborhoods.status
        FROM Neighborhoods
                 LEFT JOIN Users ON Neighborhoods.user = Users.idx
                 LEFT JOIN Topics ON Neighborhoods.topic = Topics.id
                 LEFT JOIN Locations ON Neighborhoods.location = Locations.id
        WHERE Neighborhoods.id = ?;
    `;
    const [neighborhoodRows] = await connection.query(selectNeighborhoodQuery, neighborhoodId);
    return neighborhoodRows;
}

// 주제로 동네 정보 조회
async function selectNeighborhoodByTopic(connection, topic) {
    const selectNeighborhoodByTopicQuery = `
        SELECT user AS userIdx, nickname, Locations.name AS location, content, Topics.name AS topic, Neighborhoods.status
        FROM Neighborhoods
                 LEFT JOIN Users ON Neighborhoods.user = Users.idx
                 LEFT JOIN Topics ON Neighborhoods.topic = Topics.id
                 LEFT JOIN Locations ON Neighborhoods.location = Locations.id
        WHERE Neighborhoods.topic = ?;
    `;
    const [neighborhoodRows] = await connection.query(selectNeighborhoodByTopicQuery, topic);
    return neighborhoodRows;
}

// 주제 이름으로 ID 조회
async function selectTopicId(connection, topic) {
    const selectTopicIdQuery = `
        SELECT id
        FROM Topics
        WHERE name = ?;
    `;
    const [topicRows] = await connection.query(selectTopicIdQuery, topic);
    return topicRows;
}

// 동네 정보 주제 조회
async function selectAllTopic(connection) {
    const selectAllTopicQuery = `
        SELECT name
        FROM Topics;
    `;
    const [topicRow] = await connection.query(selectAllTopicQuery);
    return topicRow;
}

// 동네 정보 사진 조회
async function selectImageById(connection, imageId) {
    const selectImageByIdQuery = `
        SELECT post, data
        FROM NeighborhoodImages
        WHERE id = ?;
    `;
    const [imageRow] = await connection.query(selectImageByIdQuery, imageId);
    return imageRow;
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


/////////// INSERT ///////////
// 동네 정보 생성
async function insertNeighborhood(connection, neighborhoodParams) {
    const insertNeighborhoodQuery = `
        INSERT INTO Neighborhoods
        SET user = ?, location = ?, content = ?, topic = ?;
    `;
    const neighborhoodRows = await connection.query(insertNeighborhoodQuery, neighborhoodParams);
    return neighborhoodRows[0].insertId;
}

// 동네 정보 사진 생성
async function insertImage(connection, imageParams) {
    const insertImageQuery = `
        INSERT INTO NeighborhoodImages
        SET post = ?, data = ?;
    `;
    await connection.query(insertImageQuery, imageParams);
}

/////////// UPDATE & DELETE ///////////
// 동네 정보 수정
async function updateNeighborhood(connection, neighborhoodParams) {
    const updateNeighborhoodQuery = `
        UPDATE Neighborhoods SET
        content = ?, topic = ?
        WHERE Neighborhoods.id = ?;
    `;
    await connection.query(updateNeighborhoodQuery, neighborhoodParams);
}

// 동네 정보 삭제
async function deleteNeighborhood(connection, neighborhoodId) {
    const deleteNeighborhoodQuery = `
        UPDATE Neighborhoods SET
            status = ?
        WHERE Neighborhoods.id = ?;
    `;
    const queryParams = ["DELETED", neighborhoodId];
    await connection.query(deleteNeighborhoodQuery, queryParams);
}

// 동네 정보 사진 수정
async function updateImage(connection, editImageParams){
    const updateImageQuery = `
        UPDATE NeighborhoodImages SET
            data = ?
        WHERE NeighborhoodImages.id = ?;
    `;
    await connection.query(updateImageQuery, editImageParams);
}

// 동네 정보 사진 삭제
async function deleteImage(connection, imageId){
    const deleteImageQuery = `
        UPDATE NeighborhoodImages SET
            status = ?
        WHERE NeighborhoodImages.id = ?;
    `;
    const deleteImageParams = ["DELETED", imageId];
    await connection.query(deleteImageQuery, deleteImageParams);
}

module.exports = {
    selectNeighborhoodById,
    selectNeighborhoodByTopic,
    selectTopicId,
    selectAllTopic,
    selectImageById,
    selectLocation,
    insertNeighborhood,
    insertImage,
    updateNeighborhood,
    deleteNeighborhood,
    updateImage,
    deleteImage
};
