import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaTimes, FaEye, FaEdit, FaTrash, FaUsers, FaMapMarkerAlt, FaPhone, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';
import PersonFormModal from '../components/PersonFormModal';
import PersonEditModal from '../components/PersonEditModal';
import PersonDetailsModal from '../components/PersonDetailsModal';
import { getPersons, deletePerson } from '../services/personService';
import { Person } from '../types/person';

export default function PersonListPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
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

  async function handleDelete(id: number | undefined) {
    if (!id) return;
    
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
    getPersons(page, 12, debouncedName, debouncedCpf)
      .then((data) => {
        if (Array.isArray(data.content)) {
          setPersons(data.content);
        } else if (Array.isArray(data)) {
          setPersons(data);
        }
      });
  }

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log('Fazendo requisição com:', { page, size: 12, name: debouncedName, cpf: debouncedCpf });
    
    getPersons(page, 12, debouncedName, debouncedCpf)
      .then((data) => {
        console.log('Dados recebidos:', data);
        
        if (data && data.content && Array.isArray(data.content)) {
          setPersons(data.content);
          setTotalPages(Math.ceil((data.totalElements || 0) / (data.pageSize || 12)));
        } else if (Array.isArray(data)) {
          setPersons(data);
          setTotalPages(1);
        } else {
          console.error('Formato de dados inesperado:', data);
          setPersons([]);
          setTotalPages(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro completo:', err);
        console.error('Erro message:', err.message);
        console.error('Erro response:', err.response);
        console.error('Erro request:', err.request);
        
        let errorMessage = 'Erro ao carregar pessoas. ';
        
        if (err.response) {
          // Servidor respondeu com status de erro
          errorMessage += `Status: ${err.response.status}. `;
          if (err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
          } else {
            errorMessage += 'Verifique a conexão com o servidor.';
          }
        } else if (err.request) {
          // Requisição foi feita mas não houve resposta
          errorMessage += 'Servidor não respondeu. Verifique se o backend está rodando.';
        } else {
          // Erro na configuração da requisição
          errorMessage += err.message || 'Erro desconhecido.';
        }
        
        setError(errorMessage);
        setLoading(false);
      });
  }, [initialized, page, debouncedName, debouncedCpf]);

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
                      person.contacts.map((contact, index) => (
                        <div key={index} className="contact-item">
                          <span className="contact-email">{contact.email || 'Email não informado'}</span>
                          <span className="contact-phone">
                            {contact.ddd && contact.telephoneNumber 
                              ? formatPhone(contact.ddd, contact.telephoneNumber)
                              : 'Telefone não informado'
                            }
                          </span>
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
                      </button>
                      <button
                        title="Editar"
                        onClick={() => openEditModal(person)}
                        className="action-btn action-btn-edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => openDeleteConfirm(person)}
                        className="action-btn action-btn-delete"
                      >
                        <FaTrash size={14} />
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
            getPersons(page, 12, debouncedName, debouncedCpf)
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
        <PersonDetailsModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onEdit={openEditModal}
        />
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
