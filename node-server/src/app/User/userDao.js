/////////// SELECT ///////////
// 모든 사용자 조회
const {query} = require("winston");

async function selectAllUser(connection) {
    const selectAllUserQuery = `
        SELECT U.idx, U.id, U.name, U.nickname, PI.data AS profileImg,
               U.mannerTemperature, U.retradeRate, U.replyRate,
               L1.name AS location1, L2.name AS location2, U.status
        FROM Users AS U
                 LEFT JOIN ProfileImages AS PI ON U.profileImg = PI.id
                 LEFT JOIN UserLocations AS UL1 ON U.location1 = UL1.id
                 LEFT JOIN UserLocations AS UL2 ON U.location2 = UL2.id
                 LEFT JOIN Locations AS L1 ON UL1.location = L1.id
                 LEFT JOIN Locations AS L2 ON UL2.location = L2.id;
    `;
    const [userRows] = await connection.query(selectAllUserQuery);
    return userRows;
}

// Index로 사용자 조회
async function selectUserByIdx(connection, userIdx) {
    const selectUserByIdxQuery = `
        SELECT id, name, nickname, profileImg, status
        FROM Users
        WHERE Users.idx = ?;
    `;
    const [userIdxRows] = await connection.query(selectUserByIdxQuery, userIdx);
    return userIdxRows;
}

// ID로 사용자 조회
async function selectUserById(connection, userId) {
    const selectUserByIdQuery = `
        SELECT idx, nickname, status
        FROM Users
        WHERE Users.id = ?;
    `;
    const [userIdRow] = await connection.query(selectUserByIdQuery, userId);
    return userIdRow;
}

// 닉네임으로 사용자 조회
async function selectUserByNickname(connection, userNickname) {
    const selectUserByNicknameQuery = `
        SELECT idx, status
        FROM Users
        WHERE Users.nickname = ?;
    `;
    const [userNicknameRow] = await connection.query(selectUserByNicknameQuery, userNickname);
    return userNicknameRow;
}

// 특정 사용자 프로필 사진 정보 불러오기
async function selectImageByImageId(connection, imageId) {
    const imageByImageIdQuery = `
        SELECT data
        FROM ProfileImages
        WHERE ProfileImages.id = ?;
    `;
    const [userImageByImageIdRows] = await connection.query(imageByImageIdQuery, imageId);
    return userImageByImageIdRows;
}

// 사용자 패스워드 체크
async function selectPasswordById(connection, userId) {
    const selectPasswordQuery = `
        SELECT password
        FROM Users
        WHERE id = ?;
    `;
    const [passwordRows] = await connection.query(selectPasswordQuery, userId);
    return passwordRows[0].password;
}

/////////// INSERT ///////////
// 사용자 위치 생성
async function insertUserLocation(connection, userLocation) {
    const insertUserLocationQuery = `
        INSERT INTO UserLocations(location)
        VALUES (?);
    `;
    const userLocationId = await connection.query(insertUserLocationQuery, userLocation);
    return userLocationId[0].insertId;
}

// 사용자 프로필 사진 생성
async function insertUserImage(connection) {
    const insertUserImageQuery = `
        INSERT INTO ProfileImages()
        VALUES ();
    `;
    const userImageId = await connection.query(insertUserImageQuery);
    return userImageId[0].insertId;
}

// 사용자 생성
async function insertUser(connection, userParams) {
    const insertUserQuery = `
        INSERT INTO Users(id, password, name, nickname, profileImg, location1, location2)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    await connection.query(insertUserQuery, userParams);
}

/////////// UPDATE & DELETE ///////////
// 사용자 정보 수정
async function updateUser(connection, userParams) {
    const updateUserQuery = `
        UPDATE Users SET
                         password = ?, nickname = ?
        WHERE Users.idx = ?;
    `;
    await connection.query(updateUserQuery, userParams);
}

// 사용자 정보 삭제
async function deleteUser(connection, userIdx) {
    const deleteUserQuery = `
        UPDATE Users SET
            status = ?
        WHERE Users.idx = ?;
    `;
    const queryParams = ["DELETED", userIdx];
    await connection.query(deleteUserQuery, queryParams);
}

// 특정 사용자 프로필 사진 수정/삭제
async function updateImage(connection, imageId, data){
    const updateImageQuery = `
        UPDATE ProfileImages SET
            data = ?
        WHERE ProfileImages.id = ?;
    `;
    const queryParams = [data, imageId];
    await connection.query(updateImageQuery, queryParams);
}

module.exports = {
    selectAllUser,
    selectUserByIdx,
    selectUserById,
    selectUserByNickname,
    selectPasswordById,
    selectImageByImageId,
    insertUserLocation,
    insertUserImage,
    insertUser,
    updateUser,
    updateImage,
    deleteUser
};
