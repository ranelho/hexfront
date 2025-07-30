import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaUsers, FaMapMarkerAlt, FaPhone, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';
import PersonFormModal from '../components/PersonFormModal';
import PersonEditModal from '../components/PersonEditModal';
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
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [cpfFilter, setCpfFilter] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [debouncedCpf, setDebouncedCpf] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const navigate = useNavigate();

  // Função para formatar CPF
  function formatCPF(cpf: string): string {
    // Remove tudo que não é dígito
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Aplica a máscara
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // Função para formatar data para padrão brasileiro
  function formatDateBR(dateString: string): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  }

  // Função para formatar telefone
  function formatPhone(ddd: string, phone: string): string {
    const phoneLimpo = phone.replace(/\D/g, '');
    
    if (phoneLimpo.length === 8) {
      return `(${ddd}) ${phoneLimpo.replace(/(\d{4})(\d{4})/, '$1-$2')}`;
    } else if (phoneLimpo.length === 9) {
      return `(${ddd}) ${phoneLimpo.replace(/(\d{5})(\d{4})/, '$1-$2')}`;
    } else {
      return `(${ddd}) ${phoneLimpo}`;
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePerson(id);
      setPersons((prev) => prev.filter((p) => p.id !== id));
      setPersonToDelete(null); // Fecha a modal
    } catch (err) {
      alert('Erro ao excluir pessoa.');
      console.error(err);
      setPersonToDelete(null); // Fecha a modal mesmo em caso de erro
    }
  }

  function openDeleteConfirm(person: Person) {
    setPersonToDelete(person);
  }

  function closeDeleteConfirm() {
    setPersonToDelete(null);
  }

  function openEditModal(person: Person) {
    setPersonToEdit(person);
    setSelectedPerson(null); // Fecha o modal de visualização
  }

  function closeEditModal() {
    setPersonToEdit(null);
  }

  function handleEditSuccess() {
    closeEditModal();
    // Recarregar dados
    getAllPersons(page, 12, debouncedName, debouncedCpf)
      .then((data) => {
        if (Array.isArray(data.content)) {
          setPersons(data.content);
        } else if (Array.isArray(data)) {
          setPersons(data);
        }
      });
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

  if (loading) {
    return (
      <div className="person-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="person-list-container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="person-list-container">
      {/* Header */}
      <div className="person-list-header">
        <h1 className="person-list-title">Gestão de Pessoas</h1>
        
        <div className="person-list-controls">
          <div className="filters-container">
            <input
              type="text"
              placeholder="Filtrar por nome"
              value={nameFilter}
              onChange={e => { setNameFilter(e.target.value); setPage(0); }}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Filtrar por CPF"
              value={cpfFilter}
              onChange={e => { setCpfFilter(e.target.value); setPage(0); }}
              className="filter-input"
            />
            <button
              onClick={() => { setNameFilter(''); setCpfFilter(''); setPage(0); }}
              className="clear-filters-btn"
              title="Limpar Filtros"
            >
              <FaTimes /> Limpar
            </button>
          </div>
          
          <button
            onClick={() => setShowFormModal(true)}
            className="add-person-btn"
            title="Adicionar Pessoa"
          >
            <FaPlus /> Adicionar Pessoa
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-container">
        {persons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>Nenhuma pessoa encontrada</h3>
            <p>Comece adicionando uma nova pessoa ou ajuste os filtros de busca.</p>
          </div>
        ) : (
          <table className="person-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data de Nascimento</th>
                <th>Endereço</th>
                <th>Contatos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person.id}>
                  <td className="person-name">{person.name}</td>
                  <td className="person-cpf">{formatCPF(person.cpf)}</td>
                  <td className="person-birth">{formatDateBR(person.birthDate)}</td>
                  <td className="address-cell">
                    {person.addresses && person.addresses.length > 0 ? (
                      <div>
                        <div className="address-main">
                          {person.addresses[0].street}, {person.addresses[0].number}
                        </div>
                        <div className="address-secondary">
                          {person.addresses[0].city}/{person.addresses[0].state} ({person.addresses[0].zipCode})
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#aaa' }}>-</span>
                    )}
                  </td>
                  <td className="contacts-cell">
                    {person.contacts && person.contacts.length > 0 ? (
                      person.contacts.map((contact) => (
                        <div key={contact.id} className="contact-item">
                          <span className="contact-email">{contact.email}</span>
                          <span className="contact-phone">{formatPhone(contact.ddd, contact.telephoneNumber)}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#aaa' }}>-</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        title="Visualizar"
                        onClick={() => setSelectedPerson(person)}
                        className="action-btn action-btn-view"
                      >
                        <FaEye size={14} />
                        <span style={{ marginLeft: '4px', fontSize: '12px' }}>Ver</span>
                      </button>
                      <button
                        title="Editar"
                        onClick={() => openEditModal(person)}
                        className="action-btn action-btn-edit"
                      >
                        <FaEdit size={14} />
                        <span style={{ marginLeft: '4px', fontSize: '12px' }}>Editar</span>
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => openDeleteConfirm(person)}
                        className="action-btn action-btn-delete"
                      >
                        <FaTrash size={14} />
                        <span style={{ marginLeft: '4px', fontSize: '12px' }}>Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {persons.length > 0 && (
        <div className="pagination-container">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="pagination-btn"
          >
            {'<'}
          </button>
          <span className="pagination-info">Página {page + 1} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="pagination-btn"
          >
            {'>'}
          </button>
        </div>
      )}

      {/* Modal de cadastro/edição */}
      {showFormModal && (
        <PersonFormModal 
          onClose={() => setShowFormModal(false)} 
          onSuccess={() => { 
            setShowFormModal(false); 
            setPage(0);
            // Recarregar dados
            getAllPersons(page, 12, debouncedName, debouncedCpf)
              .then((data) => {
                if (Array.isArray(data.content)) {
                  setPersons(data.content);
                } else if (Array.isArray(data)) {
                  setPersons(data);
                }
              });
          }} 
        />
      )}

      {/* Modal de detalhes */}
      {selectedPerson && (
        <div className="details-modal">
          <div className="details-content">
            <button
              onClick={() => setSelectedPerson(null)}
              className="details-close"
              title="Fechar"
            >
              ×
            </button>
            
            <h2 className="details-title">
              Detalhes da Pessoa
              <div className="details-actions">
                <button
                  onClick={() => openEditModal(selectedPerson)}
                  className="details-action-btn details-action-btn-edit"
                  title="Editar Pessoa"
                >
                  <FaEdit /> Editar
                </button>
              </div>
            </h2>
            
            <div className="details-section">
              <div className="details-grid">
                <div className="details-item">
                  <div className="details-item-label">Nome</div>
                  <div className="details-item-value">{selectedPerson.name}</div>
                </div>
                <div className="details-item">
                  <div className="details-item-label">CPF</div>
                  <div className="details-item-value">{formatCPF(selectedPerson.cpf)}</div>
                </div>
                <div className="details-item">
                  <div className="details-item-label">Data de Nascimento</div>
                  <div className="details-item-value">{formatDateBR(selectedPerson.birthDate)}</div>
                </div>
                <div className="details-item">
                  <div className="details-item-label">Nome da Mãe</div>
                  <div className="details-item-value">{selectedPerson.nameMother}</div>
                </div>
                <div className="details-item">
                  <div className="details-item-label">Nome do Pai</div>
                  <div className="details-item-value">{selectedPerson.nameFather}</div>
                </div>
              </div>
            </div>

            {/* Endereços */}
            <div className="details-section">
              <div className="details-section-title">
                <FaMapMarkerAlt /> Endereços
              </div>
              {selectedPerson.addresses && selectedPerson.addresses.length > 0 ? (
                <div className="details-items-container">
                  {selectedPerson.addresses.map((addr, i) => (
                    <div key={addr.id || i} className="details-item">
                      <div className="details-item-label">{addr.street}, {addr.number}</div>
                      <div className="details-item-value">
                        {addr.city}/{addr.state} ({addr.zipCode})<br />
                        {addr.country}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="details-item">
                  <div className="details-item-value">Nenhum endereço cadastrado</div>
                </div>
              )}
            </div>

            {/* Contatos */}
            <div className="details-section">
              <div className="details-section-title">
                <FaPhone /> Contatos
              </div>
              {selectedPerson.contacts && selectedPerson.contacts.length > 0 ? (
                <div className="details-items-container">
                  {selectedPerson.contacts.map((contact, i) => (
                    <div key={contact.id || i} className="details-item">
                      <div className="details-item-label">{contact.email}</div>
                      <div className="details-item-value">
                        {formatPhone(contact.ddd, contact.telephoneNumber)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="details-item">
                  <div className="details-item-value">Nenhum contato cadastrado</div>
                </div>
              )}
            </div>

            {/* Dependentes */}
            <div className="details-section">
              <div className="details-section-title">
                <FaUserFriends /> Dependentes
              </div>
              {selectedPerson.dependents && selectedPerson.dependents.length > 0 ? (
                <div className="details-items-container">
                  {selectedPerson.dependents.map((dep, i) => (
                    <div key={dep.id || i} className="details-item">
                      <div className="details-item-label">{dep.name} ({dep.dependentType})</div>
                      <div className="details-item-value">
                        CPF: {formatCPF(dep.cpf)}<br />
                        Data de Nascimento: {formatDateBR(dep.birthDate)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="details-item">
                  <div className="details-item-value">Nenhum dependente cadastrado</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {personToEdit && (
        <PersonEditModal
          person={personToEdit}
          onClose={closeEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {personToDelete && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <div className="confirm-icon">
              <FaExclamationTriangle />
            </div>
            
            <h2 className="confirm-title">Confirmar Exclusão</h2>
            
            <p className="confirm-message">
              Tem certeza que deseja excluir a pessoa{' '}
              <span className="confirm-person-name">{personToDelete.name}</span>?
            </p>
            
            <p className="confirm-message">
              Esta ação não pode ser desfeita e todos os dados relacionados serão removidos permanentemente.
            </p>
            
            <div className="confirm-buttons">
              <button
                onClick={closeDeleteConfirm}
                className="confirm-btn confirm-btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(personToDelete.id)}
                className="confirm-btn confirm-btn-delete"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
