import { useState } from "react";
import { Boxes, CreditCard, Database, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { setCredentials } from "../store/slices/authSlice";

export default function Login(){
  const dispatch=useDispatch(),navigate=useNavigate();
  const [mode,setMode]=useState("login"),[form,setForm]=useState({name:"",email:"",password:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  async function submit(e){
    e.preventDefault();setBusy(true);setError("");
    try{const {data}=await api.post(mode==="login"?"/auth/login":"/auth/register",form);dispatch(setCredentials(data));navigate("/")}
    catch(err){setError(err.response?.data?.message||"Request failed.")}
    finally{setBusy(false)}
  }
  return <div className="min-h-screen bg-[#07111f] p-4 md:p-8"><div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl md:grid-cols-[1.1fr_.9fr] md:min-h-[calc(100vh-4rem)]">
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#101d35] via-[#101b34] to-[#253665] p-10 text-white md:block"><div className="absolute -right-20 -top-20 size-80 rounded-full bg-indigo-500/20 blur-3xl"/><div className="relative z-10 flex h-full flex-col justify-between"><div>
      <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-indigo-600"><Boxes size={24}/></div><div><p className="font-extrabold">ERP Pro</p><p className="text-xs text-slate-400">MERN management suite</p></div></div>
      <h1 className="mt-20 max-w-xl text-5xl font-black leading-[1.03] tracking-tight">One dashboard for people, learning & operations.</h1>
      <p className="mt-6 max-w-lg text-sm leading-6 text-slate-300">Employees, salary checkout, schools, courses, students and inventory in one workspace.</p>
    </div><div className="grid gap-3 text-sm"><Feature icon={ShieldCheck} text="JWT protected API + admin permissions"/><Feature icon={CreditCard} text="Razorpay Checkout salary workflow"/><Feature icon={Database} text="MongoDB + Cloudinary ready"/></div></div></div>
    <div className="grid place-items-center p-6 md:p-10"><motion.div className="w-full max-w-md" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><div className="mb-8"><div className="mb-4 grid size-14 place-items-center rounded-2xl bg-indigo-600 text-white md:hidden"><Boxes size={27}/></div><h2 className="text-3xl font-black tracking-tight">{mode==="login"?"Welcome back":"Create admin account"}</h2><p className="mt-2 text-sm text-slate-500">{mode==="login"?"Sign in to your ERP workspace.":"The first registered user automatically becomes admin."}</p></div>
      {error&&<div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form className="space-y-4" onSubmit={submit}>{mode==="register"&&<label><span className="label">Name</span><input className="field" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>}<label><span className="label">Email</span><input className="field" required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label><span className="label">Password</span><input className="field" required minLength="6" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></label><button disabled={busy} className="btn-primary w-full py-3">{mode==="login"?<LogIn size={17}/>:<UserPlus size={17}/>} {busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button></form>
      <button className="mt-5 w-full text-sm font-semibold text-indigo-600" onClick={()=>{setMode(mode==="login"?"register":"login");setError("")}}>{mode==="login"?"New here? Create an account":"Already have an account? Sign in"}</button>
    </motion.div></div>
  </div></div>
}
function Feature({icon:Icon,text}){return <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200"><Icon size={17} className="text-indigo-300"/>{text}</div>}
