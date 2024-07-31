import React from 'react'

import styles from './SpinnerLoading.module.css'

const SpinnerLoading: React.FC = () => {
    return (
        <div className={styles.spinner_page}>
            <div className={styles.spinner_container}>
                <img
                    className={styles.spinner}
                    src='https://icons8.com/preloaders/preloaders/1494/Spinner-2.gif'
                    alt="Loading..."
                />
            </div>
        </div>
    )
}

export default SpinnerLoading
