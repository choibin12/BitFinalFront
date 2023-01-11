import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {setRefreshToken} from "src/member/storage/Cookie";

const theme = createTheme();

const LoginForm = () => {

    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const inputValue = (e) => {

        const {name, value} = e.target
        setForm({
            ...form,
            [name]: value
        });

    }

    const {username, password} = form;

    const navi = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:3000/auth/login`,{
            username: form.username,
            password: form.password
        }).then(res => {
            if (res.data) {
                setRefreshToken(res.data.refreshToken); // 쿠키에 리프레시토큰 저장
                localStorage.setItem("accessToken", res.data.accessToken); // 로컬스토리지에 엑세스 토큰 저장
                localStorage.setItem("expireTime", res.data.tokenExpiresIn); // 엑세스토큰 만료시간 저장
                navi("/");
            }
        }).catch(error => {
            console.log(error.response);
            alert("아이디 또는 비밀번호가 틀렸습니다");
        })

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src="../img_member/mainLogo.png" alt="logo" width="50%"/>
                    <Avatar sx={{m: 1, backgroundColor: "#B20710"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            autoFocus={true}
                            id="username"
                            label="아이디"
                            name="username"
                            value={username}
                            onChange={inputValue}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={inputValue}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            로그인
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    아이디 또는 비밀번호 찾기
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    회원가입
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default LoginForm;