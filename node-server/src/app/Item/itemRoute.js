module.exports = function(app){
    const item = require('./itemController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 상품 게시글 생성
    app.post('/app/items', jwtMiddleware, item.postItems);
    
    // 2. 카테고리로 상품 조회
    app.get('/app/items', item.getItemsByCategory);
    
    // 3. 게시글 ID로 게시글 조회
    app.get('/app/items/:itempostId', item.getItemsByItempostId);
    
    // 4. 상품 수정
    app.patch('/app/items/:itemId', jwtMiddleware, item.patchItems);
    
    // 5. 상품 삭제
    app.delete('/app/items/:itemId', jwtMiddleware, item.deleteItems);
    
    // 6. 상품 사진 생성
    app.post('/app/items/images', jwtMiddleware, item.postItemImages);
    
    // 7. 상품 사진 수정
    app.patch('/app/items/images/:imageId', jwtMiddleware, item.patchItemImages);
    
    // 8. 상품 사진 삭제
    app.delete('/app/items/images/:imageId', jwtMiddleware, item.deleteItemImages);
    
    // 9. 카테고리 조회
    app.get('/app/items/categories/all', item.getCategories);
    
    // 10. 관심 목록 생성
    app.post('/app/items/:itemId/watchlists', jwtMiddleware, item.postWatchlists);
    
    // 11. 관심 목록 삭제
    app.delete('/app/items/:itemId/watchlists', jwtMiddleware, item.deleteWatchlists);
};