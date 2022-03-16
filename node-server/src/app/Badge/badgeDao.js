/////////// SELECT ///////////
// User Index로 사용자 조회
async function selectBadgeByUserIdx(connection, userIdx) {
  const selectBadgeQuery = `
              SELECT B.checkGold AS goldBadge,
                     BT.name AS name,
                     BT.content AS content,
                     BI.data AS badgeImage
              FROM Badges AS B
                       LEFT JOIN BadgeTypes AS BT ON B.type = BT.id
                       LEFT JOIN BadgeImages AS BI ON BT.image = BI.id
              WHERE B.checkGet = 'Y' AND B.user = ?;
              `;
  const [userIdxRows] = await connection.query(selectBadgeQuery, userIdx);
  return userIdxRows;
}

module.exports = {
    selectBadgeByUserIdx
};