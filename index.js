const express = require('express');   // express 모듈이 export 하는 것은 서버 제작 기능이 담긴 객체를 반환하는 함수일 것이다.
const app = express();                // 즉, 함수 호출을 통해서 app에 객체를 받는다.
const port = 5000;
const bodyParser = require('body-parser');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', (req, res) => {
    // 회원 가입 시에 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다.
    const user = new BoilerplateUser(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });
        
        return res.status(200).json({
            success: true
        });
    });
})
  
app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});