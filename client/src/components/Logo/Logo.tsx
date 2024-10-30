import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const Logo = (props: Props) => {
    return (
        <Link to={'/'} className="logo text-2xl xs:text-3xl font-semibold text-white">
            Meme<span className='text-dark-teal'>Flim</span>
        </Link>
    )
}

export default Logo