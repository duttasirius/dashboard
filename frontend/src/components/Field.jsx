export default function Field({label,...props}){return <label className="block"><span className="label">{label}</span><input {...props} className="field"/></label>}
