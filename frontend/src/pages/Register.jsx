import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Register() {
    const navigate = useNavigate()
    const { register, authenticated } = useAuth()
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (authenticated) {
            navigate('/feed', { replace: true })
        }
    }, [authenticated, navigate])

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            setLoading(true)
            await register(form)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='_social_registration_wrapper _layout_main_wrapper'>
            <div className='_social_registration_wrap'>
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-lg-8'>
                            <img
                                src='/assets/images/registration.png'
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

                            <p>Get Started Now</p>

                            <h4 className='_mar_b50'>Registration</h4>

                            <form onSubmit={handleSubmit}>
                                <div className='_mar_b14'>
                                    <label>Name</label>

                                    <input
                                        type='text'
                                        name='name'
                                        value={form.name}
                                        onChange={handleChange}
                                        className='form-control _social_registration_input'
                                    />
                                </div>

                                <div className='_mar_b14'>
                                    <label>Email</label>

                                    <input
                                        type='email'
                                        name='email'
                                        value={form.email}
                                        onChange={handleChange}
                                        className='form-control _social_registration_input'
                                    />
                                </div>

                                <div className='_mar_b14'>
                                    <label>Password</label>

                                    <input
                                        type='password'
                                        name='password'
                                        value={form.password}
                                        onChange={handleChange}
                                        className='form-control _social_registration_input'
                                    />
                                </div>

                                <div className='_mar_b14'>
                                    <label>Confirm Password</label>

                                    <input
                                        type='password'
                                        name='password_confirmation'
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        className='form-control _social_registration_input'
                                    />
                                </div>

                                <button
                                    className='_social_registration_form_btn_link _btn1 w-100 mt-4'
                                    disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </form>

                            <div className='mt-4 text-center'>
                                Already have an account?
                                <Link to='/' className='ms-2'>
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
