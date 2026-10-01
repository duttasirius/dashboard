import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({open,title,children,onClose,maxWidth="max-w-xl"}){
  return <AnimatePresence>{open&&<motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <motion.div className={`max-h-[92vh] w-full ${maxWidth} overflow-auto rounded-2xl bg-white shadow-2xl`} initial={{y:18,scale:.98,opacity:0}} animate={{y:0,scale:1,opacity:1}} exit={{y:8,scale:.98,opacity:0}} transition={{type:"spring",stiffness:360,damping:28}}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 className="text-base font-bold text-slate-950">{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
      <div className="p-5">{children}</div>
    </motion.div>
  </motion.div>}</AnimatePresence>
}
