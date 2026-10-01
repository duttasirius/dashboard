import { useEffect,useMemo,useState } from "react";
import { AlertCircle, CheckCircle2, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import Field from "./Field";
import { useCreatePaymentOrderMutation,useVerifyPaymentMutation } from "../store/api";
import { showToast } from "../store/slices/uiSlice";
import { money } from "../utils/format";

const currentMonth=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`};
function loadRazorpay(){return new Promise((resolve,reject)=>{if(window.Razorpay)return resolve();const s=document.createElement("script");s.src="https://checkout.razorpay.com/v1/checkout.js";s.onload=resolve;s.onerror=()=>reject(new Error("Razorpay Checkout could not load."));document.body.appendChild(s)})}

export default function PaySalaryModal({employee,open,onClose}){
  const dispatch=useDispatch();
  const [month,setMonth]=useState(currentMonth()),[amount,setAmount]=useState(""),[busy,setBusy]=useState(false),[success,setSuccess]=useState(false),[error,setError]=useState("");
  const [createOrder]=useCreatePaymentOrderMutation(),[verify]=useVerifyPaymentMutation();
  const payAmount=useMemo(()=>amount===""?(employee?.salary||0):Number(amount),[amount,employee]);

  useEffect(()=>{if(open){setMonth(currentMonth());setAmount("");setError("");setSuccess(false);setBusy(false)}},[open]);

  if(!employee)return null;
  async function start(){
    setBusy(true);setError("");
    try{
      await loadRazorpay();
      const data=await createOrder({employeeId:employee._id,month,amount:payAmount}).unwrap();
      const options={
        key:data.razorpayKeyId,amount:data.order.amount,currency:data.order.currency,order_id:data.order.id,
        name:"ERP Pro",description:`Salary • ${employee.name} • ${month}`,
        prefill:{name:employee.name,email:employee.email,contact:employee.phone},
        notes:{employeeId:employee.employeeId,month},theme:{color:"#4f46e5"},
        modal:{ondismiss:()=>setBusy(false)},
        handler:async response=>{
          try{await verify({razorpay_order_id:response.razorpay_order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_signature:response.razorpay_signature}).unwrap();setSuccess(true);dispatch(showToast({type:"success",message:`Salary payment verified for ${employee.name}.`}))}
          catch(e){setError(e?.data?.message||"Payment completed but verification failed.");}
          finally{setBusy(false)}
        }
      };
      const checkout=new window.Razorpay(options);
      checkout.on("payment.failed",response=>{setError(response.error?.description||"Payment failed.");setBusy(false)});
      checkout.open();
    }catch(e){setError(e?.data?.message||e.message||"Unable to start payment.");setBusy(false)}
  }
  const close=()=>{setSuccess(false);setError("");setBusy(false);onClose()};
  return <Modal open={open} onClose={close} title="Pay employee salary" maxWidth="max-w-lg">
    {success?<motion.div className="py-8 text-center" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34}/></div><h3 className="mt-4 text-xl font-black">Payment verified</h3><p className="mt-2 text-sm text-slate-500">{employee.name}'s salary for {month} is recorded as paid.</p><button className="btn-primary mt-6 w-full" onClick={close}>Done</button></motion.div>:
    <div className="space-y-5">
      <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-indigo-100 text-xs font-black text-indigo-700">{employee.name.slice(0,2).toUpperCase()}</div><div><p className="font-bold">{employee.name}</p><p className="text-xs text-slate-500">{employee.position} · {employee.employeeId}</p></div><div className="ml-auto text-right"><p className="text-xs text-slate-400">Monthly</p><p className="font-bold">{money(employee.salary)}</p></div></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Salary month" type="month" value={month} onChange={e=>setMonth(e.target.value)}/><Field label="Amount (₹)" type="number" min="1" value={amount===""?employee.salary:amount} onChange={e=>setAmount(e.target.value)}/></div>
      {error&&<div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0"/><span>{error}</span></div>}
      <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck size={17} className="text-emerald-600"/> Razorpay secure checkout</div><p className="mt-1 text-xs leading-5 text-slate-500">The order is created on the backend and the secret key is never sent to React.</p></div>
      <button disabled={busy||payAmount<=0} onClick={start} className="btn-primary w-full py-3">{busy?<><LoaderCircle className="animate-spin" size={17}/>Opening checkout…</>:<><CreditCard size={17}/>Pay {money(payAmount)}</>}</button>
    </div>}
  </Modal>
}
