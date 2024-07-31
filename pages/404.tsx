import React from 'react'
import { useRouter } from 'next/router'

import styles from '../styles/Error.module.css'

const ErrorPage: React.FC = () => {
    const { push } = useRouter()

    return (
        <div className={styles.error_page}>
            <div className={styles.error_page_container}>
                <h1 className={styles.primary_header}>Увы, страница не найдена</h1>
                <h3 className={styles.secondary_header}>
                    К сожалению, вы зашли на несуществующую страницу. Возможно, вы перешли по старой
                    ссылке или ввели неправильный адрес.
                </h3>
                <h3 className={styles.secondary_header}>
                    Попробуйте проверить ссылку или вернитесь на главную страницу
                </h3>
                <div className={styles.btns}>
                    <button onClick={() => push('/users')} className={styles.btn}>
                        На главную
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
