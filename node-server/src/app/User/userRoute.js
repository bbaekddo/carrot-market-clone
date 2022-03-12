const qs = require('querystring');
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 사용자 생성 (회원가입)
    app.post('/app/users', user.postUsers);

    // 2. 전체/특정 사용자 조회
    app.get('/app/users', user.getUsers);
    
    // 3. 특정 id로 사용자 조회
    app.get('/app/users/:userId', user.getUserById);
    
    // 4. 특정 닉네임으로 사용자 조회
    // app.get('/app/users/nicknames/:userNickname', user.getUserByNickname);
    
    // 5. 특정 사용자 프로필 사진 조회
    app.get('/app/users/images/:imageId', user.getImages);
    
    // 7. 특정 사용자 프로필 사진 수정/삭제
    app.patch('/app/users/images/:imageId', user.patchImages);
   
    // 8. 전체/특정 사용자 위치 정보 조회
    app.get('/app/users/locations/:locationId', user.getLocations);
    
    // 9. 특정 사용자 위치 정보 수정/삭제
    app.patch('/app/users/locations/:locationId', user.patchLocations);
    
    // TODO: After 로그인 인증 방법 (JWT)
    // 10. 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 11. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userIdx', jwtMiddleware, user.patchUsers);
    
    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    // app.get('/app/auto-login', jwtMiddleware, user.check);
    
    app.get('/app/users/login/facebook', (req, res) => {
        const stringfiedParams = qs.stringify({
            client_id: "420065332493079",
            redirect_url: "https://www.sosocamp.shop/app/users/auth/callback",
            scope: ['email', 'user_friends'].join(','),
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup'
        });
        
        const facebookUrl = `https://www.facebook.com/v12.0/dialog/oauth?${{stringfiedParams}}`;
        res.type('text/html').status(200).send(`
            <!DOCTYPE html>
            <html>
                <body>
                <a href=${facebookUrl}>
                    Login with Facebook
                </a>
                </body>
            </html>
        `);
    });
    
    async function getAccessTokenFromCode(code) {
        const {data} = await axios({
            url: 'https://graph.facebook.com/v12.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: '420065332493079',
                client_secret: 'a222b4bef624e1b918018e879cb1b1f6',
                redirect_url: 'https://www.sosocamp.shop/app/users/auth/callback',
                code,
            },
        });
        console.log(data);
        return data.access_token;
    }
    
    app.get('/app/users/auth/callback', async(req, res) => {
        const acceess_token = await getAccessTokenFromCode(req.query.code);
        console.log(acceess_token);
        res.send("authentification success!");
    });
};



// TODO: 탈퇴하기 API