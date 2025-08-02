import { useState } from 'react';
import type { Address } from '../types/person';
import { buildExternalApiUrl } from '../config/environment';

interface AddressFormProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}

export default function AddressForm({ addresses, onAddressesChange }: AddressFormProps) {
  const [cepLoading, setCepLoading] = useState<number | null>(null);
  const [cepError, setCepError] = useState<(string | null)[]>([]);

  const handleCepChange = (idx: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[idx] = { ...newAddresses[idx], zipCode: value };
    onAddressesChange(newAddresses);
    const errors = [...cepError];
    errors[idx] = null;
    setCepError(errors);
  };

  const handleCepBlur = async (idx: number) => {
    const cep = addresses[idx]?.zipCode || '';
    if (cep.length === 8) {
      setCepLoading(idx);
      const errors = [...cepError];
      errors[idx] = null;
      setCepError(errors);
      try {
        const zipCodeUrl = buildExternalApiUrl(`/address/zip-code/${cep}`);
        const response = await fetch(zipCodeUrl);
        const data = await response.json();
        if (data && data.street) {
          const newAddresses = [...addresses];
          newAddresses[idx] = {
            ...newAddresses[idx],
            zipCode: data.zipCode?.replace(/\D/g, '') || cep,
            street: data.street || '',
            neighborhood: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || 'Brasil',
          };
          onAddressesChange(newAddresses);
        } else {
          const errors = [...cepError];
          errors[idx] = 'CEP não encontrado.';
          setCepError(errors);
        }
      } catch (err) {
        const errors = [...cepError];
        errors[idx] = 'Erro ao buscar CEP.';
        setCepError(errors);
      }
      setCepLoading(null);
    }
  };

  const handleAddressChange = (idx: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[idx] = { ...newAddresses[idx], [field]: value };
    onAddressesChange(newAddresses);
  };

  const handleAddAddress = () => {
    onAddressesChange([...addresses, {}]);
    setCepError([...cepError, null]);
  };

  const handleRemoveAddress = (idx: number) => {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    onAddressesChange(newAddresses);
    setCepError(cepError.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {addresses.map((address, idx) => (
        <div key={idx} className="item-card">
          <div className="form-grid-4">
            <input
              name={`zipCode-${idx}`}
              value={address.zipCode || ''}
              onChange={e => handleCepChange(idx, e.target.value)}
              onBlur={() => handleCepBlur(idx)}
              placeholder="CEP"
              maxLength={8}
              className="form-input"
            />
            <input 
              name={`street-${idx}`} 
              value={address.street || ''} 
              onChange={e => handleAddressChange(idx, 'street', e.target.value)} 
              placeholder="Rua" 
              className="form-input" 
            />
            <input 
              name={`number-${idx}`} 
              value={address.number || ''} 
              onChange={e => handleAddressChange(idx, 'number', e.target.value)} 
              placeholder="Número" 
              className="form-input" 
            />
            <input 
              name={`neighborhood-${idx}`} 
              value={address.neighborhood || ''} 
              onChange={e => handleAddressChange(idx, 'neighborhood', e.target.value)} 
              placeholder="Bairro" 
              className="form-input" 
            />
            <input 
              name={`city-${idx}`} 
              value={address.city || ''} 
              onChange={e => handleAddressChange(idx, 'city', e.target.value)} 
              placeholder="Cidade" 
              className="form-input" 
            />
            <input 
              name={`state-${idx}`} 
              value={address.state || ''} 
              onChange={e => handleAddressChange(idx, 'state', e.target.value)} 
              placeholder="Estado" 
              className="form-input" 
            />
            <input 
              name={`country-${idx}`} 
              value={address.country || ''} 
              onChange={e => handleAddressChange(idx, 'country', e.target.value)} 
              placeholder="País" 
              className="form-input" 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {(cepLoading === idx) && <span className="status-message status-loading">Buscando...</span>}
              {cepError[idx] && <span className="status-message status-error">{cepError[idx]}</span>}
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveAddress(idx)}
              className="btn btn-danger"
              title="Remover endereço"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddAddress}
        className="btn-add"
      >
        + Adicionar Endereço
      </button>
    </div>
  );
}