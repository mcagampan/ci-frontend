import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientService } from '../core/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit, OnDestroy {
  @ViewChild('clientEditModal') clientEditModal: ElementRef;

  clients: Array<any> = [];

  clientForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  selectedClient: any;
  errorMessage: string;

  subscriptions$: Subscription[] = [];

  constructor(
    private ClientService: ClientService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.subscriptions$.push(
      this.ClientService.getClients().subscribe((response: any) => {
        this.clients = response.clients;
        console.log(this.clients);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((s) => s.unsubscribe());
  }

  newClient() {
    this.selectedClient = {
      id: null,
    };
    this.renderer.addClass(this.clientEditModal.nativeElement, 'is-active');
  }

  edit(client) {
    this.selectedClient = client;
    this.clientForm.get('name').setValue(client.name);
    this.clientForm.get('email').setValue(client.email);

    this.renderer.addClass(this.clientEditModal.nativeElement, 'is-active');
  }

  saveNewClient() {
    const newClient = {
      id: null,
      name: this.clientForm.get('name').value,
      email: this.clientForm.get('email').value,
      retainer_fee: Math.random() * 10,
    };
    this.subscriptions$.push(
      this.ClientService.addClient(newClient).subscribe((response: any) => {
        this.clients.push(response.client);
        this.clientForm.reset();
        this.selectedClient = null;

        this.renderer.removeClass(
          this.clientEditModal.nativeElement,
          'is-active'
        );
      })
    );
  }

  saveEdit() {
    this.subscriptions$.push(
      this.ClientService.updateClient({
        id: this.selectedClient.id,
        name: this.clientForm.get('name').value,
        email: this.clientForm.get('email').value,
      }).subscribe(
        (response) => {
          this.selectedClient.name = this.clientForm.get('name').value;
          this.selectedClient.email = this.clientForm.get('email').value;

          this.errorMessage = '';
          this.selectedClient = null;
          this.renderer.removeClass(
            this.clientEditModal.nativeElement,
            'is-active'
          );
        },
        (error) => {
          this.errorMessage = 'Invalid name/email.';
        }
      )
    );
  }

  delete(client) {
    this.selectedClient = client;
    this.subscriptions$.push(
      this.ClientService.deleteClient(this.selectedClient.id).subscribe(
        (response) => {
          this.clients.splice(this.clients.indexOf(this.selectedClient), 1);
          this.selectedClient = null;
        }
      )
    );
  }
}
