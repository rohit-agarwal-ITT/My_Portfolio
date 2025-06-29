import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { VisitorInfo } from '../../services/visitor.service';
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
  private subscription: Subscription = new Subscription();

  constructor(private firestore: AngularFirestore) {
    this.visitors$ = this.firestore
      .collection<VisitorInfo>('visitors', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(visitors => visitors as VisitorInfoWithId[])
      );
  }

  ngOnInit(): void {
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