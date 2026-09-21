'use client'

import { useState, useMemo, useEffect } from 'react'

// Types
type Status = 'Active' | 'On Leave'
type SortKey = 'name' | 'department' | 'status'

interface Employee {
  id: number
  name: string
  email: string
  department: string
  status: Status
}

interface FormState {
  name: string
  email: string
  department: string
}

interface FormErrors {
  name?: string
  email?: string
}

// I'll add more departments later if needed
const DEPARTMENTS = ['HR', 'IT', 'Finance', 'Marketing', 'Engineering', 'Operations', 'Design']

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Asha', email: 'asha@company.com', department: 'HR', status: 'Active' },
  { id: 2, name: 'Ravi', email: 'ravi@company.com', department: 'IT', status: 'On Leave' },
]

function validateEmail(email: string) {
  // basic check — could use zod later
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// random pastel bg for avatar based on name
const AVATAR_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-teal-100 text-teal-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-green-100 text-green-700',
]

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: Status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      On Leave
    </span>
  )
}

/* ── Add Employee Modal ── */
function AddEmployeeModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: FormState) => void
}) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', department: DEPARTMENTS[0] })
  const [errors, setErrors] = useState<FormErrors>({})

  function validate() {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Name cannot be empty.'
    if (!form.email.trim()) {
      e.email = 'Email is required.'
    } else if (!validateEmail(form.email)) {
      e.email = 'Please enter a valid email address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  // close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600">
          <div>
            <h2 className="text-lg font-bold text-white">Add New Employee</h2>
            <p className="text-xs text-purple-200 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-200 hover:text-white hover:bg-white/20 transition"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              autoFocus
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200 focus:border-purple-400'}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. john@company.com"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }) }}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200 focus:border-purple-400'}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition bg-white"
            >
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition shadow-sm">
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All')
  const [showModal, setShowModal] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  // TODO: add pagination when employee count > 20

  // persist to localStorage so data survives refresh
  useEffect(() => {
    const saved = localStorage.getItem('emp_data')
    if (saved) setEmployees(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('emp_data', JSON.stringify(employees))
  }, [employees])

  const filtered = useMemo(() => {
    return employees
      .filter((e) => {
        const nameMatch = e.name.toLowerCase().includes(search.toLowerCase())
        const statusMatch = statusFilter === 'All' || e.status === statusFilter
        return nameMatch && statusMatch
      })
      .sort((a, b) => {
        const valA = a[sortKey].toLowerCase()
        const valB = b[sortKey].toLowerCase()
        if (valA < valB) return sortAsc ? -1 : 1
        if (valA > valB) return sortAsc ? 1 : -1
        return 0
      })
  }, [employees, search, statusFilter, sortKey, sortAsc])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  function handleSave(data: FormState) {
    const newEmp: Employee = {
      id: Date.now(),
      name: data.name.trim(),
      email: data.email.trim(),
      department: data.department,
      status: 'Active',
    }
    setEmployees((prev) => [...prev, newEmp])
    setShowModal(false)
  }

  function handleDelete(id: number) {
    if (confirm('Remove this employee?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    }
  }

  function toggleStatus(id: number) {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'Active' ? 'On Leave' : 'Active' } : e
      )
    )
  }

  const activeCount = employees.filter((e) => e.status === 'Active').length
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-purple-500 ml-1">{sortAsc ? '↑' : '↓'}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-teal-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Directory
            <span className="ml-2 text-purple-500">.</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team&apos;s information in one place</p>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">{employees.length}</div>
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-semibold text-gray-700">Employees</p>
              </div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">{activeCount}</div>
              <div>
                <p className="text-xs text-gray-400">Currently</p>
                <p className="text-sm font-semibold text-gray-700">Active</p>
              </div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">{onLeaveCount}</div>
              <div>
                <p className="text-xs text-gray-400">Currently</p>
                <p className="text-sm font-semibold text-gray-700">On Leave</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition bg-gray-50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | Status)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition bg-gray-50 text-gray-700"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>

          {/* Add button */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-sm transition active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                  <th
                    className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort('name')}
                  >Name <SortIcon col="name" /></th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th
                    className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort('department')}
                  >Department <SortIcon col="department" /></th>
                  <th
                    className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 select-none"
                    onClick={() => handleSort('status')}
                  >Status <SortIcon col="status" /></th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium">No employees found</p>
                      <p className="text-xs mt-1 text-gray-400">Try changing your search or filter</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, idx) => (
                    <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="px-5 py-4 text-gray-300 font-mono text-xs">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(emp.name)}`}>
                            {getInitials(emp.name)}
                          </div>
                          <span className="font-medium text-gray-800">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{emp.email}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">{emp.department}</span>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={emp.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* toggle status */}
                          <button
                            onClick={() => toggleStatus(emp.id)}
                            title="Toggle status"
                            className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition"
                          >
                            Toggle
                          </button>
                          {/* delete */}
                          <button
                            onClick={() => handleDelete(emp.id)}
                            title="Remove employee"
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 flex justify-between">
              <span>Showing {filtered.length} of {employees.length} employees</span>
              <span>Sorted by {sortKey} {sortAsc ? '(A→Z)' : '(Z→A)'}</span>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddEmployeeModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  )
}
