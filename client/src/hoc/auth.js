import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

// 매개변수 adminRoute의 기본값을 null로 정의. 인자로 안 전달해주면 null을 갖는다.
// option == null   => 아무나 출입이 가능한 페이지(Landing Page)
// option == true   => 로그인한 유저만 출입이 가능한 페이지
// option == false  => 로그인한 유저는 출입이 불가능한 페이지(Register Page, Login Page)
export default function(SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        
        useEffect(() => {

            dispatch(auth())
            .then(response => {
                console.log(response);

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    // 로그인 안 했는데 로그인한 유저만 출입이 가능한 페이지로 들어왔다면
                    if(option) {
                        props.history.push('/login');
                    }
                } else {    // 로그인 한 상태
                    // 관리자가 아닌데, 관리자 페이지로 들어왔다.
                    if(adminRoute && !response.payload.idAdmin) {
                        props.history.push('/');
                    } else {
                        if(option === false) {
                            props.history.push('/');
                        }
                    }
                }
            });
  
        }, []);

        // 위의 인증을 다 거친 경우에만 해당 컴포넌트를 랜딩한다.
        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck;
}