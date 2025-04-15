import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    loading: false,
    error: {},
  },
  reducers: {
    createCategory: (state, action) => {
      console.log("Create");
    },
    updateCategory: (state, action) => {
      console.log("Update");
    },
    deleteCategory: (state, action) => {
      console.log("Delete");
    },
  },
});

export const { createCategory, updateCategory, deleteCategory } = categorySlice.actions;

export default categorySlice.reducer;
