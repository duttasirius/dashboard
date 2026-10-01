import { motion } from "framer-motion";
export default function StatCard({icon:Icon,label,value,sub,iconClass="bg-indigo-50 text-indigo-600"}){
  return <motion.div className="card p-5" whileHover={{y:-3}} transition={{duration:.2}}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>{sub&&<p className="mt-1 text-xs text-slate-500">{sub}</p>}</div><div className={`grid size-11 place-items-center rounded-xl ${iconClass}`}><Icon size={21}/></div></div></motion.div>
}
