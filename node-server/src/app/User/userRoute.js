module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const qs = require('querystring');
    const ax = require('axios');
    
    const client_id = 'n7RTkWcgkwzvV71Fb0oN';
    const client_secret = '7eMnwfnu8s';
    let state = "RANDOM_STATE";
    const redirectURI = encodeURI('http://localhost:3000/app/users/auth/callback');
    let api_url = "";

    // 1. 사용자 생성 (회원가입)
    app.post('/app/users', user.postUsers);
    
    // 2. 사용자 로그인 (JWT 생성)
    app.post('/app/login', user.login);
    
    // 3. 전체 사용자 조회
    // + nickname으로 사용자 조회
    app.get('/app/users', user.getUsers);
    
    // 4. 특정 index로 사용자 조회
    app.get('/app/users/:userIdx', user.getUserByIdx);
    
    // 5. 사용자 정보 수정 (JWT 사용)
    app.patch('/app/users', jwtMiddleware, user.patchUsers);
    
    // 6. 사용자 정보 삭제 (JWT 사용)
    app.put('/app/users/', jwtMiddleware, user.deleteUsers);
    
    // 7. 특정 사용자 프로필 사진 조회
    app.get('/app/users/:userIdx/images', user.getImages);
    
    // 8. 특정 사용자 프로필 사진 수정 (JWT 사용)
    app.patch('/app/users/images', jwtMiddleware, user.patchImages);
    
    // 9. 특정 사용자 프로필 사진 삭제 (JWT 사용)
    app.put('/app/users/images', jwtMiddleware, user.deleteImages);
    
    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    // app.get('/app/auto-login', jwtMiddleware, user.check);
    
    // Facebook OAuth 인증
    /*app.get('/app/users/login/facebook', (req, res) => {
        const stringfiedParams = qs.stringify({
            client_id: "420065332493079",
            redirect_uri: "https://www.sosocamp.shop/app/users/auth/callback",
            scope: ['email', 'name'].join(','),
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup'
        });
        
        const facebookUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringfiedParams}`;
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
        const {data} = await ax({
            url: 'https://graph.facebook.com/v4.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: '420065332493079',
                client_secret: 'a222b4bef624e1b918018e879cb1b1f6',
                redirect_uri: 'https://www.sosocamp.shop/app/users/auth/callback',
                code,
            },
        });
        console.log(data);
    }
    
    async function getFacebookUserData(access_token) {
        const {data} = await ax({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: ['id', 'email', 'name'].join(','),
                access_token: accesstoken
            },
        });
        console.log(data);
        return data;
    }
    
    app.get('/app/users/auth/callback', async(req, res) => {
        const acceess_token = await getAccessTokenFromCode(req.query.code);
        console.log(acceess_token);
        res.send("authentification success!");
    });*/
    
    app.get('/naverlogin', function (req, res) {
        api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
    });
    
    // Naver API 토큰 저장용
    let accessToken = '', refreshToken = '', expiresIn = '';
    
    app.get('/app/users/auth/callback', function (req, res) {
        let code = req.query.code;
        state = req.query.state;
        api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
            + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
        var request = require('request');
        var options = {
            url: api_url,
            headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // Naver API로부터 받은 토큰 저장
                const resultObj = JSON.parse(body);
                accessToken = resultObj.access_token;
                refreshToken = resultObj.refresh_token;
                expiresIn = resultObj.expires_in;
                
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                res.end(body);
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        });
    });
    
    
    
};



// TODO: 탈퇴하기 API