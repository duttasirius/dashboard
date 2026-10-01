import Employee from "../models/Employee.js";
import Payment from "../models/Payment.js";
import { escapeRegex } from "../utils/escape.js";

export async function listEmployees(req, res) {
  const { search = "", status, department, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { email: regex }, { employeeId: regex }, { position: regex }];
  }
  if (status) filter.status = status;
  if (department) filter.department = department;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [employees, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    Employee.countDocuments(filter)
  ]);

  res.json({
    employees,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.max(Math.ceil(total / limitNum), 1) }
  });
}

export async function getEmployee(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json({ employee });
}

export async function createEmployee(req, res) {
  const employee = await Employee.create(req.body);
  res.status(201).json({ employee });
}

export async function updateEmployee(req, res) {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json({ employee });
}

export async function deleteEmployee(req, res) {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  await Payment.deleteMany({ employee: employee._id, status: "created" });
  res.json({ message: "Employee deleted." });
}
