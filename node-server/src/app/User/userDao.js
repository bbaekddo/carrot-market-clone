// 모든 사용자 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 인덱스로 사용자 조회
async function selectUserIndex(connection, idx) {
  const selectUserIdxQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users
                WHERE Users.idx = ?;
                `;
  const [userIdxRows] = await connection.query(selectUserIdxQuery, idx);
  return userIdxRows;
}

// ID로 사용자 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users
                WHERE Users.id = ?;
                 `;
  const [userIdRow] = await connection.query(selectUserIdQuery, userId);
  return userIdRow;
}


// 닉네임으로 사용자 조회
// 사용안함
async function selectUserNickname(connection, userNickname) {
    const selectUserNicknameQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users
                WHERE Users.nickname = ?;
                 `;
    const [userNicknameRow] = await connection.query(selectUserNicknameQuery, userNickname);
    return userNicknameRow;
}


// 이름으로 사용자 조회
async function selectUserName(connection, userName) {
    const selectUserNameQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users
                WHERE Users.name = ?;
                 `;
    const [userNameRow] = await connection.query(selectUserNameQuery, userName);
    return userNameRow;
}

// 계정 상태로 사용자 조회
async function selectUserStatus(connection, userStatus) {
    const selectUserStatusQuery = `
                SELECT idx, id, name, nickname, profile_img,
                manner_temperature, retrade_rate, reply_rate,
                location1, location2, status
                FROM Users
                WHERE Users.status = ?;
                 `;
    const [userStatusRow] = await connection.query(selectUserStatusQuery, userStatus);
    return userStatusRow;
}

async function selectUserIdCheck(connection, userId) {
    const selectUserIdCheckQuery = `
                SELECT idx, id, name, nickname
                FROM Users
                WHERE Users.id = ?
                AND Users.status != ?
                `;
    const [userIdCheckRow] = await connection.query(selectUserIdCheckQuery, [userId, 'Deleted']);
    return userIdCheckRow;
}

async function selectUserNicknameCheck(connection, userNickname) {
    const selectUserNicknameCheckQuery = `
                SELECT idx, id, name, nickname
                FROM Users
                WHERE Users.nickname = ?
                AND Users.status != ?
                `;
    const [userNicknameCheckRow] = await connection.query(selectUserNicknameCheckQuery, [userNickname, 'Deleted']);
    return userNicknameCheckRow;
}

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
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
                INSERT INTO Users(id, pswd, name, nickname, profile_img, location1, location2)
                VALUES (?, ?, ?, ?, ?, ?, ?);
                `;
    const userInfo = await connection.query(insertUserInfoQuery, insertUserInfoParams);
    return userInfo[0].insertId;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
                SELECT email, nickname, password
                FROM UserInfo
                WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
                selectUserPasswordQuery,
                selectUserPasswordParams
    );
    
    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
    const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;
        `;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        email
    );
    return selectUserAccountRow[0];
}

// 사용자 정보 불러오기
async function selectUserPatch(connection, idx){
    const selectUserPatchQuery = `
        SELECT id, pswd, name, nickname
        FROM Users
        WHERE Users.idx = ?;
        `;
    const [selectUserPatchRow] = await connection.query(selectUserPatchQuery, idx);
    const id = selectUserPatchRow[0].id;
    const pswd = selectUserPatchRow[0].pswd;
    const name = selectUserPatchRow[0].name;
    const nickname = selectUserPatchRow[0].nickname;
    
    return [id, pswd, name, nickname];
}

// 사용자 정보 수정
async function updateUser(connection, idx, oldPatches, newPatches) {
    let id, pswd, name, nickname;
    
    if (newPatches[0] != null) {
        id = newPatches[0];
    } else{
        id = oldPatches[0];
    }
    
    if (newPatches[1] != null) {
        pswd = newPatches[1];
    } else{
        pswd = oldPatches[1];
    }
    
    if (newPatches[2] != null) {
        name = newPatches[2];
    } else{
        name = oldPatches[2];
    }
    
    if (newPatches[3] != null) {
        nickname = newPatches[3];
    } else{
        nickname = oldPatches[3];
    }
    const updatePathes = [id, pswd, name, nickname];
    const updateUserQuery = `
        UPDATE Users SET
        id = ?, pswd = ?, name = ?, nickname = ?
        WHERE Users.idx = ${idx};
        `;
    
    await connection.query(updateUserQuery, updatePathes);
}


module.exports = {
    selectUser,
    selectUserId,
    selectUserNickname,
    selectUserName,
    selectUserStatus,
    selectUserIdCheck,
    selectUserNicknameCheck,
    selectUserPatch,
    insertUserLocation,
    insertUserImage,
    insertUserInfo,
    updateUser
};
