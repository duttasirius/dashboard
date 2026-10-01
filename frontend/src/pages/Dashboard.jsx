import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight,BookOpen,CreditCard,GraduationCap,School,Users,WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDashboardQuery } from "../store/api";
import StatCard from "../components/StatCard";
import PaySalaryModal from "../components/PaySalaryModal";
import { money,dateText } from "../utils/format";

export default function Dashboard(){
  const {user}=useSelector(s=>s.auth);
  const [payEmployee,setPayEmployee]=useState(null);
  const {data,isLoading,error}=useGetDashboardQuery();

  if(isLoading)return <div className="space-y-5"><div className="h-20 animate-pulse rounded-2xl bg-slate-200"/><div className="grid gap-4 md:grid-cols-4">{Array.from({length:4}).map((_,i)=><div className="h-32 animate-pulse rounded-2xl bg-slate-200" key={i}/>)}</div></div>;
  if(error)return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error.data?.message||"Unable to load dashboard."}</div>;

  const {stats,latestEmployees,latestStudents,recentPayments}=data;
  return <div className="space-y-6">
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
      <p className="text-[11px] font-bold uppercase tracking-[.22em] text-indigo-600">Overview</p>
      <div className="mt-1 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><h1 className="text-3xl font-black tracking-tight text-slate-950">Good to see you 👋</h1><p className="mt-1 text-sm text-slate-500">A live snapshot of your organization.</p></div>
        {user?.role==="admin"&&<Link to="/payments" className="btn-primary"><CreditCard size={17}/> Payments</Link>}
      </div>
    </motion.div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Users} label="Employees" value={stats.totalEmployees} sub={`${stats.activeEmployees} active`}/>
      <StatCard icon={GraduationCap} label="Students" value={stats.totalStudents} sub={`${stats.activeStudents} active`} iconClass="bg-cyan-50 text-cyan-600"/>
      <StatCard icon={School} label="Schools" value={stats.totalSchools} sub={`${stats.activeSchools} active`} iconClass="bg-amber-50 text-amber-600"/>
      <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} sub={`${stats.activeCourses} active`} iconClass="bg-violet-50 text-violet-600"/>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard icon={WalletCards} label="Monthly payroll" value={money(stats.monthlyPayroll)} sub={`${money(stats.paidPayroll)} paid · ${money(stats.pendingPayroll)} pending · ${stats.payrollMonth}`} iconClass="bg-emerald-50 text-emerald-600"/>
      <StatCard icon={CreditCard} label="Payment records" value={stats.paymentCount||0} sub="Salary payment records" iconClass="bg-indigo-50 text-indigo-600"/>
      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {user?.role==="admin"&&<Link className="btn-primary" to="/employees">Add / Pay employee</Link>}
          {user?.role==="admin"&&<Link className="btn-secondary" to="/students">Add student</Link>}
          {user?.role==="admin"&&<Link className="btn-secondary" to="/schools">Add school</Link>}
          {user?.role==="admin"&&<Link className="btn-secondary" to="/courses">Add course</Link>}
        </div>
      </div>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="card overflow-hidden">
        <Head icon={Users} title="Recent employees" href="/employees"/>
        <div className="divide-y divide-slate-100">
          {latestEmployees.map((e,i)=><motion.div key={e._id} initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay:i*.03}} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3"><Avatar name={e.name}/><div><p className="truncate text-sm font-bold">{e.name}</p><p className="truncate text-xs text-slate-500">{e.position} · {e.department}</p></div></div>
            <div className="flex items-center gap-3">
              <div className="text-right"><p className="text-sm font-semibold">{money(e.salary)}</p><span className={`badge ${status(e.status)}`}>{e.status}</span></div>
              {user?.role==="admin"&&<button className="btn-secondary px-3 py-2 text-emerald-700" onClick={()=>setPayEmployee(e)}><CreditCard size={15}/> Pay</button>}
            </div>
          </motion.div>)}
          {!latestEmployees.length&&<p className="p-6 text-sm text-slate-500">No employees yet.</p>}
        </div>
      </section>

      <section className="card overflow-hidden">
        <Head icon={CreditCard} title="Recent payments" href="/payments"/>
        <div className="divide-y divide-slate-100">
          {recentPayments.map(p=><div className="flex items-center justify-between gap-3 px-5 py-4" key={p._id}>
            <div className="min-w-0"><p className="truncate text-sm font-bold">{p.employee?.name||"Unknown"}</p><p className="text-xs text-slate-500">{p.month} · {dateText(p.paidAt||p.createdAt)}</p></div>
            <div className="text-right"><p className="text-sm font-semibold">{money(p.amount)}</p><span className={`badge ${status(p.status)}`}>{p.status}</span></div>
          </div>)}
          {!recentPayments.length&&<p className="p-6 text-sm text-slate-500">No payments yet.</p>}
        </div>
      </section>
    </div>

    <section className="card overflow-hidden">
      <Head icon={GraduationCap} title="Recent students" href="/students"/>
      <div className="divide-y divide-slate-100">
        {latestStudents.map(s=><div key={s._id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><Avatar name={s.name}/><div><p className="truncate text-sm font-bold">{s.name}</p><p className="truncate text-xs text-slate-500">{s.school?.name||"—"} · {s.course?.title||"—"}</p></div></div><span className={`badge ${s.enrollmentStatus==="active"?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{s.enrollmentStatus}</span></div>)}
        {!latestStudents.length&&<p className="p-6 text-sm text-slate-500">No students yet.</p>}
      </div>
    </section>

    <PaySalaryModal employee={payEmployee} open={Boolean(payEmployee)} onClose={()=>setPayEmployee(null)}/>
  </div>
}
function Head({icon:Icon,title,href}){return <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><Icon size={18} className="text-indigo-600"/><h3 className="font-bold">{title}</h3></div><Link className="flex items-center gap-1 text-xs font-semibold text-indigo-600" to={href}>View all<ArrowUpRight size={14}/></Link></div>}
function Avatar({name}){return <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">{name.slice(0,2).toUpperCase()}</div>}
function status(v){return v==="paid"||v==="active"?"bg-emerald-50 text-emerald-700":v==="failed"?"bg-red-50 text-red-700":v==="on-leave"||v==="created"?"bg-amber-50 text-amber-700":"bg-slate-100 text-slate-600"}
