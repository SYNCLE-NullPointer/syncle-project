import React from 'react'

export default function SummaryItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm">
      <p className="text-gray-600">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-800">{value}</p>
    </div>
  )
}
