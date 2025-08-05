import { useState, useEffect } from 'react';
import type { Dependent } from '../types/person';
import { getDependentTypes } from '../services/dependentService';

interface DependentFormProps {
  dependents: Dependent[];
  onDependentsChange: (dependents: Dependent[]) => void;
}

export default function DependentForm({ dependents, onDependentsChange }: DependentFormProps) {
  const [dependentTypes, setDependentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDependentTypes = async () => {
      try {
        const types = await getDependentTypes();
        setDependentTypes(types);
      } catch (error) {
        console.error('Erro ao carregar tipos de dependentes:', error);
        // Fallback para tipos padrão em caso de erro
        setDependentTypes(['Pai', 'Mãe', 'Filho', 'Filha', 'Sobrinho', 'Sobrinha', 'Entiado', 'Entiada']);
      } finally {
        setLoading(false);
      }
    };

    loadDependentTypes();
  }, []);

  const handleDependentChange = (idx: number, field: keyof Dependent, value: string) => {
    const newDependents = [...dependents];
    newDependents[idx] = { ...newDependents[idx], [field]: value };
    onDependentsChange(newDependents);
  };

  const handleAddDependent = () => {
    onDependentsChange([...dependents, {}]);
  };

  const handleRemoveDependent = (idx: number) => {
    const newDependents = dependents.filter((_, i) => i !== idx);
    onDependentsChange(newDependents);
  };

  return (
    <div>
      {dependents.map((dependent, idx) => (
        <div key={idx} className="item-card">
          <div className="form-grid-4">
            <input
              name={`dependentName-${idx}`}
              value={dependent.name || ''}
              onChange={e => handleDependentChange(idx, 'name', e.target.value)}
              placeholder="Nome do Dependente"
              className="form-input"
            />
            <input
              name={`dependentCpf-${idx}`}
              value={dependent.cpf || ''}
              onChange={e => handleDependentChange(idx, 'cpf', e.target.value)}
              placeholder="CPF"
              maxLength={11}
              className="form-input"
            />
            <input
              name={`dependentBirthDate-${idx}`}
              type="date"
              value={dependent.birthDate || ''}
              onChange={e => handleDependentChange(idx, 'birthDate', e.target.value)}
              placeholder="Data de Nascimento"
              className="form-input"
            />
            <select
              name={`dependentType-${idx}`}
              value={dependent.dependentType || ''}
              onChange={e => handleDependentChange(idx, 'dependentType', e.target.value)}
              className="form-input"
              disabled={loading}
            >
              <option value="">{loading ? 'Carregando...' : 'Tipo de Dependente'}</option>
              {dependentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => handleRemoveDependent(idx)}
              className="btn btn-danger"
              title="Remover dependente"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddDependent}
        className="btn-add"
      >
        + Adicionar Dependente
      </button>
    </div>
  );
}