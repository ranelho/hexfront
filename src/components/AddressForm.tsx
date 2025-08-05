import { useState } from 'react';
import type { Address } from '../types/person';
import { buildApiUrl } from '../config/environment';

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
    
    // Limpar erro quando o usuário começar a digitar um novo CEP
    const errors = [...cepError];
    errors[idx] = null;
    setCepError(errors);
    
    // Se o CEP foi alterado e tem dados preenchidos, limpar os campos de endereço para forçar nova busca
    const currentAddress = newAddresses[idx];
    if (currentAddress.street || currentAddress.neighborhood || currentAddress.city || currentAddress.state) {
      newAddresses[idx] = {
        ...newAddresses[idx],
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        country: 'Brasil'
      };
      onAddressesChange(newAddresses);
    }
  };

  const handleCepBlur = async (idx: number) => {
    const cep = addresses[idx]?.zipCode || '';
    if (cep.length === 8) {
      setCepLoading(idx);
      const errors = [...cepError];
      errors[idx] = null;
      setCepError(errors);
      
      try {
        const zipCodeUrl = buildApiUrl(`/address/zip-code/${cep}`);
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
          errors[idx] = 'CEP não encontrado';
          setCepError(errors);
        }
      } catch (err) {
        const errors = [...cepError];
        errors[idx] = 'Erro ao buscar CEP';
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
            <div style={{ position: 'relative' }}>
              <input
                name={`zipCode-${idx}`}
                value={address.zipCode || ''}
                onChange={e => handleCepChange(idx, e.target.value)}
                onBlur={() => handleCepBlur(idx)}
                placeholder="CEP"
                maxLength={8}
                className="form-input"
                style={{ fontFamily: 'monospace' }}
                onKeyPress={(e) => {
                  if (!/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {/* Mensagem de status posicionada abaixo do input CEP */}
              <div style={{ 
                marginTop: '4px',
                minHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {cepLoading === idx && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    color: '#1976d2',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid #1976d2',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Buscando CEP...
                  </div>
                )}
                {cepError[idx] && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    color: '#d32f2f',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    {cepError[idx]}
                  </div>
                )}
              </div>
            </div>

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
              value={address.country || 'Brasil'} 
              onChange={e => handleAddressChange(idx, 'country', e.target.value)} 
              placeholder="País"
              className="form-input"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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