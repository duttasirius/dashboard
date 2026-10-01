export const money=(value)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value||0);
export const number=(value)=>new Intl.NumberFormat("en-IN").format(value||0);
export const dateText=(value)=>value?new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value)):"—";
