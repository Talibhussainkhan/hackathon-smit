import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {}
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      if (!values.password) errors.password = 'Password is required'
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/signin`,
          { email: values.email, password: values.password },
          { withCredentials: true }   // sends / receives the httpOnly cookie
        )
        dispatch(loginSuccess(data))  // save user in Redux + localStorage
        toast.success('Welcome back!')
        navigate('/')
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Login failed. Please try again.'
        toast.error(message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white text-gray-500 w-full max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login Now</h2>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border my-3 outline-none rounded-full py-2.5 px-4 ${
            formik.touched.email && formik.errors.email
              ? 'border-red-400'
              : 'border-gray-500/30'
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs -mt-2 mb-1 px-4">{formik.errors.email}</p>
        )}

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border mt-1 outline-none rounded-full py-2.5 px-4 ${
            formik.touched.password && formik.errors.password
              ? 'border-red-400'
              : 'border-gray-500/30'
          }`}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-1 mb-1 px-4">{formik.errors.password}</p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-4 w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <span className=" w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Signing in…
            </>
          ) : (
            'Log in'
          )}
        </button>

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline">Signup Now</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
