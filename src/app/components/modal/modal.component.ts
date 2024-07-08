import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from 'src/app/models/contact';
import { ModalAction } from 'src/app/models/modalAction';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() contact!: Contact;
  @Input() modalAction: ModalAction = ModalAction.VIEW;
  @Output() save = new EventEmitter<Contact>();
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  ModalAction = ModalAction;

  modalTitle!: string;
  tempContact!: Contact;

  ngOnInit() {
    this.tempContact = this.contact ;
    this.setModalTitle();
  }



  saveContact(form:NgForm): void {
    if (form.invalid) {
      const fields = ['firstName', 'phoneNumber'];
      fields.forEach(fieldName=>{
        const control = form.controls[fieldName];
        control.markAsTouched();
      })
      return;
    }
    this.save.emit(this.tempContact);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  deleteContact() {
    this.delete.emit();
    this.closeModal();
  }

  updateModalAction(action: ModalAction): void {
    this.modalAction = action;
    this.setModalTitle();
  }

  private setModalTitle(): void {
    switch (this.modalAction) {
      case ModalAction.VIEW:
        this.modalTitle = 'Contact Details';
        break;
      case ModalAction.ADD:
        this.modalTitle = 'Add Contact';
        break;
      case ModalAction.EDIT:
        this.modalTitle = 'Edit Contact';
        break;
      default:
        this.modalTitle = 'Contact Details';
        break;
    }
  }
}
