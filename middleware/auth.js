const { BoilerplateUser } = require('../models/BoilerplateUser');

/* 인증 처리를 하는 곳 */
let auth = (req, res, next) => {
    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 다음에 유저를 찾는다.
    BoilerplateUser.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json( {isAuth: false, err: true} );

        // 이렇게 넣어줌으로 인해서 /api/users/auth의 get 콜백에서 req는 해당 값을 가지게 된다.
        req.token = token
        req.user = user;
        next();
    });
}

module.exports = { auth };