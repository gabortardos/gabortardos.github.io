import { Navigate, Route, Routes } from 'react-router-dom';
import VariantFour from './pages/mockups/VariantFour';

// M1 closed 2026-10-21: the owner-picked v4 “System” IS the homepage. The
// mockup chooser and variants v1–v3 are deleted; /#/v4 keeps redirecting so
// pre-fold deep links survive.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VariantFour />} />
      <Route path="/v4" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
