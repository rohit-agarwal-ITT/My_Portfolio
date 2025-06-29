import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AdminUser {
  id: string;
  name: string;
  contact: string;
  role: 'admin';
  createdAt: Date;
}

export interface AdminCredentials {
  name: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private firestore: AngularFirestore) {
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

  private async getAdminCredentials(): Promise<AdminCredentials | null> {
    try {
      const credentialsDoc = await this.firestore
        .collection('admin_credentials')
        .doc('default')
        .get()
        .toPromise();

      if (credentialsDoc?.exists) {
        return credentialsDoc.data() as AdminCredentials;
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
      return null;
    }
  }

  async setAdminCredentials(name: string, contact: string): Promise<{ success: boolean; message: string }> {
    try {
      const credentials: AdminCredentials = {
        name: name,
        contact: contact,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.firestore
        .collection('admin_credentials')
        .doc('default')
        .set(credentials);

      return { success: true, message: 'Admin credentials updated successfully' };
    } catch (error) {
      console.error('Error setting admin credentials:', error);
      return { success: false, message: 'Failed to update admin credentials' };
    }
  }

  async authenticateUser(name: string, contact: string): Promise<{ success: boolean; message: string; isAdmin: boolean }> {
    try {
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
        return { success: true, message: 'Welcome to my portfolio!', isAdmin: false };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed. Please try again.', isAdmin: false };
    }
  }

  private async saveVisitorInfo(name: string, contact: string): Promise<void> {
    try {
      await this.firestore.collection('visitors').add({
        name: name,
        mobile: contact,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error saving visitor info:', error);
    }
  }

  logout(): void {
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  async getCurrentAdminCredentials(): Promise<AdminCredentials | null> {
    return await this.getAdminCredentials();
  }

  async updateAdminCredentials(name: string, contact: string): Promise<{ success: boolean; message: string }> {
    try {
      const credentials: AdminCredentials = {
        name: name,
        contact: contact,
        createdAt: new Date(), // This will be overwritten with existing creation date
        updatedAt: new Date()
      };

      // Get existing credentials to preserve creation date
      const existing = await this.getAdminCredentials();
      if (existing) {
        credentials.createdAt = existing.createdAt;
      }

      await this.firestore
        .collection('admin_credentials')
        .doc('default')
        .set(credentials);

      return { success: true, message: 'Admin credentials updated successfully' };
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      return { success: false, message: 'Failed to update admin credentials' };
    }
  }

  async createAdminAccount(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if admin already exists
      const existingAdmin = await this.firestore
        .collection('admins', ref => ref.where('email', '==', email))
        .get()
        .toPromise();

      if (!existingAdmin?.empty) {
        return { success: false, message: 'Admin account already exists' };
      }

      // Create new admin account
      const adminData = {
        email: email,
        password: password, // In production, this should be hashed
        name: name,
        role: 'admin',
        createdAt: new Date()
      };

      await this.firestore.collection('admins').add(adminData);
      return { success: true, message: 'Admin account created successfully' };
    } catch (error) {
      console.error('Error creating admin account:', error);
      return { success: false, message: 'Failed to create admin account' };
    }
  }
} 