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

  const demoCredentials = [
    { role: 'Admin', email: 'admin@gmail.com', password: '123456' },
    { role: 'Doctor', email: 'owais@dr.com', password: '123456' },
    { role: 'Receptionist', email: 'john@gmail.com', password: '123456' },
    { role: 'Patient', email: 'asad@patient.com', password: '123456' },
  ]

  const handleDemoClick = (email, password) => {
    formik.setFieldValue('email', email)
    formik.setFieldValue('password', password)
  }

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
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
      </form>

      <div className="mt-8 w-full max-w-[400px]">
        <h3 className="text-center text-gray-600 font-medium mb-4">Demo Credentials (Tap to Fill)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {demoCredentials.map((demo, index) => (
            <div
              key={index}
              onClick={() => handleDemoClick(demo.email, demo.password)}
              className="bg-white/70 backdrop-blur-md border border-white/50 p-3 rounded-xl cursor-pointer hover:bg-white hover:shadow-md transition-all active:scale-95 group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">
                  {demo.role}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 text-[10px]">
                  Fill →
                </span>
              </div>
              <p className="text-gray-700 font-medium text-xs truncate">{demo.email}</p>
              <p className="text-gray-400 text-[10px]">Password: {demo.password}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Login
