import React from 'react'
import { useRouter } from 'next/router'
import styles from './Footer.module.css'

interface FooterProps {
    route: string
}

const Footer: React.FC<FooterProps> = ({ route }) => {
    const { push } = useRouter()

    return (
        <div className={styles.footer}>
            <div className={styles.log_in}>
                {route === '/register' ? (
                    <>
                        <h4>Уже есть аккаунт?</h4>
                        <a onClick={() => push('/auth')}>Войти</a>
                    </>
                ) : (
                    <>
                        <h4>Еще нет аккаунта?</h4>
                        <a onClick={() => push('/register')}>Зарегистрироваться</a>
                    </>
                )}
            </div>
        </div>
    )
}

export default Footer
