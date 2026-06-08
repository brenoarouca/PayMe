import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/Dashboard';
import ParticipantsPage from '../pages/Participants';
import ExpensesPage from '../pages/Expenses';
import BillingsPage from '../pages/Billings';
import BillingDetailsPage from '../pages/Billings/BillingDetailsPage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="billings" element={<BillingsPage />} />
          <Route path="billings/:id" element={<BillingDetailsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
