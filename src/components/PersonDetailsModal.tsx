import { FaTimes, FaEdit, FaMapMarkerAlt, FaPhone, FaUserFriends } from 'react-icons/fa';

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

interface PersonDetailsModalProps {
  person: Person | null;
  onClose: () => void;
  onEdit?: (person: Person) => void;
}

export default function PersonDetailsModal({ person, onClose, onEdit }: PersonDetailsModalProps) {
  if (!person) return null;

  // Função para formatar CPF
  function formatCPF(cpf: string): string {
    const cpfLimpo = cpf.replace(/\D/g, '');
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

  return (
    <div className="details-modal">
      <div className="details-content">
        <button
          onClick={onClose}
          className="details-close"
          title="Fechar"
        >
          ×
        </button>
        
        <h2 className="details-title">
          Detalhes da Pessoa
          {onEdit && (
            <div className="details-actions">
              <button
                onClick={() => onEdit(person)}
                className="details-action-btn details-action-btn-edit"
                title="Editar Pessoa"
              >
                <FaEdit /> Editar
              </button>
            </div>
          )}
        </h2>
        
        <div className="details-section">
          <div className="details-grid">
            <div className="details-item">
              <div className="details-item-label">Nome</div>
              <div className="details-item-value">{person.name}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">CPF</div>
              <div className="details-item-value">{formatCPF(person.cpf)}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Data de Nascimento</div>
              <div className="details-item-value">{formatDateBR(person.birthDate)}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Nome da Mãe</div>
              <div className="details-item-value">{person.nameMother || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Nome do Pai</div>
              <div className="details-item-value">{person.nameFather || '-'}</div>
            </div>
          </div>
        </div>

        {/* Endereços */}
        <div className="details-section">
          <div className="details-section-title">
            <FaMapMarkerAlt /> Endereços
          </div>
          {person.addresses && person.addresses.length > 0 ? (
            <div className="details-items-container">
              {person.addresses.map((addr, i) => (
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
          {person.contacts && person.contacts.length > 0 ? (
            <div className="details-items-container">
              {person.contacts.map((contact, i) => (
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
          {person.dependents && person.dependents.length > 0 ? (
            <div className="details-items-container">
              {person.dependents.map((dep, i) => (
                <div key={dep.id || i} className="details-item">
                  <div className="details-item-label">{dep.name}</div>
                  <div className="details-item-value">
                    CPF: {formatCPF(dep.cpf)}<br />
                    Data de Nascimento: {formatDateBR(dep.birthDate)}<br />
                    Tipo: {dep.dependentType}
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
  );
} 