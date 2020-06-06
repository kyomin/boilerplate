const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
});

/* 해당 스키마의 저장(save) 작업 전에 할 작업을 지정한다. next를 호출하면 save 작업으로 이동한다. */
boilerplateUserSchema.pre('save', function( next ){

    // user는 boilerplateUserSchema를 가리키게 된다. 
    // 그래서 각 필드에 접근할 수 있다.
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

                // 해당 작업 빠져 나와서 다음으로 진행
                next();
            });
        });
    } else {    // 다른 것을 수정하려 한다면
        next();     // 바로 다음으로 진행
    }
});

/* 모델 내부에 메소드를 정의한다. */
boilerplateUserSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword : 70017621    암호화된 비밀번호 : $2b$10$O6VcgV8tPRlb6.b626WlTej63WxJLRnAj9/SWDeMnnFwFm8Kq6vyu
    // 위의 2개가 같은지 확인해야 한다. => plainPassword를 암호화 한 후에 비교한다.(복호화 불가능)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);

        cb(null, isMatch);
    });
}

boilerplateUserSchema.methods.createToken = function(cb) {
    var user = this;
    
    // jsonwebtoken을 이용해서 토큰을 생성하기
    // user._id + 'secretToken' = token이 되고,
    // 'secretToken' -> user._id를 뽑아낸다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);

        cb(null, user);
    })
}

boilerplateUserSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    // 'secretToken' -> user._id를 뽑아낸다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err, user) {
            if(err) return cb(err);

            cb(null, user);
        });
    });
}

/* 스키마를 모델로 감싼다. */
const BoilerplateUser = mongoose.model("BoilerplateUser", boilerplateUserSchema);

module.exports = { BoilerplateUser }