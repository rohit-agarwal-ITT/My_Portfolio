import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitorInfo } from '../../services/visitor.service';
import { AuthService, AdminCredentials } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

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
  deletingAll = false;
  showDeleteAllModal = false;
  visitorCountToDelete = 0;
  showDeleteVisitorModal = false;
  visitorToDelete: VisitorInfoWithId | null = null;
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

  deleteVisitor(visitor: VisitorInfoWithId): void {
    this.visitorToDelete = visitor;
    this.showDeleteVisitorModal = true;
  }

  cancelDeleteVisitor(): void {
    this.showDeleteVisitorModal = false;
    this.visitorToDelete = null;
  }

  async confirmDeleteVisitor(): Promise<void> {
    if (!this.visitorToDelete) return;
    const visitorId = this.visitorToDelete.id;
    this.showDeleteVisitorModal = false;
    this.visitorToDelete = null;
    try {
      await this.firestore.collection('visitors').doc(visitorId).delete();
      this.showSuccessToast('Visitor record deleted successfully');
    } catch (error) {
      console.error('Error deleting visitor record:', error);
      alert('Failed to delete visitor record');
    }
  }

  async deleteAllVisitors(): Promise<void> {
    console.log('Delete All button clicked!');
    
    try {
      const visitors = await firstValueFrom(this.visitors$);
      console.log('Visitors data:', visitors);
      
      const visitorCount = visitors?.length || 0;
      console.log('Visitor count:', visitorCount);
      
      if (visitorCount === 0) {
        alert('No visitors to delete');
        return;
      }

      this.visitorCountToDelete = visitorCount;
      this.showDeleteAllModal = true;
      console.log('Modal should be showing now');
    } catch (error) {
      console.error('Error in deleteAllVisitors:', error);
      alert('Error loading visitor data');
    }
  }

  cancelDeleteAll(): void {
    this.showDeleteAllModal = false;
    this.visitorCountToDelete = 0;
  }

  async confirmDeleteAll(): Promise<void> {
    this.deletingAll = true;
    this.error = '';

    try {
      // Get all visitor documents
      const visitorsSnapshot = await this.firestore.collection('visitors').get().toPromise();
      
      if (!visitorsSnapshot || visitorsSnapshot.empty) {
        alert('No visitors found to delete');
        return;
      }

      // Create batch for bulk deletion
      const batch = this.firestore.firestore.batch();
      
      visitorsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Execute the batch
      await batch.commit();
      
      console.log(`Successfully deleted ${visitorsSnapshot.size} visitor records`);
      
      // Close modal and show success message
      this.showDeleteAllModal = false;
      this.visitorCountToDelete = 0;
      
      // Show success toast
      this.showSuccessToast(`Successfully deleted ${visitorsSnapshot.size} visitor records`);
      
    } catch (error) {
      console.error('Error deleting all visitors:', error);
      this.error = 'Failed to delete all visitors. Please try again.';
      alert('Failed to delete all visitors. Please try again.');
    } finally {
      this.deletingAll = false;
    }
  }

  private showSuccessToast(message: string): void {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '2.5rem';
    toast.style.right = '2.5rem';
    toast.style.background = 'linear-gradient(90deg, #4caf50, #45a049)';
    toast.style.color = '#fff';
    toast.style.fontWeight = '700';
    toast.style.padding = '0.6rem 1.1rem 0.6rem 0.9rem';
    toast.style.borderRadius = '1.1rem';
    toast.style.boxShadow = '0 8px 32px rgba(76,175,80,0.13), 0 1.5px 8px 0 rgba(76,175,80,0.10)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.97rem';
    toast.style.letterSpacing = '0.01em';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.3rem';
    toast.style.border = '1.5px solid #4caf50';
    (toast.style as any).backdropFilter = 'blur(6px)';
    toast.style.transition = 'transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.25s';
    toast.style.transform = 'translateY(60px)';
    toast.style.opacity = '0';
    toast.style.maxWidth = '320px';
    toast.style.minWidth = '180px';
    toast.style.whiteSpace = 'pre-line';

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    setTimeout(() => {
      toast.style.transform = 'translateY(60px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
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