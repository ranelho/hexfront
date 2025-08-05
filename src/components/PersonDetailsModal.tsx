import { FaTimes, FaEdit, FaMapMarkerAlt, FaPhone, FaUserFriends } from 'react-icons/fa';
import { Person, Address, Contact, Dependent } from '../types/person';

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
              <div className="details-item-label">RG</div>
              <div className="details-item-value">{person.rg || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Órgão Emissor</div>
              <div className="details-item-value">{person.rgIssuer || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Data de Nascimento</div>
              <div className="details-item-value">{formatDateBR(person.birthDate)}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Estado Civil</div>
              <div className="details-item-value">{person.maritalStatus || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Gênero</div>
              <div className="details-item-value">{person.gender || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Nacionalidade</div>
              <div className="details-item-value">{person.nationality || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Profissão</div>
              <div className="details-item-value">{person.profession || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Nome da Mãe</div>
              <div className="details-item-value">{person.nameMother || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Nome do Pai</div>
              <div className="details-item-value">{person.nameFather || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Contato de Emergência</div>
              <div className="details-item-value">{person.emergencyContact || '-'}</div>
            </div>
            <div className="details-item">
              <div className="details-item-label">Telefone de Emergência</div>
              <div className="details-item-value">{person.emergencyPhone || '-'}</div>
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
              {person.addresses.map((address, index) => (
                <div key={index} className="details-item">
                  <div className="details-item-label">Endereço {index + 1}</div>
                  <div className="details-item-value">
                    {address.street && `${address.street}`}
                    {address.number && `, ${address.number}`}
                    {address.neighborhood && ` - ${address.neighborhood}`}
                    {address.city && `, ${address.city}`}
                    {address.state && ` - ${address.state}`}
                    {address.zipCode && `, CEP: ${address.zipCode}`}
                    {address.country && `, ${address.country}`}
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
              {person.contacts.map((contact, index) => (
                <div key={index} className="details-item">
                  <div className="details-item-label">Contato {index + 1}</div>
                  <div className="details-item-value">
                    {contact.email && (
                      <div className="contact-email">{contact.email}</div>
                    )}
                    {contact.ddd && contact.telephoneNumber && (
                      <div className="contact-phone">
                        {formatPhone(contact.ddd, contact.telephoneNumber)}
                      </div>
                    )}
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
              {person.dependents.map((dependent, index) => (
                <div key={index} className="details-item">
                  <div className="details-item-label">Dependente {index + 1}</div>
                  <div className="details-item-value">
                    <div><strong>Nome:</strong> {dependent.name || '-'}</div>
                    <div><strong>CPF:</strong> {dependent.cpf ? formatCPF(dependent.cpf) : '-'}</div>
                    <div><strong>Data de Nascimento:</strong> {dependent.birthDate ? formatDateBR(dependent.birthDate) : '-'}</div>
                    <div><strong>Tipo:</strong> {dependent.dependentType || '-'}</div>
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