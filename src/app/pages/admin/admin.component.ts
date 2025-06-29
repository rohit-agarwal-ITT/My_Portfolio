import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitorInfo } from '../../services/visitor.service';
import { AuthService, AdminCredentials } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface VisitorInfoWithId extends VisitorInfo {
  id: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  visitors$: Observable<VisitorInfoWithId[]>;
  loading = true;
  error = '';
  selectedVisitor: VisitorInfoWithId | null = null;
  currentCredentials: AdminCredentials | null = null;
  editingCredentials = false;
  savingCredentials = false;
  credentialsForm: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.visitors$ = this.firestore
      .collection<VisitorInfo>('visitors', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(visitors => visitors as VisitorInfoWithId[])
      );

    this.credentialsForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.loadCredentials();
    
    this.subscription.add(
      this.visitors$.subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load visitor data';
          this.loading = false;
          console.error('Error loading visitors:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async loadCredentials(): Promise<void> {
    try {
      this.currentCredentials = await this.authService.getCurrentAdminCredentials();
      if (this.currentCredentials) {
        this.credentialsForm.patchValue({
          name: this.currentCredentials.name,
          contact: this.currentCredentials.contact
        });
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  }

  toggleCredentialsEdit(): void {
    this.editingCredentials = !this.editingCredentials;
    if (this.editingCredentials && this.currentCredentials) {
      this.credentialsForm.patchValue({
        name: this.currentCredentials.name,
        contact: this.currentCredentials.contact
      });
    }
  }

  async saveCredentials(): Promise<void> {
    if (this.credentialsForm.invalid) {
      return;
    }

    this.savingCredentials = true;
    try {
      const formData = this.credentialsForm.value;
      const result = await this.authService.updateAdminCredentials(formData.name, formData.contact);
      
      if (result.success) {
        this.currentCredentials = await this.authService.getCurrentAdminCredentials();
        this.editingCredentials = false;
        alert('Credentials updated successfully!');
      } else {
        alert('Failed to update credentials: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      alert('Failed to save credentials');
    } finally {
      this.savingCredentials = false;
    }
  }

  cancelCredentialsEdit(): void {
    this.editingCredentials = false;
    this.credentialsForm.reset();
    if (this.currentCredentials) {
      this.credentialsForm.patchValue({
        name: this.currentCredentials.name,
        contact: this.currentCredentials.contact
      });
    }
  }

  onContactInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    // Update the form control value
    this.credentialsForm.get('contact')?.setValue(input.value, { emitEvent: false });
  }

  selectVisitor(visitor: VisitorInfoWithId): void {
    this.selectedVisitor = visitor;
  }

  closeVisitor(): void {
    this.selectedVisitor = null;
  }

  deleteVisitor(visitorId: string): void {
    if (confirm('Are you sure you want to delete this visitor record?')) {
      this.firestore.collection('visitors').doc(visitorId).delete()
        .then(() => {
          console.log('Visitor record deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting visitor record:', error);
          alert('Failed to delete visitor record');
        });
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    const date = (timestamp as any)?.toDate ? (timestamp as any).toDate() : new Date(timestamp);
    return date.toLocaleString();
  }

  getTodayVisitorsCount(visitors: VisitorInfoWithId[]): number {
    if (!visitors) return 0;
    const today = new Date();
    return visitors.filter(v => {
      const date = (v.timestamp as any)?.toDate ? (v.timestamp as any).toDate() : new Date(v.timestamp);
      return date.toDateString() === today.toDateString();
    }).length;
  }

  getDeviceInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    if (userAgent.includes('iPad')) return 'iPad';
    return 'Desktop';
  }
} 