import React, { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../styles/User.module.css'
import Modal from '../../components/UI/Modal/Modal'
import { fetcher } from '../../utils/fetcher'
import { ImageType, UserType } from '../../types/types'
import ErrorPage from '../404'
import {uploadImage} from "../../utils/uploadImage";

type ContextType = {
    params: { slug: string }
}

export const getServerSideProps = async (context: ContextType) => {
    const { slug } = context.params

    const res = await fetch(`https://frontend-test-api.yoldi.agency/api/user/${slug}`)
    const data: UserType = await res.json()

    return {
        props: { user: data },
    }
}

interface UserProps {
    user: UserType
}

const User: React.FC<UserProps> = ({ user }) => {
    const [newName, setNewName] = useState<string>('')
    const [newSlug, setNewSlug] = useState<string>('')
    const [newDesc, setNewDesc] = useState<string>('')
    const [visible, setVisible] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>('')

    const { push } = useRouter()
    const { mutate } = useSWRConfig()

    const { data, isValidating } = useSWR<UserType>(`/profile`, () =>
        fetcher(`/profile`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-API-KEY': String(token),
            },
        }),
    )

    const guest = data?.slug !== user.slug

    useEffect(() => {
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }, [visible])

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])

    useEffect(() => {
        if (token) {
            mutate(
                `/profile`,
                fetcher(`/profile`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'X-API-KEY': token,
                    },
                }),
            )
        }
    }, [token])

    useEffect(() => {
        if (data) {
            setNewName(data.name)
            setNewSlug(data.slug)
            setNewDesc(data.description)
        }
    }, [isValidating])

    const changeProfile = async () => {
        const userData = {
            name: newName?.trim(),
            slug: newSlug?.trim(),
            description: newDesc?.trim(),
        }

        await mutate(
            `/profile`,
            fetcher(`/profile`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    'X-API-KEY': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }),
        )
        setVisible(!visible)
        push(`/users/${newSlug.trim()}`)
    }

    const changeCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0]!
        const fileData = new FormData()
        fileData.append('file', image, image.name)

        let id
        const response = uploadImage(fileData)
        await response.then((res: ImageType) => (id = res.id))

        const userData = { name: newName, slug: newSlug, coverId: id }

        await mutate(
            `/profile`,
            fetcher(`/profile`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    'X-API-KEY': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }),
        )
        push(`/users/${newSlug}`)
    }

    const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0]!
        const fileData = new FormData()
        fileData.append('file', image, image.name)

        let id
        const response = uploadImage(fileData)
        await response.then((res: ImageType) => (id = res.id))

        const userData = { name: newName, slug: newSlug, imageId: id }

        await mutate(
            `/profile`,
            fetcher(`/profile`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    'X-API-KEY': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }),
        )
        push(`/users/${newSlug}`)
    }

    const deleteCover = async () => {
        const userData = { name: newName, slug: newSlug, coverId: null }

        await mutate(
            `/profile`,
            fetcher(`/profile`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    'X-API-KEY': String(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }),
        )
        push(`/users/${newSlug}`)
    }

    const closeModal = () => {
        setVisible(!visible)
        if (data) {
            setNewName(data.name)
            setNewSlug(data.slug)
            setNewDesc(data.description)
        }
    }

    const logOut = () => {
        localStorage.removeItem('token')
        push('/auth')
    }

    if (user.statusCode === 404) {
        return <ErrorPage />
    }

    return (
        <>
            <Head>
                <title>{guest ? `Страница пользователя ${user.name}` : 'Моя страница'}</title>
                <meta property="og:title" content="Страница пользователя" key="title" />
            </Head>

            <div
                className={styles.user_page}
                style={visible ? { height: 'calc(100vh - 80px)', overflow: 'hidden' } : {}}
            >
                <div
                    className={styles.profile_background}
                    style={{ backgroundImage: `url(${user?.cover?.url})` }}
                >
                    {!guest && (
                        <div className={styles.profile_image}>
                            {!user?.cover?.url ? (
                                <label>
                                    <input
                                        type="file"
                                        name="file"
                                        hidden
                                        onChange={(e) => changeCover(e)}
                                    />
                                    <div className={styles.input_file}>
                                        <svg
                                            width="15"
                                            height="20"
                                            viewBox="0 0 15 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7.5 0.307617L6.93848 0.844727L1.46973 6.31348L2.59277 7.43652L6.71875 3.31055V16.25H8.28125V3.31055L12.4072 7.43652L13.5303 6.31348L8.06152 0.844727L7.5 0.307617ZM0.46875 17.8125V19.375H14.5312V17.8125H0.46875Z"
                                                fill="black"
                                            />
                                        </svg>
                                        Загрузить
                                        <svg
                                            width="23"
                                            height="18"
                                            viewBox="0 0 23 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0.5625 0.40625V17.5938H22.4375V0.40625H0.5625ZM2.125 1.96875H20.875V12.833L16.749 8.68262L16.1875 8.12109L12.6475 11.6611L8.15527 7.12012L7.59375 6.55859L2.125 12.0273V1.96875ZM17.75 3.53125C16.8864 3.53125 16.1875 4.2301 16.1875 5.09375C16.1875 5.9574 16.8864 6.65625 17.75 6.65625C18.6136 6.65625 19.3125 5.9574 19.3125 5.09375C19.3125 4.2301 18.6136 3.53125 17.75 3.53125ZM7.59375 8.78027L14.7715 16.0312H2.125V14.249L7.59375 8.78027ZM16.1875 10.3428L20.875 15.0303V16.0312H16.9932L13.7461 12.7598L16.1875 10.3428Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                </label>
                            ) : (
                                <div className={styles.input_file} onClick={deleteCover}>
                                    <svg
                                        width="18"
                                        height="20"
                                        viewBox="0 0 18 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.4375 0.625C7.02856 0.625 6.61047 0.768433 6.31445 1.06445C6.01843 1.36047 5.875 1.77856 5.875 2.1875V2.96875H0.40625V4.53125H1.26074L2.75 18.667L2.82324 19.375H15.1768L15.25 18.667L16.7393 4.53125H17.5938V2.96875H12.125V2.1875C12.125 1.77856 11.9816 1.36047 11.6855 1.06445C11.3895 0.768433 10.9714 0.625 10.5625 0.625H7.4375ZM7.4375 2.1875H10.5625V2.96875H7.4375V2.1875ZM2.84766 4.53125H15.1523L13.7607 17.8125H4.23926L2.84766 4.53125ZM5.875 6.875V15.4688H7.4375V6.875H5.875ZM8.21875 6.875V15.4688H9.78125V6.875H8.21875ZM10.5625 6.875V15.4688H12.125V6.875H10.5625Z"
                                            fill="black"
                                        />
                                    </svg>
                                    Удалить
                                    <svg
                                        width="23"
                                        height="18"
                                        viewBox="0 0 23 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0.5625 0.40625V17.5938H22.4375V0.40625H0.5625ZM2.125 1.96875H20.875V12.833L16.749 8.68262L16.1875 8.12109L12.6475 11.6611L8.15527 7.12012L7.59375 6.55859L2.125 12.0273V1.96875ZM17.75 3.53125C16.8864 3.53125 16.1875 4.2301 16.1875 5.09375C16.1875 5.9574 16.8864 6.65625 17.75 6.65625C18.6136 6.65625 19.3125 5.9574 19.3125 5.09375C19.3125 4.2301 18.6136 3.53125 17.75 3.53125ZM7.59375 8.78027L14.7715 16.0312H2.125V14.249L7.59375 8.78027ZM16.1875 10.3428L20.875 15.0303V16.0312H16.9932L13.7461 12.7598L16.1875 10.3428Z"
                                            fill="black"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.contaiter}>
                    <div
                        className={styles.user_img}
                        style={{ backgroundImage: `url(${user?.image?.url})` }}
                    >
                        {!guest && (
                            <label>
                                <input
                                    type="file"
                                    name="file"
                                    hidden
                                    onChange={(e) => changeImage(e)}
                                />
                                <div className={styles.input_icon}>
                                    <svg
                                        width="42"
                                        height="32"
                                        viewBox="0 0 42 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.9688 0.375L13.4805 1.00977L11.625 3.5H0.6875V31.625H41.3125V3.5H30.375L28.5195 1.00977L28.0312 0.375H13.9688ZM15.5312 3.5H26.4688L28.3242 5.99023L28.8125 6.625H38.1875V28.5H3.8125V6.625H13.1875L13.6758 5.99023L15.5312 3.5ZM8.5 8.1875C7.6394 8.1875 6.9375 8.8894 6.9375 9.75C6.9375 10.6106 7.6394 11.3125 8.5 11.3125C9.3606 11.3125 10.0625 10.6106 10.0625 9.75C10.0625 8.8894 9.3606 8.1875 8.5 8.1875ZM21 8.1875C15.8425 8.1875 11.625 12.405 11.625 17.5625C11.625 22.72 15.8425 26.9375 21 26.9375C26.1575 26.9375 30.375 22.72 30.375 17.5625C30.375 12.405 26.1575 8.1875 21 8.1875ZM21 11.3125C24.4729 11.3125 27.25 14.0896 27.25 17.5625C27.25 21.0354 24.4729 23.8125 21 23.8125C17.5271 23.8125 14.75 21.0354 14.75 17.5625C14.75 14.0896 17.5271 11.3125 21 11.3125Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                            </label>
                        )}
                        <h3 className={!guest ? styles.user_logo : styles.guest_logo}>
                            {!user?.image?.url && user?.name[0]}
                        </h3>
                    </div>

                    <div className={styles.user_info}>
                        <div>
                            <h2 className={styles.user_name}>{user.name}</h2>
                            <h3 className={styles.user_email}>{user.email}</h3>
                        </div>
                        {!guest && (
                            <button
                                onClick={() => setVisible(!visible)}
                                className={styles.change_info_btn}
                            >
                                <svg
                                    className={styles.user_info_btn_icon}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.6768 0.600586C15.8589 0.600586 15.041 0.917969 14.4062 1.55273L2.05273 13.9062L2.00391 14.1504L1.14941 18.4473L0.905273 19.5947L2.05273 19.3506L6.34961 18.4961L6.59375 18.4473L18.9473 6.09375C20.2168 4.82422 20.2168 2.82227 18.9473 1.55273C18.3125 0.917969 17.4946 0.600586 16.6768 0.600586ZM16.6768 2.08984C17.0704 2.08984 17.4672 2.2699 17.8486 2.65137C18.6085 3.41125 18.6085 4.23523 17.8486 4.99512L17.2871 5.53223L14.9678 3.21289L15.5049 2.65137C15.8864 2.2699 16.2831 2.08984 16.6768 2.08984ZM13.8691 4.31152L16.1885 6.63086L6.74023 16.0791C6.22754 15.0781 5.42188 14.2725 4.4209 13.7598L13.8691 4.31152ZM3.41992 15.0293C4.35681 15.4077 5.09229 16.1432 5.4707 17.0801L2.90723 17.5928L3.41992 15.0293Z"
                                        fill="black"
                                    />
                                </svg>
                                <a>Редактировать</a>
                            </button>
                        )}
                    </div>

                    <div className={styles.user_description}>{user.description}</div>
                    {!guest && (
                        <button tabIndex={-1} className={styles.change_info_btn} onClick={logOut}>
                            <svg
                                className={styles.user_info_btn_icon}
                                width="19"
                                height="20"
                                viewBox="0 0 19 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.5 0.625C4.33032 0.625 0.125 4.83032 0.125 10C0.125 15.1697 4.33032 19.375 9.5 19.375C12.6647 19.375 15.4692 17.8033 17.166 15.3955L15.8965 14.4922C14.4835 16.5002 12.1489 17.8125 9.5 17.8125C5.17566 17.8125 1.6875 14.3243 1.6875 10C1.6875 5.67566 5.17566 2.1875 9.5 2.1875C12.1489 2.1875 14.4805 3.49976 15.8965 5.50781L17.166 4.60449C15.4692 2.19666 12.6647 0.625 9.5 0.625ZM15.2373 6.31348L14.1143 7.43652L15.8965 9.21875H6.375V10.7812H15.8965L14.1143 12.5635L15.2373 13.6865L18.3623 10.5615L18.8994 10L18.3623 9.43848L15.2373 6.31348Z"
                                    fill="black"
                                />
                            </svg>
                            <a>Выйти</a>
                        </button>
                    )}
                </div>
            </div>

            <Modal
                visible={visible}
                newName={newName}
                setNewName={setNewName}
                newSlug={newSlug}
                setNewSlug={setNewSlug}
                newDesc={newDesc}
                setNewDesc={setNewDesc}
                closeModal={closeModal}
                changeProfile={changeProfile}
            />
        </>
    )
}

export default User
