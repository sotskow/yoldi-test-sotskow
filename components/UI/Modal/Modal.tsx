import React from 'react'
import styles from './Modal.module.css'

interface ModalProps {
    visible: boolean
    newName: string
    newSlug: string
    newDesc: string
    setNewName: (e: string) => void
    setNewSlug: (e: string) => void
    setNewDesc: (e: string) => void
    closeModal: () => void
    changeProfile: () => void
}

const Modal: React.FC<ModalProps> = ({
    visible,
    newName,
    newSlug,
    newDesc,
    setNewName,
    setNewSlug,
    setNewDesc,
    closeModal,
    changeProfile,
}) => {
    const rootClasses = [styles.modal]

    if (visible) {
        rootClasses.push(styles.open)
    }

    return (
        <div className={rootClasses.join(' ')}>
            <div className={styles.modal_active} onClick={(event) => event.stopPropagation()}>
                <h1 className={styles.modal_header}>Редактировать профиль</h1>
                <div className={styles.modal_form}>
                    {!newName ? (
                        <div className={styles.modal_label_error}>Имя не может быть пустым</div>
                    ) : (
                        <div className={styles.modal_label}>Имя</div>
                    )}
                    <input
                        className={styles.modal_input}
                        placeholder={'Имя'}
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                    />
                    {!newSlug ? (
                        <div className={styles.modal_label_error}>
                            Адрес профиля не может быть пустым
                        </div>
                    ) : (
                        <div className={styles.modal_label}>Адрес профиля</div>
                    )}
                    <div style={{ display: 'flex' }}>
                        <input
                            className={styles.modal_input_example}
                            placeholder={'example.com/'}
                            disabled
                        />
                        <input
                            className={styles.modal_input_address}
                            placeholder={'Адрес профиля'}
                            value={newSlug}
                            onChange={(event) => setNewSlug(event.target.value)}
                        />
                    </div>
                    <div className={styles.modal_label}>Описание</div>
                    <textarea
                        placeholder="Описание"
                        className={styles.modal_textarea}
                        value={newDesc}
                        onChange={(event) => setNewDesc(event.target.value)}
                    />
                </div>
                <div className={styles.btns_area}>
                    <button onClick={closeModal} className={styles.cancel_btn}>
                        Отмена
                    </button>
                    <button
                        onClick={changeProfile}
                        className={styles.save_btn}
                        disabled={!newName || !newSlug}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal
