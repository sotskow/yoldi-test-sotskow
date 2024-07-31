import React from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/UsersList.module.css'
import { UserType } from '../../types/types'
import SpinnerLoading from '../../components/UI/SpinnerLoading/SpinnerLoading'

export const getServerSideProps = async () => {
    const res = await fetch(`https://frontend-test-api.yoldi.agency/api/user`)
    const data: UserType[] = await res.json()

    return {
        props: { users: data },
    }
}

interface UsersProps {
    users: UserType[]
}

const UsersList: React.FC<UsersProps> = ({ users }) => {
    const { push } = useRouter()

    if (!users) {
        return <SpinnerLoading />
    }

    return (
        <div className={styles.users_page}>
            <div className={styles.contaiter}>
                <h1>Список аккаунтов</h1>
                <div className={styles.users_list}>
                    {users.map((user) => (
                        <div
                            className={styles.user_item}
                            key={user.slug}
                            onClick={() => push(`/users/${user.slug}`)}
                        >
                            <div
                                className={styles.user_item_icon}
                                style={{ backgroundImage: `url(${user?.image?.url})` }}
                            >
                                {!user?.image?.url && user?.name[0]}
                            </div>
                            <div className={styles.user_name}>{user.name}</div>
                            <div className={styles.user_email}>{user.email}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UsersList
