import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import Main from "./Main/Main";
import Adminindex from "./adminindex";
import Member from "./member/Member";
import JoinForm from "./member/JoinForm";
import LoginForm from "./member/LoginForm";
import AuthPopUpPage from "./member/memberComponents/AuthPopUpPage";
import MyPage from "./member/MyPage";
import Calendar from "./user/Calendar";
import Test from "./Admin/test";
import Get from "src/user/Get";
import axios from "axios";
import {getCookieToken, removeCookieToken, setRefreshToken} from "src/member/storage/Cookie";

const App = () => {

    const accessTokenVal = localStorage.getItem('accessToken');
    const refreshTokenVal = getCookieToken();

    // 토큰재발급
    useEffect(() => {
        axios.post("/auth/reIssue", {
            accessToken: accessTokenVal,
            refreshToken: refreshTokenVal
        }).then(res => {
            if (res.data) {
                setRefreshToken(res.data.refreshToken); // 쿠키에 리프레시토큰 저장
                localStorage.setItem("accessToken", res.data.accessToken); // 로컬스토리지에 엑세스 토큰 저장
                localStorage.setItem("expireTime", res.data.tokenExpiresIn); // 엑세스토큰 만료시간 저장
            }
        }).catch(error => {
            console.log("토큰 재발급 에러(로그인하면 안떠요)" + error.response);
        })
    }, [])


    // 토큰 만료시간 체크
    useEffect(()=> {

        axios.get("/member/me", {
            headers: {
                Authorization: `Bearer ${accessTokenVal}`
            }
        }).then(res => {
            console.log(res.data.name)
        }).catch(error => {
            console.log("(토큰 만료시간(10분)되면 자동 로그아웃)에러 로그인하면 사라져요! " + error.response);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expireTime');
            removeCookieToken();
        })

    }, [])

    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/adminindex/*' element={<Adminindex />} />
            <Route path='/member' element={<Member />} />
            <Route path='/member/joinForm/*' element={<JoinForm />} />
            <Route path='/member/loginForm' element={<LoginForm />} />
            <Route path='/member/memberComponents/AuthPopUpPage' element={<AuthPopUpPage />} />
            <Route path='/member/myPage' element={<MyPage />} />
            <Route path='/user/calendar' element={<Calendar />} />
            <Route path="/user/get/:selectedDate/:movieName/:cityName/:cinemaName/:time/:theater/:pk" element={<Get/>} />
            <Route path='/test' element={<Test/>}/>
        </Routes>
    );
};

export default App;
