import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Contacts } from '../dummy/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {


  contacts = Contacts;

  constructor() {
   this.loadContactsFromLocalStorage();
  }

  private loadContactsFromLocalStorage(): void {
    const storedContacts = localStorage.getItem('contacts')
    this.contacts = storedContacts ? JSON.parse(storedContacts) : this.getContacts();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

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
      this.saveToLocalStorage();
    }
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.saveToLocalStorage();
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
    this.saveToLocalStorage();
  }

}
