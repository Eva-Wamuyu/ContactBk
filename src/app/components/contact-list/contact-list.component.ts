import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from 'src/app/models/contact';
import { ModalAction } from 'src/app/models/modalAction';
import { ContactServiceService } from 'src/app/services/contact-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  viewMode: 'list' | 'grid' = 'list';
  showEditModal: boolean = false;
  selectedContact!: Contact;
  modalAction: ModalAction = ModalAction.VIEW;
  selectedContacts: Contact[] = [];
  sortOrder: 'asc' | 'desc' = 'asc'


  searchTerm: string = '';

  constructor(private contactService: ContactServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contacts = this.contactService.getContacts();
  }

  toggleViewMode(mode: 'list' | 'grid') {
    this.viewMode = mode;
  }

  viewContactDetails(contact: Contact): void {
    this.selectedContact = { ...contact };
    this.modalAction = ModalAction.VIEW;
    this.showEditModal = true;
  }

  openAddModal(): void {
    this.selectedContact = { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '' };
    this.modalAction = ModalAction.ADD;
    this.showEditModal = true;
  }

  saveContact(contact: Contact): void {
    if (contact.id === 0) {
      this.contactService.addContact(contact);
    } else {
      this.contactService.updateContact(contact);
    }
    Swal.fire({
      text: 'Contact Added Successfully',
      icon: 'success',
      confirmButtonColor: "#3B82F6"
    });
    this.loadContacts();
    this.showEditModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  toggleContactSelection(contact: Contact) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(c => c !== contact);
    } else {
      this.selectedContacts.push(contact);
    }

  }

  get isAllSelected(): boolean {
    return this.contacts.length > 0 && this.contacts.every(c => this.isSelected(c));
  }

  isSelected(contact: Contact) {
    return this.selectedContacts.includes(contact);
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedContacts = [...this.contacts];
    } else {
      this.selectedContacts = [];
    }
  }

  filterContacts(){
    this.contacts = this.contactService.searchContacts(this.searchTerm);
  }

  showUndoNotification = false;
  deletedContacts: Contact[] = [];
  undoTimeout: any;



  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact.id);
    this.deletedContacts = [contact];
    this.showUndoPopUp();
  }

  deleteSelectedContacts() {
    if (this.searchTerm) {
      const contactsToDelete = this.selectedContacts.filter(contact =>
        contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      contactsToDelete.forEach(contact => {
        this.contactService.deleteContact(contact.id);
      });
    } else {
      this.selectedContacts.forEach(contact => {
        this.contactService.deleteContact(contact.id);
      });
    }

    this.searchTerm = '';
    this.deletedContacts = [...this.selectedContacts];
    this.showUndoPopUp();
  }



  private showUndoPopUp() {
    this.selectedContacts = [];
    this.loadContacts();
    this.showUndoNotification = true;
    clearTimeout(this.undoTimeout);
    this.undoTimeout = setTimeout(() => {
      this.showUndoNotification = false;
    }, 5000);
    this.showEditModal = false;
  }





  undoDelete() {
    // console.log(this.deletedContacts)
    this.deletedContacts.forEach(contact => {
      this.contactService.addContact(contact);
    });

    this.deletedContacts = [];
    this.showUndoNotification = false;
     console.log(this.undoTimeout)
    clearTimeout(this.undoTimeout);

    this.loadContacts();
  }


  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortContacts();
  }

  sortContacts() {
    this.contacts.sort((a, b) => {
      const nameA = (a.firstName).toUpperCase();
      const nameB = (b.firstName).toUpperCase();
      if (this.sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }




}
