import type { Contact } from '../types/person';

interface ContactFormProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export default function ContactForm({ contacts, onContactsChange }: ContactFormProps) {
  const handleContactChange = (idx: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[idx] = { ...newContacts[idx], [field]: value };
    onContactsChange(newContacts);
  };

  const handleAddContact = () => {
    onContactsChange([...contacts, {}]);
  };

  const handleRemoveContact = (idx: number) => {
    const newContacts = contacts.filter((_, i) => i !== idx);
    onContactsChange(newContacts);
  };

  return (
    <div>
      {contacts.map((contact, idx) => (
        <div key={idx} className="item-card">
          <div className="form-grid-3">
            <input
              name={`email-${idx}`}
              type="email"
              value={contact.email || ''}
              onChange={e => handleContactChange(idx, 'email', e.target.value)}
              placeholder="Email"
              className="form-input"
            />
            <input
              name={`ddd-${idx}`}
              value={contact.ddd || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                handleContactChange(idx, 'ddd', value);
              }}
              placeholder="11"
              maxLength={2}
              className="form-input"
            />
            <input
              name={`telephoneNumber-${idx}`}
              value={contact.telephoneNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                let maskedValue = '';
                if (value.length > 0) {
                  if (value.length <= 4) {
                    maskedValue = value;
                  } else if (value.length <= 8) {
                    maskedValue = `${value.slice(0, 4)}-${value.slice(4)}`;
                  } else {
                    maskedValue = `${value.slice(0, 5)}-${value.slice(5, 9)}`;
                  }
                }
                handleContactChange(idx, 'telephoneNumber', maskedValue);
              }}
              placeholder="99999-9999"
              maxLength={10}
              className="form-input"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => handleRemoveContact(idx)}
              className="btn btn-danger"
              title="Remover contato"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddContact}
        className="btn-add"
      >
        + Adicionar Contato
      </button>
    </div>
  );
}