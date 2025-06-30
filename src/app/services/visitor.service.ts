import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface VisitorInfo {
  name?: string;
  mobile?: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  browserFingerprint?: string;
  isAnonymous?: boolean;
  visitCount?: number;
  lastVisit?: Date;
  referrer?: string;
  deviceType?: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  constructor(private firestore: AngularFirestore) {}

  // Generate a unique session ID for this visit
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate a simple browser fingerprint
  private generateBrowserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Browser Fingerprint', 10, 10);
    const fingerprint = canvas.toDataURL();
    
    const screenInfo = `${screen.width}x${screen.height}x${screen.colorDepth}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    return btoa(fingerprint + screenInfo + timezone + language).substr(0, 32);
  }

  // Track anonymous visitor
  async trackAnonymousVisitor(): Promise<void> {
    try {
      const sessionId = this.generateSessionId();
      const browserFingerprint = this.generateBrowserFingerprint();
      
      const visitor: VisitorInfo = {
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        sessionId: sessionId,
        browserFingerprint: browserFingerprint,
        isAnonymous: true,
        visitCount: 1,
        lastVisit: new Date(),
        referrer: document.referrer || 'direct',
        deviceType: this.getDeviceType(),
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      };
      
      // Check if this is a returning visitor
      const existingVisitor = await this.findExistingVisitor(browserFingerprint);
      if (existingVisitor) {
        visitor.visitCount = (existingVisitor.visitCount || 1) + 1;
        visitor.lastVisit = existingVisitor.timestamp;
      }
      
      await this.firestore.collection('visitors').add(visitor);
      console.log('Anonymous visitor tracked successfully');
      
      // Store session info in localStorage
      localStorage.setItem('visitorSessionId', sessionId);
      localStorage.setItem('visitorFingerprint', browserFingerprint);
    } catch (error) {
      console.error('Error tracking anonymous visitor:', error);
      throw error;
    }
  }

  // Save visitor info with optional personal details
  async saveVisitorInfo(visitorData: Partial<VisitorInfo>): Promise<void> {
    try {
      const sessionId = visitorData.sessionId || this.generateSessionId();
      const browserFingerprint = visitorData.browserFingerprint || this.generateBrowserFingerprint();
      
      const visitor: VisitorInfo = {
        ...visitorData,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        sessionId: sessionId,
        browserFingerprint: browserFingerprint,
        isAnonymous: !visitorData.name && !visitorData.mobile,
        visitCount: 1,
        lastVisit: new Date(),
        referrer: document.referrer || 'direct',
        deviceType: this.getDeviceType(),
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      };
      
      // Check if this is a returning visitor
      const existingVisitor = await this.findExistingVisitor(browserFingerprint);
      if (existingVisitor) {
        visitor.visitCount = (existingVisitor.visitCount || 1) + 1;
        visitor.lastVisit = existingVisitor.timestamp;
      }
      
      await this.firestore.collection('visitors').add(visitor);
      console.log('Visitor information saved successfully');
      
      // Store session info in localStorage
      localStorage.setItem('visitorSessionId', sessionId);
      localStorage.setItem('visitorFingerprint', browserFingerprint);
    } catch (error) {
      console.error('Error saving visitor information:', error);
      throw error;
    }
  }

  // Find existing visitor by browser fingerprint
  private async findExistingVisitor(browserFingerprint: string): Promise<VisitorInfo | null> {
    try {
      const snapshot = await this.firestore
        .collection('visitors', ref => ref.where('browserFingerprint', '==', browserFingerprint))
        .get()
        .toPromise();
      
      if (snapshot && !snapshot.empty) {
        const docs = snapshot.docs;
        // Return the most recent visit
        return docs[docs.length - 1].data() as VisitorInfo;
      }
      return null;
    } catch (error) {
      console.error('Error finding existing visitor:', error);
      return null;
    }
  }

  // Get device type based on user agent
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Check if visitor exists (for backward compatibility)
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

  // Get visitor statistics
  async getVisitorStats(): Promise<{
    totalVisitors: number;
    anonymousVisitors: number;
    namedVisitors: number;
    todayVisitors: number;
    uniqueVisitors: number;
  }> {
    try {
      const snapshot = await this.firestore.collection('visitors').get().toPromise();
      if (!snapshot) return { totalVisitors: 0, anonymousVisitors: 0, namedVisitors: 0, todayVisitors: 0, uniqueVisitors: 0 };

      const visitors = snapshot.docs.map(doc => doc.data() as VisitorInfo);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalVisitors = visitors.length;
      const anonymousVisitors = visitors.filter(v => v.isAnonymous).length;
      const namedVisitors = totalVisitors - anonymousVisitors;
      const todayVisitors = visitors.filter(v => {
        const visitDate = new Date(v.timestamp);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() === today.getTime();
      }).length;

      // Count unique visitors by browser fingerprint
      const uniqueFingerprints = new Set(visitors.map(v => v.browserFingerprint).filter(Boolean));
      const uniqueVisitors = uniqueFingerprints.size;

      return {
        totalVisitors,
        anonymousVisitors,
        namedVisitors,
        todayVisitors,
        uniqueVisitors
      };
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      return { totalVisitors: 0, anonymousVisitors: 0, namedVisitors: 0, todayVisitors: 0, uniqueVisitors: 0 };
    }
  }
} 