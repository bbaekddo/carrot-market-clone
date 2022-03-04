const user = require("./userController");
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // 1. 사용자 생성 (회원가입)
    app.post('/app/users', user.postUsers);

    // 2. 전체/특정 사용자 조회
    app.get('/app/users', user.getUsers);
    
    // 3. 특정 id로 사용자 조회
    app.get('/app/users/:userId', user.getUserById);
    
    // 4. 특정 닉네임으로 사용자 조회
    app.get('/app/users/nicknames/:userNickname', user.getUserByNickname);
    
    // 5. 특정 이름으로 사용자 조회
    // --> 사용 안함
    // app.get('/app/users/names', user.getUserByName);
    
    // 6. 특정 상태로 사용자 조회
    // --> 사용 안함
    // app.get('/app/users/?status=userStatus',user.getUserByStatus);
    
    // 7. 특정 사용자 수정/삭제
    app.patch('/app/users/:userIdx', user.patchUsers);
    
    // 8. 사용자 프로필 사진 생성
    app.post('/app/users/images', user.postImages);
    
    // 9. 전체/특정 사용자 프로필 사진 조회
    app.get('/app/users/images', user.getImages);
    
    // 10. 특정 사용자 프로필 사진 수정/삭제
    app.put('/app/users/images/:imageId', user.putImages);
    
    // 11. 사용자 위치 정보 생성
    app.post('/app/users/locations',user.postLocations);
    
    // 12. 전체/특정 사용자 위치 정보 조회
    app.get('/app/users/locations', user.getLocations);
    
    // 13. 특정 사용자 위치 정보 수정/삭제
    app.patch('/app/users/locations/:locationId', user.patchLocations);
    
    
    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API