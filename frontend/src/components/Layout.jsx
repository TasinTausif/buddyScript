import { Outlet, Link, useNavigate } from 'react-router-dom'
import Header from './Header'
import useAuth from '../hooks/useAuth'

const Layout = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async (e) => {
        e.preventDefault()
        await logout()
        navigate('/')
    }

    return (
        <div className='_layout _layout_main_wrapper'>
            <div className='_main_layout'>
                <Header />

                {/* Mobile Menu Start */}
                <div className='_header_mobile_menu'>
                    <div className='_header_mobile_menu_wrap'>
                        <div className='container'>
                            <div className='_header_mobile_menu'>
                                <div className='row'>
                                    <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
                                        <div className='_header_mobile_menu_top_inner'>
                                            <div className='_header_mobile_menu_logo'>
                                                <Link to='/feed' className='_mobile_logo_link'>
                                                    <img src='/assets/images/logo.svg' alt='Logo' className='_nav_logo' />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu End */}

                {/* Mobile Bottom Navigation */}
                <div className='_mobile_navigation_bottom_wrapper'>
                    <div className='_mobile_navigation_bottom_wrap'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-xl-12 col-lg-12 col-md-12'>
                                    <ul className='_mobile_navigation_bottom_list d-flex justify-content-around align-items-center w-100 ps-0 mb-0' style={{ listStyle: 'none' }}>
                                        <li className='_mobile_navigation_bottom_item'>
                                            <Link to='/feed' className='_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='27' fill='none' viewBox='0 0 24 27'>
                                                    <path className='_mobile_svg' fill='currentColor' fillOpacity='.6' stroke='#666666' strokeWidth='1.5' d='M1 13.042c0-2.094 0-3.141.431-4.061.432-.92 1.242-1.602 2.862-2.965l1.571-1.321C8.792 2.232 10.256 1 12 1c1.744 0 3.208 1.232 6.136 3.695l1.572 1.321c1.62 1.363 2.43 2.044 2.86 2.965.432.92.432 1.967.432 4.06v6.54c0 2.908 0 4.362-.92 5.265-.921.904-2.403.904-5.366.904H7.286c-2.963 0-4.445 0-5.365-.904C1 23.944 1 22.49 1 19.581v-6.54z'/>
                                                    <path fill='#fff' stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9.07 18.497h5.857v7.253H9.07v-7.253z'/>
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className='_mobile_navigation_bottom_item'>
                                            <Link to='/my-posts' className='_mobile_navigation_bottom_link'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                                                    <path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' />
                                                    <polyline points='14 2 14 8 20 8' />
                                                    <line x1='16' y1='13' x2='8' y2='13' />
                                                    <line x1='16' y1='17' x2='8' y2='17' />
                                                    <polyline points='10 9 9 9 8 9' />
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className='_mobile_navigation_bottom_item'>
                                            <a href='#logout' onClick={handleLogout} className='_mobile_navigation_bottom_link'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                                                    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                                                    <polyline points='16 17 21 12 16 7' />
                                                    <line x1='21' y1='12' x2='9' y2='12' />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Bottom Navigation End */}

                <div className='container _custom_container'>
                    <div className='_layout_inner_wrap'>
                        <main className='_layout_middle_wrap w-100'>
                            <div className='_layout_middle_inner w-100'>
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
