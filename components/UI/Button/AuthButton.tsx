import React from 'react'

import styles from './AuthButton.module.css'

interface AuthButtonProps {
    disabled: boolean
    onClick: () => void
    loading: boolean
    text: string
}

const AuthButton: React.FC<AuthButtonProps> = (props) => {
    return (
        <button className={styles.auth_btn} {...props}>
            {!props.loading ? (
                props.text
            ) : (
                <img
                    className={styles.spinner}
                    src="https://img.icons8.com/ios-filled/35/ffffff/iphone-spinner--v1.png"
                    alt="..."
                />
            )}
        </button>
    )
}

export default AuthButton
