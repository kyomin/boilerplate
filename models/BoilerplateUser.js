const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// 해당 스키마의 저장(save) 작업 전에 할 작업을 지정한다. next를 호출하면 save 작업으로 이동한다.
boilerplateUserSchema.pre('save', function( next ){

    // user는 boilerplateUserSchema를 가리키게 된다. 그래서 각 필드에 접근할 수 있다.
    var user = this;

    // password만 변경될 때 암호화 실행!
    if(user.isModified('password')) {

        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            
            // 첫 인자 user.password는 평문(plain text)이다.
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err);

                // 성공했으면 해시값으로 바뀌므로 이를 대체해준다.
                user.password = hash;
                next();
            });
        });
    }
});

// 스키마를 모델로 감싼다.
const BoilerplateUser = mongoose.model("BoilerplateUser", boilerplateUserSchema);

module.exports = { BoilerplateUser }