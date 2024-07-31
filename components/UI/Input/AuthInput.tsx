import React from 'react'

import styles from './AuthInput.module.css'

interface InputProps {
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type: string
}

const AuthInput: React.FC<InputProps> = (props) => {
    return (
        <div className={styles.input}>
            <input {...props} className={styles.input_field}></input>
        </div>
    )
}

export default AuthInput
