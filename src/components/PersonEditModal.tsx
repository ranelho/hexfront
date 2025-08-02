import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaUser, FaIdCard, FaCalendar, FaFemale, FaMale, FaMapMarkerAlt, FaPhone, FaUserFriends } from 'react-icons/fa';
import type { Person, Address, Contact, Dependent } from '../types/person';
import type { ErrorState } from '../types/error';
import { updatePerson, getMaritalStatuses, getGenders } from '../services/personService';
import { processApiError, getFieldError, hasFieldError } from '../utils/errorHandler';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import DependentForm from './DependentForm';

interface PersonEditModalProps {
  person: Person;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PersonEditModal({ person, onClose, onSuccess }: PersonEditModalProps) {
  const [formData, setFormData] = useState<Person>(person);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState>({ general: null, validations: [] });
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

  useEffect(() => {
    setFormData(person);
  }, [person]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressesChange = (addresses: Address[]) => {
    setFormData(prev => ({
      ...prev,
      addresses
    }));
  };

  const handleContactsChange = (contacts: Contact[]) => {
    setFormData(prev => ({
      ...prev,
      contacts
    }));
  };

  const handleDependentsChange = (dependents: Dependent[]) => {
    setFormData(prev => ({
      ...prev,
      dependents
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorState({ general: null, validations: [] });

    try {
      if (person.id) {
        await updatePerson(person.id, formData);
      }
      onSuccess();
    } catch (err) {
      const processedError = processApiError(err);
      setErrorState(processedError);
      console.error('Erro ao atualizar pessoa:', err);
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
          <FaUser /> Editar Pessoa
        </h2>

        {errorState.general && (
          <div className="status-message status-error">
            {errorState.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Dados Básicos */}
          <div className="details-section" style={{
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
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="details-item">
                <label htmlFor="maritalStatus" className="details-item-label">Estado Civil</label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus || ''}
                  onChange={handleInputChange}
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
                <label htmlFor="gender" className="details-item-label">Gênero</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
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
                <label htmlFor="nationality" className="details-item-label">Nacionalidade</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="profession" className="details-item-label">Profissão</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="details-section" style={{
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
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  readOnly
                />
              </div>

              <div className="details-item">
                <label htmlFor="rg" className="details-item-label">RG</label>
                <input
                  type="text"
                  id="rg"
                  name="rg"
                  value={formData.rg || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="rgIssuer" className="details-item-label">Órgão Emissor</label>
                <input
                  type="text"
                  id="rgIssuer"
                  name="rgIssuer"
                  value={formData.rgIssuer || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Filiação */}
          <div className="details-section" style={{
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
                  type="text"
                  id="nameMother"
                  name="nameMother"
                  value={formData.nameMother || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="nameFather" className="details-item-label">Nome do Pai</label>
                <input
                  type="text"
                  id="nameFather"
                  name="nameFather"
                  value={formData.nameFather || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Contatos de Emergência */}
          <div className="details-section" style={{
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
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="details-item">
                <label htmlFor="emergencyPhone" className="details-item-label">Telefone de Emergência</label>
                <input
                  type="text"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone || ''}
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
                    handleInputChange({ target: { name: 'emergencyPhone', value: maskedValue } });
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
              addresses={formData.addresses}
              onAddressesChange={handleAddressesChange}
            />
          </div>

          {/* Contatos */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaPhone /> Contatos
            </h3>
            <ContactForm
              contacts={formData.contacts}
              onContactsChange={handleContactsChange}
            />
          </div>

          {/* Dependentes */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaUserFriends /> Dependentes
            </h3>
            <DependentForm
              dependents={formData.dependents}
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
              className="btn btn-submit"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}