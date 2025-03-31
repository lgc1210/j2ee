import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
    loading: false,
    error: {},
  },
  reducers: {
    createUser: (state, action) => {
      console.log("Create");
    },
    updateUser: (state, action) => {
      console.log("Update");
    },
    deleteUser: (state, action) => {
      console.log("Delete");
    },
    changePassword: (state, action) => {
      const { id, password } = action.payload;
    },
  },
});

export const { createUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
