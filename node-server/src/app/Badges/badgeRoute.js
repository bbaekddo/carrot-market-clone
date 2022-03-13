module.exports = function(app){
    const badge = require('./badgeController');

    // 1. User Index로 활동 배지 조회
    app.get('/app/badges', badge.getBadgeByUserIdx);
};