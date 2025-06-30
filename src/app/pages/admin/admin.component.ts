import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitorInfo } from '../../services/visitor.service';
import { AuthService, AdminCredentials } from '../../services/auth.service';
import { VisitorService } from '../../services/visitor.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

interface VisitorInfoWithId extends VisitorInfo {
  id: string;
}

interface VisitorStats {
  totalVisitors: number;
  anonymousVisitors: number;
  namedVisitors: number;
  todayVisitors: number;
  uniqueVisitors: number;
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
  visitorStats: VisitorStats = {
    totalVisitors: 0,
    anonymousVisitors: 0,
    namedVisitors: 0,
    todayVisitors: 0,
    uniqueVisitors: 0
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private visitorService: VisitorService,
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
    this.loadVisitorStats();
    
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

  private async loadCredentials(): Promise<void> {
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

  private async loadVisitorStats(): Promise<void> {
    try {
      this.visitorStats = await this.visitorService.getVisitorStats();
    } catch (error) {
      console.error('Error loading visitor stats:', error);
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
    if (this.credentialsForm.invalid) return;

    this.savingCredentials = true;
    try {
      const formData = this.credentialsForm.value;
      const success = await this.authService.updateAdminCredentials(formData.name, formData.contact);
      
      if (success) {
        this.currentCredentials = formData;
        this.editingCredentials = false;
        // Show success message
      } else {
        // Show error message
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    } finally {
      this.savingCredentials = false;
    }
  }

  cancelCredentialsEdit(): void {
    this.editingCredentials = false;
    if (this.currentCredentials) {
      this.credentialsForm.patchValue({
        name: this.currentCredentials.name,
        contact: this.currentCredentials.contact
      });
    }
  }

  selectVisitor(visitor: VisitorInfoWithId): void {
    this.selectedVisitor = visitor;
  }

  closeVisitor(): void {
    this.selectedVisitor = null;
  }

  async deleteVisitor(visitor: VisitorInfoWithId): Promise<void> {
    this.visitorToDelete = visitor;
    this.showDeleteVisitorModal = true;
  }

  async confirmDeleteVisitor(): Promise<void> {
    if (!this.visitorToDelete) return;

    try {
      await this.firestore.collection('visitors').doc(this.visitorToDelete.id).delete();
      this.showDeleteVisitorModal = false;
      this.visitorToDelete = null;
      this.selectedVisitor = null;
      await this.loadVisitorStats();
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  }

  cancelDeleteVisitor(): void {
    this.showDeleteVisitorModal = false;
    this.visitorToDelete = null;
  }

  showDeleteAllConfirmation(): void {
    this.visitorCountToDelete = 0;
    this.visitors$.subscribe(visitors => {
      this.visitorCountToDelete = visitors.length;
    }).unsubscribe();
    this.showDeleteAllModal = true;
  }

  async confirmDeleteAll(): Promise<void> {
    this.deletingAll = true;
    try {
      const visitors = await firstValueFrom(this.visitors$);
      const deletePromises = visitors.map(visitor => 
        this.firestore.collection('visitors').doc(visitor.id).delete()
      );
      await Promise.all(deletePromises);
      this.showDeleteAllModal = false;
      await this.loadVisitorStats();
    } catch (error) {
      console.error('Error deleting all visitors:', error);
    } finally {
      this.deletingAll = false;
    }
  }

  cancelDeleteAll(): void {
    this.showDeleteAllModal = false;
  }

  getDeviceInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTodayVisitorsCount(visitors: VisitorInfoWithId[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return visitors.filter(visitor => {
      const visitDate = new Date(visitor.timestamp);
      visitDate.setHours(0, 0, 0, 0);
      return visitDate.getTime() === today.getTime();
    }).length;
  }

  onContactInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    // Update the form control value
    this.credentialsForm.get('contact')?.setValue(input.value, { emitEvent: false });
  }
} 