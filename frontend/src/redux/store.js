import { configureStore } from "@reduxjs/toolkit"
import authReduder from '../redux/features/auth/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReduder
    }
});

