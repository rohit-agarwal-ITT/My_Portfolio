import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { VisitorService } from './visitor.service';

export interface AdminUser {
  id: string;
  name: string;
  contact: string;
  role: 'admin';
  createdAt: Date;
}

export interface RegularUser {
  id: string;
  name?: string;
  contact?: string;
  role: 'user';
  createdAt: Date;
  isAnonymous?: boolean;
}

export interface AnonymousUser {
  id: string;
  role: 'anonymous';
  createdAt: Date;
  sessionId: string;
  browserFingerprint: string;
}

export type User = AdminUser | RegularUser | AnonymousUser;

export interface AdminCredentials {
  name: string;
  contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private visitorService: VisitorService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }

  // Initialize anonymous visitor tracking
  async initializeAnonymousVisitor(): Promise<void> {
    try {
      await this.visitorService.trackAnonymousVisitor();
      
      const sessionId = localStorage.getItem('visitorSessionId');
      const browserFingerprint = localStorage.getItem('visitorFingerprint');
      
      if (sessionId && browserFingerprint) {
        const anonymousUser: AnonymousUser = {
          id: 'anonymous-' + Date.now(),
          role: 'anonymous',
          createdAt: new Date(),
          sessionId: sessionId,
          browserFingerprint: browserFingerprint
        };
        
        localStorage.setItem('adminUser', JSON.stringify(anonymousUser));
        this.currentUserSubject.next(anonymousUser);
      }
    } catch (error) {
      console.error('Error initializing anonymous visitor:', error);
    }
  }

  // Authenticate user (now optional for regular users)
  async authenticateUser(name?: string, contact?: string): Promise<{ success: boolean; message: string; isAdmin: boolean }> {
    try {
      // If no name/contact provided, treat as anonymous
      if (!name || !contact) {
        await this.initializeAnonymousVisitor();
        return { success: true, message: 'Welcome to my portfolio!', isAdmin: false };
      }

      // Get admin credentials from Firestore
      const adminCredentials = await this.getAdminCredentials();
      
      if (!adminCredentials) {
        // If no admin credentials exist, create default ones
        await this.setAdminCredentials('Rohit Agarwal', '9876543210');
        console.log('Default admin credentials created. Please update them in the admin dashboard.');
      }

      // Get the credentials again (either existing or newly created)
      const credentials = await this.getAdminCredentials();
      
      if (!credentials) {
        // Fallback to regular user if still no credentials
        await this.saveVisitorInfo(name, contact);
        return { success: true, message: 'Welcome to my portfolio!', isAdmin: false };
      }

      // Check if this is admin login
      if (name.toLowerCase() === credentials.name.toLowerCase() && contact === credentials.contact) {
        const adminUser: AdminUser = {
          id: 'admin-001',
          name: name,
          contact: contact,
          role: 'admin',
          createdAt: new Date()
        };

        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        this.currentUserSubject.next(adminUser);

        // Save to Firestore for audit trail
        await this.firestore.collection('admin_logins').add({
          name: name,
          contact: contact,
          timestamp: new Date(),
          userAgent: navigator.userAgent,
          isAdmin: true
        });

        return { success: true, message: 'Welcome back, Admin!', isAdmin: true };
      } else {
        // Regular user - save visitor info
        await this.saveVisitorInfo(name, contact);

        // Set current user for regular user
        const regularUser: RegularUser = {
          id: 'visitor-' + Date.now(),
          name: name,
          contact: contact,
          role: 'user',
          createdAt: new Date(),
          isAnonymous: false
        };
        localStorage.setItem('adminUser', JSON.stringify(regularUser));
        this.currentUserSubject.next(regularUser as any);

        return { success: true, message: 'Welcome to my portfolio!', isAdmin: false };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed. Please try again.', isAdmin: false };
    }
  }

  // Save visitor info with optional personal details
  private async saveVisitorInfo(name?: string, contact?: string): Promise<void> {
    try {
      const visitorData: any = {
        timestamp: new Date(),
        userAgent: navigator.userAgent
      };

      if (name) visitorData.name = name;
      if (contact) visitorData.mobile = contact;

      await this.visitorService.saveVisitorInfo(visitorData);
    } catch (error) {
      console.error('Error saving visitor info:', error);
    }
  }

  // Get admin credentials
  private async getAdminCredentials(): Promise<AdminCredentials | null> {
    try {
      const doc = await this.firestore.collection('admin_credentials').doc('default').get().toPromise();
      return doc?.exists ? doc.data() as AdminCredentials : null;
    } catch (error) {
      console.error('Error getting admin credentials:', error);
      return null;
    }
  }

  // Set admin credentials
  private async setAdminCredentials(name: string, contact: string): Promise<void> {
    try {
      await this.firestore.collection('admin_credentials').doc('default').set({
        name: name,
        contact: contact
      });
    } catch (error) {
      console.error('Error setting admin credentials:', error);
    }
  }

  // Update admin credentials
  async updateAdminCredentials(name: string, contact: string): Promise<boolean> {
    try {
      await this.setAdminCredentials(name, contact);
      return true;
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      return false;
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Check if user is anonymous
  isAnonymous(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'anonymous';
  }

  // Check if user is authenticated (has any role)
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get current admin credentials
  async getCurrentAdminCredentials(): Promise<AdminCredentials | null> {
    return await this.getAdminCredentials();
  }
} 