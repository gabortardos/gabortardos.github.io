import { Route, Routes } from 'react-router-dom';
import ChooserPage from './pages/ChooserPage';
import VariantOne from './pages/mockups/VariantOne';
import VariantThree from './pages/mockups/VariantThree';
import VariantTwo from './pages/mockups/VariantTwo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChooserPage />} />
      <Route path="/v1" element={<VariantOne />} />
      <Route path="/v2" element={<VariantTwo />} />
      <Route path="/v3" element={<VariantThree />} />
    </Routes>
  );
}
