import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaUser, FaIdCard, FaCalendar, FaFemale, FaMale, FaMapMarkerAlt, FaPhone, FaUserFriends } from 'react-icons/fa';
import type { Person, Address, Contact, Dependent } from '../types/person';
import type { ErrorState } from '../types/error';
import { updatePerson } from '../services/personService';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="details-modal">
      <div className="details-content">
        <button onClick={onClose} className="details-close">
          ×
        </button>
        
        <h2 className="details-title">
          <FaUser /> Editar Pessoa
        </h2>

        {errorState.general && (
          <div className="status-message status-error">
            {errorState.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="details-section">
            <h3 className="details-section-title">
              <FaUser /> Informações Básicas
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
                <label htmlFor="nameMother" className="details-item-label">Nome da Mãe *</label>
                <input
                  type="text"
                  id="nameMother"
                  name="nameMother"
                  value={formData.nameMother}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="details-item">
                <label htmlFor="nameFather" className="details-item-label">Nome do Pai *</label>
                <input
                  type="text"
                  id="nameFather"
                  name="nameFather"
                  value={formData.nameFather}
                  onChange={handleInputChange}
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
              <FaSave /> {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 