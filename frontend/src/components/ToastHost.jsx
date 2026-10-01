import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { clearToast } from "../store/slices/uiSlice";

export default function ToastHost(){
  const dispatch=useDispatch(),toast=useSelector(s=>s.ui.toast);
  return <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className={`fixed right-4 top-4 z-[80] flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-2xl ${toast.type==="error"?"border-red-200":"border-emerald-200"}`}><CheckCircle2 size={18} className={toast.type==="error"?"text-red-500":"text-emerald-500"}/><p className="flex-1 text-sm font-semibold text-slate-700">{toast.message}</p><button className="icon-btn" onClick={()=>dispatch(clearToast())}><X size={15}/></button></motion.div>}</AnimatePresence>
}
