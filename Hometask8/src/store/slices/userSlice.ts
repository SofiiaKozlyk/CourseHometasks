import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doLogin, doRegister } from '../../api/userActions';
import { UserFormPropsI } from '../../api/userActions';

enum UserState {
    loggedIn = 'loggedIn',
    loggedOut = 'loggedOut',
    tryingLogin = 'tryingLogin',
}

export interface UserStateI {
    key: string | null,
    isAuthenticated: boolean,
    state: UserState
}

export const doLoginThunk = createAsyncThunk('api/auth/login', async (userData: UserFormPropsI) => {
    const response = await doLogin(userData);
    console.log(response);
    return response.data;
});

export const doRegisterThunk = createAsyncThunk('users/register', async (userData: UserFormPropsI) => {
    const response = await doRegister(userData);
    return response.data;
});

const getKeyValue = () => localStorage.getItem('token') ? localStorage.getItem('token') : null;

const initialState: UserStateI = {
    key: getKeyValue(),
    isAuthenticated: false,
    state: UserState.loggedOut
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.key = null;
            localStorage.removeItem('token');
            state.isAuthenticated = false;
            state.state = UserState.loggedOut;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(doLoginThunk.fulfilled, (state, action) => {
            console.log(action.payload);
            state.key = action.payload.access_token;
            localStorage.setItem('token', action.payload.access_token);
            state.isAuthenticated = true;
            state.state = UserState.loggedIn;
        });
        builder.addCase(doLoginThunk.rejected, (state, action) => {
            state.key = null;
            state.isAuthenticated = false;
            state.state = UserState.loggedOut;
        });
        builder.addCase(doLoginThunk.pending, (state, action) => {
            state.key = null;
            state.isAuthenticated = false;
            state.state = UserState.tryingLogin;
        });
        builder.addCase(doRegisterThunk.fulfilled, (state, action) => {
            state.key = null;
            state.isAuthenticated = false;
            state.state = UserState.loggedOut;
        });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;