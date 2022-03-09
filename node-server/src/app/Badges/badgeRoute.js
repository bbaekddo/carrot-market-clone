// module.exports = function(app){
//     const badge = require('./badgeController');
//
//     // 1. 활동 배지 생성
//     app.post('/app/badges', badge.postBadges);
//
//     // 2. 전체/특정 배지 조회
//     app.get('/app/badges', badge.getBadges);
//
//     // 3. 특정 User Index로 배지 조회
//     app.get('/app/badges/:userIdx', badge.getBadgeByUserIdx);
//
//     // 4. 특정 배지 수정/삭제
//     app.patch('/app/badges/:badgeId', badge.patchBadges);
//
//     // 5. 배지 종류 생성
//     app.post('/app/badges/types', badge.postBadgeTypes);
//
//     // 6. 배지 종류 조회
//     app.get('/app/badges/types', badge.getBadgeTypes);
//
//     // 7. 특정 배지 종류 수정/삭제
//     app.patch('/app/badges/types/:badgeType', badge.patchBadgeTypes);
//
//     // 8. 배지 사진 생성
//     app.post('/app/badges/images', badge.postBadgeImages);
//
//     // 9. 배지 사진 조회
//     app.get('/app/badges/images', badge.getBadgeImages);
//
//     // 10. 특정 배지 사진 수정/삭제
//     app.patch('/app/badges/images/:badgeImage', badge.patchBadgeImages);
// };