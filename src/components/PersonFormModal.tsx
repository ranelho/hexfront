import { useState } from 'react';
import { FaUser, FaMapMarkerAlt, FaPhone, FaUserFriends, FaTimes, FaSave } from 'react-icons/fa';
import { createPerson, checkCpfExists } from '../services/personService';
import type { Person, Address, Contact, Dependent } from '../types/person';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import DependentForm from './DependentForm';

const initialState: Person = {
  name: '',
  cpf: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  addresses: [],
  contacts: [],
  dependents: [],
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function PersonFormModal({ onClose, onSuccess }: Props) {
  const [person, setPerson] = useState<Person>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [validatingCpf, setValidatingCpf] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
    
    // Limpar erro de CPF quando o usuário começar a digitar
    if (name === 'cpf') {
      setCpfError(null);
    }
  };

  const validateCpf = async (cpf: string) => {
    if (!cpf || cpf.length < 11) return;
    
    setValidatingCpf(true);
    try {
      const exists = await checkCpfExists(cpf);
      if (exists) {
        setCpfError('CPF já cadastrado no sistema. Verifique os dados informados.');
      } else {
        setCpfError(null);
      }
    } catch (error) {
      console.error('Erro ao validar CPF:', error);
      setCpfError('Erro ao validar CPF. Tente novamente.');
    } finally {
      setValidatingCpf(false);
    }
  };

  const handleCpfBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cpf = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cpf.length === 11) {
      validateCpf(cpf);
    }
  };

  const handleAddressesChange = (addresses: Address[]) => {
    setPerson({ ...person, addresses });
  };

  const handleContactsChange = (contacts: Contact[]) => {
    setPerson({ ...person, contacts });
  };

  const handleDependentsChange = (dependents: Dependent[]) => {
    setPerson({ ...person, dependents });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar CPF antes de prosseguir
      const cpf = person.cpf.replace(/\D/g, '');
      if (cpf.length === 11) {
        const exists = await checkCpfExists(cpf);
        if (exists) {
          setCpfError('CPF já cadastrado no sistema. Verifique os dados informados.');
          setLoading(false);
          return;
        }
      }

      await createPerson(person);
      onSuccess();
    } catch (err) {
      setError('Erro ao cadastrar pessoa. Verifique os dados e tente novamente.');
      console.error('Erro ao cadastrar pessoa:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <FaUser /> Cadastrar Pessoa
        </h2>

        {error && (
          <div className="status-message status-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaUser /> Informações Básicas
            </h3>
            <div className="details-grid">
              <div className="details-item">
                <label htmlFor="name" className="details-item-label">Nome Completo *</label>
                <input 
                  id="name"
                  name="name" 
                  value={person.name} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="details-item">
                <label htmlFor="cpf" className="details-item-label">CPF *</label>
                <input 
                  id="cpf"
                  name="cpf" 
                  value={person.cpf} 
                  onChange={handleChange} 
                  onBlur={handleCpfBlur}
                  className="form-input" 
                  required 
                />
                {cpfError && (
                  <div className="error-message">{cpfError}</div>
                )}
                {validatingCpf && (
                  <div className="loading-message">Validando CPF...</div>
                )}
              </div>
              <div className="details-item">
                <label htmlFor="birthDate" className="details-item-label">Data de Nascimento *</label>
                <input 
                  id="birthDate"
                  name="birthDate" 
                  type="date" 
                  value={person.birthDate} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="details-item">
                <label htmlFor="nameMother" className="details-item-label">Nome da Mãe *</label>
                <input 
                  id="nameMother"
                  name="nameMother" 
                  value={person.nameMother} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="details-item">
                <label htmlFor="nameFather" className="details-item-label">Nome do Pai *</label>
                <input 
                  id="nameFather"
                  name="nameFather" 
                  value={person.nameFather} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Endereços */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaMapMarkerAlt /> Endereços
            </h3>
            <AddressForm 
              addresses={person.addresses} 
              onAddressesChange={handleAddressesChange} 
            />
          </div>

          {/* Contatos */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaPhone /> Contatos
            </h3>
            <ContactForm 
              contacts={person.contacts} 
              onContactsChange={handleContactsChange} 
            />
          </div>

          {/* Dependentes */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaUserFriends /> Dependentes
            </h3>
            <DependentForm 
              dependents={person.dependents} 
              onDependentsChange={handleDependentsChange} 
            />
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes /> Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-submit"
            >
              <FaSave /> {loading ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
