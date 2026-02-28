import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: (() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })(),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        logoutSuccess: (state) => {
            state.user = null
            localStorage.removeItem('user')
        },
    },
})

export const { loginSuccess, logoutSuccess } = authSlice.actions
export default authSlice.reducer
