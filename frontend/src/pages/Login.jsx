import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        setLoading(true)

        try {
            await login(form)
            navigate('/feed')
        } catch (error) {
            console.error(error.response?.data || error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='_social_login_wrapper _layout_main_wrapper'>
            <div className='_shape_one'>
                <img src='/assets/images/shape1.svg' className='_shape_img' />
                <img
                    src='/assets/images/dark_shape.svg'
                    className='_dark_shape'
                />
            </div>

            <div className='_shape_two'>
                <img src='/assets/images/shape2.svg' className='_shape_img' />
                <img
                    src='/assets/images/dark_shape1.svg'
                    className='_dark_shape _dark_shape_opacity'
                />
            </div>

            <div className='_shape_three'>
                <img src='/assets/images/shape3.svg' className='_shape_img' />
                <img
                    src='/assets/images/dark_shape2.svg'
                    className='_dark_shape _dark_shape_opacity'
                />
            </div>

            <div className='_social_login_wrap'>
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-lg-8'>
                            <img
                                src='/assets/images/login.png'
                                className='img-fluid'
                                alt=''
                            />
                        </div>

                        <div className='col-lg-4'>
                            <img
                                src='/assets/images/logo.svg'
                                className='_mar_b28'
                                alt=''
                            />

                            <p className='_mar_b8'>Welcome back</p>

                            <h4 className='_titl4 _mar_b50'>
                                Login to your account
                            </h4>

                            <form
                                className='_social_login_form'
                                onSubmit={handleSubmit}>
                                <div className='_mar_b14'>
                                    <label>Email</label>

                                    <input
                                        type='email'
                                        name='email'
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className='form-control _social_login_input'
                                    />
                                </div>

                                <div className='_mar_b14'>
                                    <label>Password</label>

                                    <input
                                        type='password'
                                        name='password'
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className='form-control _social_login_input'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='_social_login_form_btn_link _btn1 w-100 mt-4'>
                                    {loading ? 'Logging in...' : 'Login Now'}
                                </button>
                            </form>

                            <div className='mt-4 text-center'>
                                Don't have an account?
                                <Link to='/register' className='ms-2'>
                                    Create New Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
