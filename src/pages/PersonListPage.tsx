import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FaPlus, FaTimes } from 'react-icons/fa';
import PersonFormModal from '../components/PersonFormModal';
import { getAllPersons, deletePerson } from '../services/personService';

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  number: string;
}

interface Contact {
  id: number;
  email: string;
  ddd: string;
  telephoneNumber: string;
}

interface Dependent {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  dependentType: string;
}

interface Person {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  nameMother: string;
  nameFather: string;
  addresses: Address[];
  contacts: Contact[];
  dependents: Dependent[];
}

export default function PersonListPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [cpfFilter, setCpfFilter] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [debouncedCpf, setDebouncedCpf] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const navigate = useNavigate();

  async function handleDelete(id: number) {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      try {
        await deletePerson(id);
        setPersons((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert('Erro ao excluir pessoa.');
        console.error(err);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    getAllPersons(page, 12, debouncedName, debouncedCpf)
      .then((data) => {
        console.log('Dados recebidos:', data);
        if (Array.isArray(data.content)) {
          setPersons(data.content);
          setTotalPages(Math.ceil((data.totalElements || 0) / (data.pageSize || 12)));
        } else if (Array.isArray(data)) {
          setPersons(data);
          setTotalPages(1);
        } else {
          setPersons([]);
          setTotalPages(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar pessoas. Verifique a conexão ou tente novamente.');
        setLoading(false);
        console.error('Erro ao buscar pessoas:', err);
      });
  }, [page, debouncedName, debouncedCpf]);

  // Debounce para filtros
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(nameFilter);
      setDebouncedCpf(cpfFilter);
    }, 900);
    return () => clearTimeout(handler);
  }, [nameFilter, cpfFilter]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', padding: 0, margin: 0, background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', margin: '32px 0 0 0' }}>Pessoas</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 32 }}>
          <input
            type="text"
            placeholder="Filtrar por nome"
            value={nameFilter}
            onChange={e => { setNameFilter(e.target.value); setPage(0); }}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15, minWidth: 180 }}
          />
          <input
            type="text"
            placeholder="Filtrar por CPF"
            value={cpfFilter}
            onChange={e => { setCpfFilter(e.target.value); setPage(0); }}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15, minWidth: 140 }}
          />
          <button
            onClick={() => { setNameFilter(''); setCpfFilter(''); setPage(0); }}
            style={{ padding: '8px 14px', background: '#888', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}
            title="Limpar Filtros"
          >
            <FaTimes /> Limpar
          </button>
        </div>
        <div style={{ marginRight: 32 }}>
          <button
            onClick={() => setShowFormModal(true)}
            style={{ padding: '8px 20px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}
            title="Adicionar Pessoa"
          >
            <FaPlus /> Adicionar Pessoa
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#1976d2', color: '#fff' }}>
              <th style={{ padding: 12, display: 'none' }}>ID</th>
              <th style={{ padding: 12 }}>Nome</th>
              <th style={{ padding: 12 }}>CPF</th>
              <th style={{ padding: 12 }}>Data de Nascimento</th>
              <th style={{ padding: 12 }}>Endereço</th>
              <th style={{ padding: 12 }}>Contatos</th>
              <th style={{ padding: 12 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, idx) => (
              <tr key={person.id} style={{ background: idx % 2 === 0 ? '#fff' : '#e3eafc' }}>
                <td style={{ padding: 10, display: 'none' }}>{person.id}</td>
                <td style={{ padding: 10 }}>{person.name}</td>
                <td style={{ padding: 10 }}>{person.cpf}</td>
                <td style={{ padding: 10 }}>{person.birthDate}</td>
                <td style={{ padding: 10, minWidth: 180 }}>
                  {person.addresses && person.addresses.length > 0 ? (
                    <span>
                      <span style={{ fontWeight: 500 }}>
                        {person.addresses[0].street}, {person.addresses[0].number}
                      </span>
                      {' '}
                      <span style={{ color: '#555' }}>
                        {person.addresses[0].city}/{person.addresses[0].state} ({person.addresses[0].zipCode})
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: '#aaa' }}>-</span>
                  )}
                </td>
                <td style={{ padding: 10, minWidth: 160 }}>
                  {person.contacts?.map((contact) => (
                    <div key={contact.id} style={{ marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{contact.email}</span> <br />
                      <span style={{ color: '#555' }}>{contact.ddd} {contact.telephoneNumber}</span>
                    </div>
                  ))}
                </td>
                <td style={{ padding: 10, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    <button
                      title="Visualizar"
                      onClick={() => setSelectedPerson(person)}
                      style={{ padding: '6px', background: '#7da8d3ff', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
                    >
                      <FaEye />
                    </button>
                    <button
                      title="Editar"
                      onClick={() => alert(`Editar pessoa ${person.id}`)}
                      style={{ padding: '6px', background: '#ffa726', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Excluir"
                      onClick={() => handleDelete(person.id)}
                      style={{ padding: '6px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, margin: '4px 32px 0 0' }}>
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #1976d2', background: page === 0 ? '#eee' : '#1976d2', color: page === 0 ? '#888' : '#fff', fontWeight: 'bold', cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 18 }}
        >
          {'<'}
        </button>
        <span style={{ fontWeight: 'bold', fontSize: 15 }}>Página {page + 1} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #1976d2', background: page >= totalPages - 1 ? '#eee' : '#1976d2', color: page >= totalPages - 1 ? '#888' : '#fff', fontWeight: 'bold', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: 18 }}
        >
          {'>'}
        </button>
      </div>
      {/* Modal de detalhes */}
      {/* Modal de cadastro/edição */}
      {showFormModal && (
        <PersonFormModal onClose={() => setShowFormModal(false)} onSuccess={() => { setShowFormModal(false); setPage(0); }} />
      )}
      {selectedPerson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 700, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button
              onClick={() => setSelectedPerson(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}
              title="Fechar"
            >
              ×
            </button>
            <h3 style={{ color: '#1976d2', marginBottom: 16 }}>Detalhes da Pessoa</h3>
            <div style={{ marginBottom: 10 }}><strong>ID:</strong> {selectedPerson.id}</div>
            <div style={{ marginBottom: 10 }}><strong>Nome:</strong> {selectedPerson.name}</div>
            <div style={{ marginBottom: 10 }}><strong>CPF:</strong> {selectedPerson.cpf}</div>
            <div style={{ marginBottom: 10 }}><strong>Data de Nascimento:</strong> {selectedPerson.birthDate}</div>
            <div style={{ marginBottom: 10 }}><strong>Mãe:</strong> {selectedPerson.nameMother}</div>
            <div style={{ marginBottom: 10 }}><strong>Pai:</strong> {selectedPerson.nameFather}</div>
            {/* Endereços */}
            <div style={{ marginBottom: 18 }}>
              <strong>Endereços:</strong>
              {selectedPerson.addresses && selectedPerson.addresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {selectedPerson.addresses.map((addr, i) => (
                    <div key={addr.id || i} style={{ background: '#e3eafc', borderRadius: 8, padding: '8px 12px', fontSize: 15 }}>
                      <span style={{ fontWeight: 500 }}>{addr.street}, {addr.number}</span> - {addr.city}/{addr.state} ({addr.zipCode})<br />
                      <span style={{ color: '#555' }}>{addr.country}</span>
                    </div>
                  ))}
                </div>
              ) : <span style={{ color: '#aaa', marginLeft: 8 }}>-</span>}
            </div>
            {/* Contatos */}
            <div style={{ marginBottom: 18 }}>
              <strong>Contatos:</strong>
              {selectedPerson.contacts && selectedPerson.contacts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {selectedPerson.contacts.map((contact, i) => (
                    <div key={contact.id || i} style={{ background: '#fce4ec', borderRadius: 8, padding: '8px 12px', fontSize: 15 }}>
                      <span style={{ fontWeight: 500 }}>{contact.email}</span><br />
                      <span style={{ color: '#555' }}>{contact.ddd} {contact.telephoneNumber}</span>
                    </div>
                  ))}
                </div>
              ) : <span style={{ color: '#aaa', marginLeft: 8 }}>-</span>}
            </div>
            {/* Dependentes */}
            <div style={{ marginBottom: 10 }}>
              <strong>Dependentes:</strong>
              {selectedPerson.dependents && selectedPerson.dependents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {selectedPerson.dependents.map((dep, i) => (
                    <div key={dep.id || i} style={{ background: '#fffde7', borderRadius: 8, padding: '8px 12px', fontSize: 15 }}>
                      <span style={{ fontWeight: 500 }}>{dep.name}</span> ({dep.dependentType})<br />
                      <span style={{ color: '#555' }}>CPF: {dep.cpf} | Nasc.: {dep.birthDate}</span>
                    </div>
                  ))}
                </div>
              ) : <span style={{ color: '#aaa', marginLeft: 8 }}>-</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
