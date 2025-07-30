import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <h1>Bem-vindo ao Frontend React + TypeScript</h1>
      <p>Este projeto está pronto para consumir APIs REST do back-end Java.</p>
      <nav style={{ marginTop: 32 }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 24 }}>
          <li>
            <Link to="/persons" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2', fontSize: 18 }}>
              Listagem de Pessoas
            </Link>
          </li>
          <li>
            <Link to="/persons/new" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#388e3c', fontSize: 18 }}>
              Cadastrar Pessoa
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
