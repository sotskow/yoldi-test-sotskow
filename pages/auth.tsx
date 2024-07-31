import React, { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRouter } from 'next/router'
import Head from 'next/head'

import AuthInput from '../components/UI/Input/AuthInput'
import AuthButton from '../components/UI/Button/AuthButton'
import styles from '../styles/Auth.module.css'
import { ResponseType } from '../types/types'

const Auth: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [hidePassword, setHidePassword] = useState<boolean>(true)
    const [response, setResponse] = useState<ResponseType>()

    const { push } = useRouter()

    const sendRequest = async (url: string, { arg }: Record<string, string>) => {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', accept: 'application/json' },
            body: JSON.stringify(arg),
        }).then(async (res) => setResponse(await res.json()))
    }

    const { trigger } = useSWRMutation(
        'https://frontend-test-api.yoldi.agency/api/auth/login',
        sendRequest,
    )

    const login = () => {
        const userData = { email: email.trim(), password: password.trim() }

        setError('')
        setLoading(true)
        trigger(userData)
    }

    useEffect(() => {
        if (response?.value) {
            localStorage.setItem('token', response.value)
            setError('')
            setLoading(false)
            push('/users')
        }

        if (response?.message) {
            setError(response.message)
            setLoading(false)
        }
    }, [response])

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            push('/users')
        }
    }, [])

    return (
        <>
            <Head>
                <title>Вход в Yoldi Agency</title>
                <meta property="og:title" content="Вход в Yoldi Agency" key="title" />
            </Head>

            <div className={styles.auth_page}>
                <div className={styles.auth_form}>
                    <h1 className={styles.auth_title}>Вход в Yoldi Agency</h1>
                    <div className={styles.svg_icons}>
                        <svg
                            className={styles.svg_icon_1}
                            width="21"
                            height="15"
                            viewBox="0 0 21 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0.34375 0.25V14.3125H20.6562V0.25H0.34375ZM3.71289 1.8125H17.2871L10.5 6.3291L3.71289 1.8125ZM1.90625 2.49609L10.0605 7.94043L10.5 8.20898L10.9395 7.94043L19.0938 2.49609V12.75H1.90625V2.49609Z"
                                fill="black"
                            />
                        </svg>
                        <AuthInput
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={'E-mail'}
                            type="text"
                            value={email}
                        />
                    </div>
                    <div className={styles.svg_icons}>
                        <svg
                            className={styles.svg_icon_1}
                            width="17"
                            height="21"
                            viewBox="0 0 17 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.5 0.34375C5.49707 0.34375 3.03125 2.80957 3.03125 5.8125V8.15625H0.6875V20.6562H16.3125V8.15625H13.9688V5.8125C13.9688 2.80957 11.5029 0.34375 8.5 0.34375ZM8.5 1.90625C10.6515 1.90625 12.4062 3.66101 12.4062 5.8125V8.15625H4.59375V5.8125C4.59375 3.66101 6.34851 1.90625 8.5 1.90625ZM2.25 9.71875H14.75V19.0938H2.25V9.71875Z"
                                fill="black"
                            />
                        </svg>
                        <AuthInput
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={'Пароль'}
                            type={hidePassword ? 'password' : 'text'}
                            value={password}
                        />
                        <svg
                            onClick={() => setHidePassword(!hidePassword)}
                            className={styles.svg_icon_2}
                            width="25"
                            height="13"
                            viewBox="0 0 25 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.5 0.25C5.98755 0.25 0.976562 5.9873 0.976562 5.9873L0.512695 6.5L0.976562 7.0127C0.976562 7.0127 5.54504 12.222 11.6211 12.7012C11.911 12.7378 12.2009 12.75 12.5 12.75C12.7991 12.75 13.089 12.7378 13.3789 12.7012C19.455 12.222 24.0234 7.0127 24.0234 7.0127L24.4873 6.5L24.0234 5.9873C24.0234 5.9873 19.0125 0.25 12.5 0.25ZM12.5 1.8125C14.2212 1.8125 15.8081 2.28247 17.1875 2.91113C17.6849 3.73511 17.9688 4.6842 17.9688 5.71875C17.9688 8.54163 15.8508 10.861 13.1104 11.1631C13.0951 11.1661 13.0768 11.16 13.0615 11.1631C12.8754 11.1722 12.6892 11.1875 12.5 11.1875C12.2925 11.1875 12.0911 11.1753 11.8896 11.1631C9.14917 10.861 7.03125 8.54163 7.03125 5.71875C7.03125 4.69946 7.30591 3.75037 7.78809 2.93555H7.76367C9.15527 2.29468 10.7605 1.8125 12.5 1.8125ZM12.5 3.375C11.2061 3.375 10.1562 4.4248 10.1562 5.71875C10.1562 7.0127 11.2061 8.0625 12.5 8.0625C13.7939 8.0625 14.8438 7.0127 14.8438 5.71875C14.8438 4.4248 13.7939 3.375 12.5 3.375ZM5.66406 4.10742C5.54199 4.63232 5.46875 5.16028 5.46875 5.71875C5.46875 7.08899 5.85938 8.37073 6.54297 9.4541C4.57458 8.3158 3.2074 6.95776 2.75879 6.5C3.13416 6.11548 4.18091 5.09619 5.66406 4.10742ZM19.3359 4.10742C20.8191 5.09619 21.8658 6.11548 22.2412 6.5C21.7926 6.95776 20.4254 8.3158 18.457 9.4541C19.1406 8.37073 19.5312 7.08899 19.5312 5.71875C19.5312 5.16028 19.458 4.62622 19.3359 4.10742Z"
                                fill={hidePassword ? '#838383' : '#000'}
                            />
                        </svg>
                    </div>
                    <h4 className={styles.auth_form_error}>{error ? error : ''}</h4>
                    <AuthButton
                        disabled={!email || !password}
                        onClick={login}
                        loading={loading}
                        text={'Войти'}
                    />
                </div>
            </div>
        </>
    )
}

export default Auth
