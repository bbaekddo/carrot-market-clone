module.exports = function(app){
    const neighborhood = require('./neighborhoodController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 동네 정보 생성
    app.post('/app/neighborhoods', jwtMiddleware, neighborhood.postNeighborhoods);
    
    // 2. 특정 주제로 동네 정보 조회
    app.get('/app/neighborhoods', neighborhood.getNeighborhoodsByTopic);
    
    // 6. 동네 정보 주제 조회
    // 최대 3개까지만 표시
    app.get('/app/neighborhoods/topics', neighborhood.getTopics);
    
    // 3. 특정 동네 정보 조회
    app.get('/app/neighborhoods/:neighborhoodId', neighborhood.getNeighborhoods);
    
    // 4. 동네 정보 수정 (JWT 사용)
    app.patch('/app/neighborhoods/:neighborhoodId', jwtMiddleware, neighborhood.patchNeighborhoods);
    
    // 5. 동네 정보 삭제 (JWT 사용)
    app.put('/app/neighborhoods/:neighborhoodId', jwtMiddleware, neighborhood.deleteNeighborhoods);
    
    // 7. 공감 표현 조회
    // --> 사용 안함
    // app.get('/app/neighborhoods/expressions', neighborhood.getExpressions);
    
    // 7. 동네 정보 사진 생성 (JWT 사용)
    app.post('/app/neighborhoods/:neighborhoodId/images', jwtMiddleware, neighborhood.postImages);
    
    // 8. 동네 정보 사진 수정 (JWT 사용)
    app.patch('/app/neighborhoods/images/:imageId', jwtMiddleware, neighborhood.patchImages);
    
    // 9. 동네 정보 사진 삭제 (JWT 사용)
    app.put('/app/neighborhoods/images/:imageId', jwtMiddleware, neighborhood.deleteImages);
};