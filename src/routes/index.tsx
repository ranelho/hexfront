import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PersonListPage from '../pages/PersonListPage';
import PersonDetailPage from '../pages/PersonDetailPage';
import PersonFormPage from '../pages/PersonFormPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/persons' element={<PersonListPage />} />
        <Route path='/persons/:id' element={<PersonDetailPage />} />
        <Route path='/persons/new' element={<PersonFormPage />} />
        <Route path='/persons/edit/:id' element={<PersonFormPage />} />
        {/* Adicione outras rotas aqui */}
      </Routes>
    </BrowserRouter>
  );
}
