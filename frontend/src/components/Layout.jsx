import { AnimatePresence,motion } from "framer-motion";
import { BookOpen,Boxes,ChevronRight,CreditCard,GraduationCap,LayoutDashboard,LogOut,Menu,School,Users,X } from "lucide-react";
import { NavLink,Outlet,useLocation,useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { closeSidebar,toggleSidebar } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";

const links=[
  {to:"/",label:"Dashboard",icon:LayoutDashboard,end:true},
  {to:"/employees",label:"Employees",icon:Users},
  {to:"/payments",label:"Payments",icon:CreditCard},
  {to:"/students",label:"Students",icon:GraduationCap},
  {to:"/schools",label:"Schools",icon:School},
  {to:"/courses",label:"Courses",icon:BookOpen}
];

export default function Layout(){
  const dispatch=useDispatch(),navigate=useNavigate(),location=useLocation();
  const {user}=useSelector(s=>s.auth),{sidebarOpen}=useSelector(s=>s.ui);
  const signOut=()=>{dispatch(logout());navigate("/login")};
  const current=links.find(x=>x.to!=="/"&&location.pathname.startsWith(x.to))?.label||"Dashboard";

  return <div className="min-h-screen">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-[#07111f] text-white md:block"><Sidebar user={user} signOut={signOut}/></aside>
    <AnimatePresence>
      {sidebarOpen&&<>
        <motion.div className="fixed inset-0 z-40 bg-slate-950/50 md:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>dispatch(closeSidebar())}/>
        <motion.aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#07111f] text-white md:hidden" initial={{x:-320}} animate={{x:0}} exit={{x:-320}} transition={{type:"spring",stiffness:320,damping:30}}>
          <div className="flex justify-end p-4"><button onClick={()=>dispatch(closeSidebar())} className="p-2 text-slate-300"><X/></button></div>
          <Sidebar user={user} signOut={signOut} onNavigate={()=>dispatch(closeSidebar())}/>
        </motion.aside>
      </>}
    </AnimatePresence>

    <main className="md:ml-64">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-200 p-2.5 md:hidden" onClick={()=>dispatch(toggleSidebar())}><Menu size={19}/></button>
          <div><p className="text-[10px] font-black uppercase tracking-[.23em] text-indigo-600">ERP Pro</p><p className="text-sm font-bold text-slate-900">{current}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"><p className="text-xs font-bold text-slate-800">{user?.name}</p><p className="text-[11px] capitalize text-slate-400">{user?.role}</p></div>
          <div className="grid size-9 place-items-center rounded-full bg-indigo-600 text-xs font-black text-white">{user?.name?.slice(0,2).toUpperCase()}</div>
          <button className="icon-btn hidden sm:grid" title="Sign out" onClick={signOut}><LogOut size={17}/></button>
        </div>
      </header>
      <div className="p-4 md:p-7"><Outlet/></div>
    </main>
  </div>
}

function Sidebar({user,signOut,onNavigate}){
  return <div className="flex h-full flex-col px-3">
    <div className="flex items-center gap-3 px-3 pb-6 pt-3">
      <div className="grid size-10 place-items-center rounded-xl bg-indigo-600"><Boxes size={22}/></div>
      <div><p className="font-extrabold">ERP Pro</p><p className="text-[11px] text-slate-400">Management Suite</p></div>
    </div>
    <nav className="space-y-1">
      {links.map(({to,label,icon:Icon,end})=><NavLink key={to} to={to} end={end} onClick={onNavigate} className={({isActive})=>`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${isActive?"bg-white text-slate-950":"text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
        <span className="flex items-center gap-3"><Icon size={18}/>{label}</span><ChevronRight size={15} className="opacity-0 group-hover:opacity-50"/>
      </NavLink>)}
    </nav>
    <div className="mt-auto border-t border-slate-800 py-4">
      <div className="rounded-xl bg-slate-900 p-3"><p className="truncate text-sm font-semibold">{user?.name}</p><p className="mt-1 text-[11px] capitalize text-slate-400">{user?.role}</p></div>
      <button onClick={signOut} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"><LogOut size={17}/>Sign out</button>
    </div>
  </div>
}
