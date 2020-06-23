import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }

    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();     // 태그가 가진 기본 이벤트를 방지한다. 즉, form이 기본적으로 가지고 있는 것 때문에 새로고침 되는 것을 방지한다.
        
        if(password !== confirmPassword) {
            alert("비밀번호 확인을 정확히 해주십시오!");
            return;
        }

        let body = {
            email,
            password,
            name
        };

        // registerUser라는 이름의 action
        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success) {
                props.history.push('/');
            } else {
                alert('Error!');
            }
        });
    }

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type='email' value={email} onChange={onEmailHandler} />
                
                <label>Name</label>
                <input type='text' value={name} onChange={onNameHandler} />

                <label>Password</label>
                <input type='password' value={password} onChange={onPasswordHandler} />
                
                <label>Confirm Password</label>
                <input type='password' value={confirmPassword} onChange={onConfirmPasswordHandler} />

                <br />
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)