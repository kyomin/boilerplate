const mongoose = require('mongoose');

const boilerplateUserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,      // kim031504 @naver.com과 같이 중간에 공백을 없애주는 역할을 한다.
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {        // 유효성 관리
        type: String
    },
    tokenExp: {     // 유효 기간
        type: Number
    }
})

// 스키마를 모델로 감싼다.
const BoilerplateUser = mongoose.model("BoilerplateUser", boilerplateUserSchema);

module.exports = { BoilerplateUser }