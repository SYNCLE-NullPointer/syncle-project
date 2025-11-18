import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfileLayout from '../pages/profile/ProfileLayout'
import ProfilePage from '../pages/profile/ProfilePage'
import SecurityPage from '../pages/profile/SecurityPage'

export default function ProfileRoutes() {
  return (
    <Routes>
      <Route element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="security" element={<SecurityPage />} />
      </Route>
    </Routes>
  )
}
