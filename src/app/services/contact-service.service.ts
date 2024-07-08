import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Contacts } from '../dummy/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {

  constructor() { }

  contacts = Contacts;

  getContacts(): Contact[] {
    return this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  getContactById(id: number): Contact  {
    const contact = this.contacts.find(contact => contact.id === id);
    if (!contact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
  }

  searchContacts(query: string): Contact[] {
    return this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase()) ||
      contact.phoneNumber.includes(query)
    );
  }

  addContact(contact: Contact): void {
    const newId = this.contacts.reduce((maxId, c) => Math.max(c.id, maxId), 0) + 1;
    contact.id = newId;
    this.contacts.push(contact);
  }

}