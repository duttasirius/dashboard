import { useState } from "react";
import { CheckCircle2, Clock3, CreditCard, Search, XCircle, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { useGetPaymentsQuery, useGetEmployeesQuery } from "../store/api";
import PaySalaryModal from "../components/PaySalaryModal";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { money, dateText } from "../utils/format";

export default function Payments() {
  const { user } = useSelector((s) => s.auth);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [payEmployee, setPayEmployee] = useState(null);
  const [chooseOpen, setChooseOpen] = useState(false);

  const { data, isLoading, error } = useGetPaymentsQuery({ page, limit: 10, status });
  const { data: employeeData } = useGetEmployeesQuery({ search: "", page: 1, limit: 100 });

  const employees = employeeData?.employees || [];
  const rows = (data?.payments || []).filter((p) =>
    `${p.employee?.name || ""} ${p.employee?.employeeId || ""} ${p.month}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Finance"
        title="Salary payments"
        description="Track Razorpay orders, verified payments and payroll history."
        action={
          <button className="btn-primary" onClick={() => setChooseOpen(true)}>
            <WalletCards size={16} /> Pay salary
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, ID or month..."
            />
          </div>
          <select
            className="field md:w-44"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="created">Created</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {error ? (
          <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error.data?.message || "Unable to load payments."}
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="h-14 animate-pulse rounded-xl bg-slate-100" key={i} />
            ))}
          </div>
        ) : rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Month</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold">{p.employee?.name || "—"}</p>
                      <p className="text-xs text-slate-400">
                        {p.employee?.employeeId || "—"} · {p.employee?.department || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">{p.month}</td>
                    <td className="px-5 py-4 font-semibold">{money(p.amount)}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-500">
                        {p.paymentId || p.orderId}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`badge ${p.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.status === "failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"}`}
                      >
                        {p.status === "paid" ? (
                          <CheckCircle2 size={12} className="mr-1" />
                        ) : p.status === "failed" ? (
                          <XCircle size={12} className="mr-1" />
                        ) : (
                          <Clock3 size={12} className="mr-1" />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {dateText(p.paidAt || p.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {p.status !== "paid" && p.employee && (
                        <button
                          className="btn-secondary px-3 py-2 text-emerald-700"
                          onClick={() => {
                            setPayEmployee(
                              employees.find((e) => e._id === p.employee._id) || p.employee
                            );
                          }}
                        >
                          <CreditCard size={15} /> Pay
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No payments found."
            text="Use Pay Salary from Employees to create a Razorpay checkout."
          />
        )}

        {data?.pagination && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm">
            <span>
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary"
                disabled={page >= data.pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={chooseOpen}
        onClose={() => setChooseOpen(false)}
        title="Choose employee to pay"
        maxWidth="max-w-lg"
      >
        <div className="space-y-2">
          {employees.length ? (
            employees.map((e) => (
              <button
                key={e._id}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
                onClick={() => {
                  setChooseOpen(false);
                  setPayEmployee(e);
                }}
              >
                <div>
                  <p className="font-semibold">{e.name}</p>
                  <p className="text-xs text-slate-500">
                    {e.employeeId} · {e.position}
                  </p>
                </div>
                <span className="font-semibold text-slate-700">{money(e.salary)}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">No employees found. Add an employee first.</p>
          )}
        </div>
      </Modal>

      <PaySalaryModal
        employee={payEmployee}
        open={Boolean(payEmployee)}
        onClose={() => setPayEmployee(null)}
      />
    </div>
  );
}
