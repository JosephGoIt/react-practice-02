import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import css from './ContactForm.module.css';
import PropTypes from 'prop-types';

const ContactForm = ({ addContact, contacts }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '' || number.trim() === '') {
      return;
    }

    const nameExist = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExist) {
      alert(`${name} already exists in contacts!`);
      return;
    }

    addContact({
      id: nanoid(),
      name: name.trim(),
      number: number.trim(),
    });

    setName('');
    setNumber('');
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label className={css.formField}>
        <p className={css.formLabel}>Name</p>
        <input
          type="text"
          name="name"
          pattern="^[a-zA-Zа-яА-Я]+(([' \-][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan."
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className={css.formField}>
        <p className={css.formLabel}>Number</p>
        <input
          type="tel"
          name="number"
          pattern="\+?\d{1,4}?[\-.\s]?\(?\d{1,3}?\)?[\-.\s]?\d{1,4}[\-.\s]?\d{1,4}[\-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </label>
      <button className={css.formButton} type="submit">
        Add Contact
      </button>
    </form>
  );
};

ContactForm.propTypes = {
  addContact: PropTypes.func.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
};

const ContactList = ({ filterContact, deleteContact }) => {
  const filteredContacts = filterContact();

  return (
    <ul>
      {filteredContacts.map((filteredContact) => (
        <ContactListItem
          key={filteredContact.id}
          filteredContact={filteredContact}
          deleteContact={deleteContact}
        />
      ))}
    </ul>
  );
};

ContactList.propTypes = {
  filterContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
};

const ContactListItem = ({ filteredContact, deleteContact }) => {
  return (
    <li className={css.contactListItem}>
      <p>{filteredContact.name}:</p>
      <p>{filteredContact.number}</p>
      <button onClick={() => deleteContact(filteredContact.id)}>Delete</button>
    </li>
  );
};

ContactListItem.propTypes = {
  filteredContact: PropTypes.object.isRequired,
  deleteContact: PropTypes.func.isRequired,
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div className={css.container}>
      <p>Find Contacts by Name</p>
      <input
        type="text"
        name="filter"
        placeholder="Search by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

const Section = ({ title, children }) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const App = () => {
  const [contacts, setContacts] = useState([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ]);
  const [filter, setFilter] = useState('');

  const addContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const deleteContact = (id) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  const filterContact = () => {
    const filterLowerCase = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filterLowerCase)
    );
  };

  return (
    <div>
      <Section title="Phonebook">
        <ContactForm addContact={addContact} contacts={contacts} />
      </Section>
      <Section title="Contacts">
        <Filter filter={filter} setFilter={setFilter} />
        <ContactList filterContact={filterContact} deleteContact={deleteContact} />
      </Section>
    </div>
  );
};

export default App;
