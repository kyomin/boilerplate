const express = require('express');   // express 모듈이 export 하는 것은 서버 제작 기능이 담긴 객체를 반환하는 함수일 것이다.
const app = express();                // 즉, 함수 호출을 통해서 app에 객체를 받는다.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

const { BoilerplateUser } = require('./models/BoilerplateUser');

const config = require('./config/key');

/* 몽고DB 연결 */
const mongoose = require('mongoose');
const mongoURI = config.mongoURI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));


/* 미들웨어에 bodyParser 추가 */
app.use(bodyParser.urlencoded({ extended: true }));     // application/x-www-form-urlencoded
app.use(bodyParser.json());     // application/json                    
app.use(cookieParser()); 


/* 라우터 설정! */
app.get('/', (req, res) => {
    res.send(`Hello Kyomin's Server!`);
});

app.post('/api/users/register', (req, res) => {
    // 회원 가입 시에 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다.
    const user = new BoilerplateUser(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });
        
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    BoilerplateUser.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일의 가입 정보가 없습니다."
            });
        }

        // 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                });

                return;
            }

            // 비밀번호까지 맞다면(위의 과정을 통과했다면) 유저를 위한 '토큰' 생성!
            user.createToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다.
                // where? : 쿠키, 세션, 로컬 스토리지 등등
                // 우리는 쿠키에 저장한다.
                // 이름이 x_auth인 쿠키에 값을 할당
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess : true,
                    userId : user._id
                });
            });
        });
    });
});

// 중간의 인자는 미들웨어(함수, auth)가 들어가는 부분이다.
// role : 0 => 일반 유저, 0이 아니면 관리자. 이는 하나의 정책이다.
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 오면 미들웨어를 통과해 왔다는 얘기이다.
    // 즉, 인증처리가 완료되었다는 말이다.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    // 첫 번째 인자는 찾기 위해 넣어줄 어트리뷰트 값
    // 두 번째 인자는 찾은 후에 바꿔줄 어트리뷰트
    BoilerplateUser.findOneAndUpdate(
    { _id: req.user._id }, 
    { token: "" },      // DB의 토큰을 지워준다.
    (err, user) => {
        // 실패 시
        if(err) return res.json({ success: false, err });

        // 성공 시
        return res.status(200).json({
            success: true
        });
    });
});


/* 서버 열기! */
const port = 5000;

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});