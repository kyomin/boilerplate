const express = require('express');   // express 모듈이 export 하는 것은 서버 제작 기능이 담긴 객체를 반환하는 함수일 것이다.
const app = express();                // 즉, 함수 호출을 통해서 app에 객체를 받는다.
const port = 5000;

const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://kyomin:0603@youtubeclone-fwhcj.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));


app.get('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});