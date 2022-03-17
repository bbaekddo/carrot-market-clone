module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const FB = require('fb');
    const fs = require('fs');

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
    
    // Facebook OAuth 인증
    
    app.get('/app/users/login/check', (req, res) => {
        fs.readFile(`${__dirname}/loginFB.html`, function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    });
    
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
    });
    
    FB.api(
        '/me',
        'GET',
        {"fields":"id,name,email,hometown,location,age_range,photos{picture}"},
        function(response) {
            // Insert your code here
        }
    );*/
};