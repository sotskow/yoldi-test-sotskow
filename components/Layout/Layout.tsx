import React from 'react'
import { useRouter } from 'next/router'

import Footer from "./Footer/Footer";
import Header from "./Header/Header";

interface LayoutProps {
    children: JSX.Element[]
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { route } = useRouter()
    const isHide = route === '/auth' || route === '/register'

    return (
        <>
            <Header />
            {children}
            {isHide && <Footer route={route} />}
        </>
    )
}

export default Layout
