import { createSlice } from "@reduxjs/toolkit";
const slice=createSlice({
  name:"ui",
  initialState:{sidebarOpen:false,toast:null},
  reducers:{
    toggleSidebar:s=>{s.sidebarOpen=!s.sidebarOpen},
    closeSidebar:s=>{s.sidebarOpen=false},
    showToast:(s,a)=>{s.toast=a.payload},
    clearToast:s=>{s.toast=null}
  }
});
export const {toggleSidebar,closeSidebar,showToast,clearToast}=slice.actions;
export default slice.reducer;
