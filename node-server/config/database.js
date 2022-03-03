const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'risingrds.cbnlcolwwd2p.ap-northeast-2.rds.amazonaws.com',
    user: 'soso',
    password: 'fkdlWld1!',
    database: 'rising_DB',
    port: '16000'
});

module.exports = {
    pool: pool
};