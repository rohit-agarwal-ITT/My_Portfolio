import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface VisitorInfo {
  name: string;
  mobile: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  constructor(private firestore: AngularFirestore) {}

  async saveVisitorInfo(visitorData: Omit<VisitorInfo, 'timestamp'>): Promise<void> {
    try {
      const visitor: VisitorInfo = {
        ...visitorData,
        timestamp: new Date()
      };
      
      await this.firestore.collection('visitors').add(visitor);
      console.log('Visitor information saved successfully');
    } catch (error) {
      console.error('Error saving visitor information:', error);
      throw error;
    }
  }

  async checkIfVisitorExists(mobile: string): Promise<boolean> {
    try {
      const snapshot = await this.firestore
        .collection('visitors', ref => ref.where('mobile', '==', mobile))
        .get()
        .toPromise();
      
      return !snapshot?.empty || false;
    } catch (error) {
      console.error('Error checking visitor existence:', error);
      return false;
    }
  }
} 