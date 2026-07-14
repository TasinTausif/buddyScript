import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Header = () => {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const profileMenuRef = useRef(null)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '')
    }, [searchParams])

    useEffect(() => {
        const handleDocumentClick = event => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleDocumentClick)
        return () => document.removeEventListener('mousedown', handleDocumentClick)
    }, [])

    const handleLogout = async () => {
        setOpen(false)
        await logout()
        navigate('/')
    }

    const handleViewMyPosts = () => {
        setOpen(false)
        navigate('/my-posts')
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/feed?q=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/feed')
        }
    }

    return (
        <nav className='navbar navbar-expand-lg navbar-light _header_nav _padd_t10 py-3'>
            <div className='container _custom_container'>
                <div className='_logo_wrap'>
                    <Link className='navbar-brand' to='/feed'>
                        <img src='/assets/images/logo.svg' alt='Image' className='_nav_logo' />
                    </Link>
                </div>
                <button
                    className='navbar-toggler bg-light'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarSupportedContent'
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                    <div className='_header_nav_profile ms-auto' ref={profileMenuRef}>
                        <div className='_header_nav_profile_image'>
                            <button
                                type='button'
                                className='btn p-0 border-0 bg-transparent'
                                onClick={() => setOpen(prev => !prev)}
                                aria-label='Open profile menu'>
                                <img src='/assets/images/profile.png' alt='Image' className='_nav_profile_img' />
                            </button>
                        </div>
                        <div className='_header_nav_dropdown'>
                            <button
                                type='button'
                                className='btn p-0 border-0 bg-transparent text-decoration-none'
                                onClick={() => setOpen(prev => !prev)}
                                aria-label='Open profile menu'>
                                <span className='_header_nav_para'>{user?.name ?? 'Account'}</span>
                            </button>
                            <button
                                id='_profile_drop_show_btn'
                                className='_header_nav_dropdown_btn _dropdown_toggle'
                                type='button'
                                onClick={() => setOpen(prev => !prev)}>
                                <svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'>
                                    <path fill='#112032' d='M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z' />
                                </svg>
                            </button>
                        </div>

                        {open && (
                            <div id='_prfoile_drop' className='_nav_profile_dropdown _profile_dropdown show' style={{ display: 'block', top: '100%', right: 0 }}>
                                <div className='_nav_profile_dropdown_info'>
                                    <div className='_nav_profile_dropdown_image'>
                                        <img src='/assets/images/profile.png' alt='Image' className='_nav_drop_img' />
                                    </div>
                                    <div className='_nav_profile_dropdown_info_txt'>
                                        <h4 className='_nav_dropdown_title'>{user?.name}</h4>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleViewMyPosts}
                                            className='_nav_drop_profile'>
                                            View All My Posts
                                        </span>
                                    </div>
                                </div>
                                <hr />
                                <ul className='_nav_dropdown_list'>
                                    <li className='_nav_dropdown_list_item' style={{ cursor: 'pointer' }} onClick={handleLogout}>
                                        <span className='_nav_dropdown_link'>
                                            <div className='_nav_drop_info'>
                                                <span>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='19' height='19' fill='none' viewBox='0 0 19 19'>
                                                        <path stroke='#377DFF' strokeLinecap='round' stroke-linejoin="round" stroke-width="1.5" d='M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667'/>
                                                    </svg>			
                                                </span>
                                                Log Out		
                                            </div>
                                            <button type='button' className='_nav_drop_btn_link'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                                                    <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5"/>
                                                </svg>
                                            </button>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header
