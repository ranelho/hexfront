import { useState, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaPhone, FaUserFriends, FaTimes, FaSave } from 'react-icons/fa';
import { createPerson, checkCpfExists, getMaritalStatuses, getGenders } from '../services/personService';
import type { Person, Address, Contact, Dependent } from '../types/person';
import type { ErrorState, ValidationError } from '../types/error';
import { processApiError, getFieldError, hasFieldError } from '../utils/errorHandler';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import DependentForm from './DependentForm';

const initialState: Person = {
  name: '',
  cpf: '',
  rg: '',
  rgIssuer: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  maritalStatus: '',
  profession: '',
  nationality: '',
  gender: '',
  emergencyContact: '',
  emergencyPhone: '',
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
  const [errorState, setErrorState] = useState<ErrorState>({ general: null, validations: [] });
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [validatingCpf, setValidatingCpf] = useState(false);
  const [maritalStatuses, setMaritalStatuses] = useState<{ value: string; label: string }[]>([]);
  const [genders, setGenders] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadEnums = async () => {
      const [maritalData, genderData] = await Promise.all([
        getMaritalStatuses(),
        getGenders()
      ]);
      setMaritalStatuses(maritalData);
      setGenders(genderData);
    };
    loadEnums();
  }, []);

  // Função para formatar CPF
  const formatCPF = (value: string): string => {
    const cpfLimpo = value.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para limpar CPF (remover máscara)
  const cleanCPF = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfLimpo = cleanCPF(value);
      const cpfFormatado = formatCPF(cpfLimpo);
      setPerson({ ...person, [name]: cpfFormatado });
      setCpfError(null);
    } else {
      setPerson({ ...person, [name]: value });
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
    const cpf = cleanCPF(e.target.value);
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
    setErrorState({ general: null, validations: [] });

    try {
      const personToSubmit = { ...person };
      
      if (personToSubmit.cpf) {
        personToSubmit.cpf = cleanCPF(personToSubmit.cpf);
      }

      if (personToSubmit.cpf && personToSubmit.cpf.length === 11) {
        const exists = await checkCpfExists(personToSubmit.cpf);
        if (exists) {
          setCpfError('CPF já cadastrado no sistema. Verifique os dados informados.');
          setLoading(false);
          return;
        }
      }

      await createPerson(personToSubmit);
      onSuccess();
    } catch (err) {
      const processedError = processApiError(err);
      setErrorState(processedError);
      console.error('Erro ao cadastrar pessoa:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="details-modal" style={{
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="details-content" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          className="details-close"
          title="Fechar"
          style={{
            background: 'rgba(231, 76, 60, 0.1)',
            color: '#e74c3c',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e74c3c';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(231, 76, 60, 0.1)';
            e.target.style.color = '#e74c3c';
          }}
        >
          ×
        </button>
        
        <h2 className="details-title" style={{
          color: '#1976d2',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <FaUser /> Cadastrar Pessoa
        </h2>

        {errorState.general && (
          <div className="status-message status-error">
            {errorState.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Dados Básicos */}
          <div className="details" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 className="details-section-title" style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: '#1976d2',
              borderBottom: '2px solid #1976d2',
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaUser /> Dados Básicos
            </h3>
            <div className="details-grid">
              <div className="details-item">
                <label htmlFor="name" className="details-item-label">Nome Completo *</label>
                <input 
                  id="name"
                  name="name" 
                  value={person.name} 
                  onChange={handleChange} 
                  className={`form-input ${hasFieldError('name', errorState.validations) ? 'error' : ''}`}
                  required 
                />
                {getFieldError('name', errorState.validations) && (
                  <div className="error-message">{getFieldError('name', errorState.validations)}</div>
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
                  className={`form-input ${hasFieldError('birthDate', errorState.validations) ? 'error' : ''}`}
                  required 
                />
                {getFieldError('birthDate', errorState.validations) && (
                  <div className="error-message">{getFieldError('birthDate', errorState.validations)}</div>
                )}
              </div>

              <div className="details-item">
                <label htmlFor="gender" className="details-item-label">Gênero</label>
                <select 
                  id="gender"
                  name="gender" 
                  value={person.gender} 
                  onChange={handleChange} 
                  className="form-input"
                >
                  <option value="">Selecione...</option>
                  {genders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="details-item">
                <label htmlFor="maritalStatus" className="details-item-label">Estado Civil</label>
                <select 
                  id="maritalStatus"
                  name="maritalStatus" 
                  value={person.maritalStatus} 
                  onChange={handleChange} 
                  className="form-input"
                >
                  <option value="">Selecione...</option>
                  {maritalStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="details-item">
                <label htmlFor="nationality" className="details-item-label">Nacionalidade</label>
                <input 
                  id="nationality"
                  name="nationality" 
                  value={person.nationality} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="profession" className="details-item-label">Profissão</label>
                <input 
                  id="profession"
                  name="profession" 
                  value={person.profession} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="details" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 className="details-section-title" style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: '#1976d2',
              borderBottom: '2px solid #1976d2',
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📄 Documentos
            </h3>
            <div className="details-grid">
              <div className="details-item">
                <label htmlFor="cpf" className="details-item-label">CPF *</label>
                <input 
                  id="cpf"
                  name="cpf" 
                  value={person.cpf} 
                  onChange={handleChange} 
                  onBlur={handleCpfBlur}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={`form-input ${hasFieldError('cpf', errorState.validations) ? 'error' : ''}`}
                  style={{ fontFamily: 'monospace' }}
                  required 
                  onKeyPress={(e) => {
                    if (!/\d/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {cpfError && (
                  <div className="error-message">{cpfError}</div>
                )}
                {getFieldError('cpf', errorState.validations) && (
                  <div className="error-message">{getFieldError('cpf', errorState.validations)}</div>
                )}
                {validatingCpf && (
                  <div className="loading-message">Validando CPF...</div>
                )}
              </div>

              <div className="details-item">
                <label htmlFor="rg" className="details-item-label">RG</label>
                <input 
                  id="rg"
                  name="rg" 
                  value={person.rg} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="rgIssuer" className="details-item-label">Órgão Emissor</label>
                <input 
                  id="rgIssuer"
                  name="rgIssuer" 
                  value={person.rgIssuer} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Filiação */}
          <div className="details" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 className="details-section-title" style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: '#1976d2',
              borderBottom: '2px solid #1976d2',
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              👨‍👩‍👧‍👦 Filiação
            </h3>
            <div className="details-grid">
              <div className="details-item">
                <label htmlFor="nameMother" className="details-item-label">Nome da Mãe</label>
                <input 
                  id="nameMother"
                  name="nameMother" 
                  value={person.nameMother} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>

              <div className="details-item">
                <label htmlFor="nameFather" className="details-item-label">Nome do Pai</label>
                <input 
                  id="nameFather"
                  name="nameFather" 
                  value={person.nameFather} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>
            </div>
          </div>

          {/* Contatos de Emergência */}
          <div className="details" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 className="details-section-title" style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: '#1976d2',
              borderBottom: '2px solid #1976d2',
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🚨 Contatos de Emergência
            </h3>
            <div className="details-grid">
              <div className="details-item">
                <label htmlFor="emergencyContact" className="details-item-label">Contato de Emergência</label>
                <input 
                  id="emergencyContact"
                  name="emergencyContact" 
                  value={person.emergencyContact} 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="emergencyPhone" className="details-item-label">Telefone de Emergência</label>
                <input 
                  id="emergencyPhone"
                  name="emergencyPhone" 
                  value={person.emergencyPhone} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    let maskedValue = '';
                    if (value.length > 0) {
                      if (value.length <= 2) {
                        maskedValue = `(${value}`;
                      } else if (value.length <= 7) {
                        maskedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                      } else {
                        maskedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                      }
                    }
                    handleChange({ target: { name: 'emergencyPhone', value: maskedValue } });
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="form-input"
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
