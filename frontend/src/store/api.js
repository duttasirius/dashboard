import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({
  baseUrl:import.meta.env.VITE_API_URL || "/api",
  prepareHeaders:(headers)=>{
    const token=localStorage.getItem("erp_token");
    if(token)headers.set("authorization",`Bearer ${token}`);
    return headers;
  }
});

export const api=createApi({
  reducerPath:"api",
  baseQuery,
  tagTypes:["Dashboard","Employees","Products","Schools","Courses","Students","Payments"],
  endpoints:(builder)=>({
    getDashboard:builder.query({query:()=>"/dashboard",providesTags:["Dashboard","Employees","Products","Schools","Courses","Students","Payments"]}),

    getEmployees:builder.query({
      query:({search="",page=1,limit=10,status="",department=""})=>`/employees?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}&status=${encodeURIComponent(status)}&department=${encodeURIComponent(department)}`,
      providesTags:["Employees"]
    }),
    createEmployee:builder.mutation({query:body=>({url:"/employees",method:"POST",body}),invalidatesTags:["Employees","Dashboard"]}),
    updateEmployee:builder.mutation({query:({id,...body})=>({url:`/employees/${id}`,method:"PUT",body}),invalidatesTags:["Employees","Dashboard"]}),
    deleteEmployee:builder.mutation({query:id=>({url:`/employees/${id}`,method:"DELETE"}),invalidatesTags:["Employees","Dashboard","Payments"]}),

    getProducts:builder.query({
      query:({search="",page=1,limit=10,category=""})=>`/products?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}&category=${encodeURIComponent(category)}`,
      providesTags:["Products"]
    }),
    createProduct:builder.mutation({query:body=>({url:"/products",method:"POST",body}),invalidatesTags:["Products","Dashboard"]}),
    updateProduct:builder.mutation({query:({id,...body})=>({url:`/products/${id}`,method:"PUT",body}),invalidatesTags:["Products","Dashboard"]}),
    deleteProduct:builder.mutation({query:id=>({url:`/products/${id}`,method:"DELETE"}),invalidatesTags:["Products","Dashboard"]}),

    getSchools:builder.query({query:({search="",page=1,limit=10})=>`/schools?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,providesTags:["Schools"]}),
    createSchool:builder.mutation({query:body=>({url:"/schools",method:"POST",body}),invalidatesTags:["Schools","Dashboard","Students"]}),
    updateSchool:builder.mutation({query:({id,...body})=>({url:`/schools/${id}`,method:"PUT",body}),invalidatesTags:["Schools","Dashboard","Students"]}),
    deleteSchool:builder.mutation({query:id=>({url:`/schools/${id}`,method:"DELETE"}),invalidatesTags:["Schools","Dashboard","Students"]}),

    getCourses:builder.query({query:({search="",page=1,limit=10})=>`/courses?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,providesTags:["Courses"]}),
    createCourse:builder.mutation({query:body=>({url:"/courses",method:"POST",body}),invalidatesTags:["Courses","Dashboard","Students"]}),
    updateCourse:builder.mutation({query:({id,...body})=>({url:`/courses/${id}`,method:"PUT",body}),invalidatesTags:["Courses","Dashboard","Students"]}),
    deleteCourse:builder.mutation({query:id=>({url:`/courses/${id}`,method:"DELETE"}),invalidatesTags:["Courses","Dashboard","Students"]}),

    getStudents:builder.query({query:({search="",page=1,limit=10,school="",course="",status=""})=>`/students?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}&school=${encodeURIComponent(school)}&course=${encodeURIComponent(course)}&status=${encodeURIComponent(status)}`,providesTags:["Students"]}),
    createStudent:builder.mutation({query:body=>({url:"/students",method:"POST",body}),invalidatesTags:["Students","Dashboard"]}),
    updateStudent:builder.mutation({query:({id,...body})=>({url:`/students/${id}`,method:"PUT",body}),invalidatesTags:["Students","Dashboard"]}),
    deleteStudent:builder.mutation({query:id=>({url:`/students/${id}`,method:"DELETE"}),invalidatesTags:["Students","Dashboard"]}),

    getPayments:builder.query({query:({page=1,limit=10,status="",month=""})=>`/payments?page=${page}&limit=${limit}&status=${encodeURIComponent(status)}&month=${encodeURIComponent(month)}`,providesTags:["Payments"]}),
    createPaymentOrder:builder.mutation({query:body=>({url:"/payments/create-order",method:"POST",body}),invalidatesTags:["Payments"]}),
    verifyPayment:builder.mutation({query:body=>({url:"/payments/verify",method:"POST",body}),invalidatesTags:["Payments","Dashboard"]})
  })
});

export const {
  useGetDashboardQuery,
  useGetEmployeesQuery,useCreateEmployeeMutation,useUpdateEmployeeMutation,useDeleteEmployeeMutation,
  useGetProductsQuery,useCreateProductMutation,useUpdateProductMutation,useDeleteProductMutation,
  useGetSchoolsQuery,useCreateSchoolMutation,useUpdateSchoolMutation,useDeleteSchoolMutation,
  useGetCoursesQuery,useCreateCourseMutation,useUpdateCourseMutation,useDeleteCourseMutation,
  useGetStudentsQuery,useCreateStudentMutation,useUpdateStudentMutation,useDeleteStudentMutation,
  useGetPaymentsQuery,useCreatePaymentOrderMutation,useVerifyPaymentMutation
}=api;
