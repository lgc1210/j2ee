import { createSlice } from "@reduxjs/toolkit";

export const serviceSlice = createSlice({
  name: "service",
  initialState: {
    data: [],
    loading: false,
    error: {},
  },
  reducers: {
    createService: (state, action) => {
      console.log("Create");
    },
    updateService: (state, action) => {
      console.log("Update");
    },
    deleteService: (state, action) => {
      console.log("Delete");
    },
  },
});

export const { createService, updateService, deleteService } =
  serviceSlice.actions;

export default serviceSlice.reducer;
