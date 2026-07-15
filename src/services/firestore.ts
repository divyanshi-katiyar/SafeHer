import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit
} from "firebase/firestore";
import { db } from "../firebase/config";
import { EmergencyContact, Journey, Incident, SOSEvent, SafeNotification } from "../types";

// ==========================================
// EMERGENCY CONTACTS SERVICE
// ==========================================
export const contactService = {
  getContacts: async (userId: string): Promise<EmergencyContact[]> => {
    const q = query(collection(db, "contacts"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const contacts: EmergencyContact[] = [];
    snap.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() } as EmergencyContact);
    });
    return contacts;
  },

  addContact: async (contact: Omit<EmergencyContact, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "contacts"), contact);
    return docRef.id;
  },

  updateContact: async (id: string, contact: Partial<EmergencyContact>): Promise<void> => {
    const docRef = doc(db, "contacts", id);
    await updateDoc(docRef, contact);
  },

  deleteContact: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "contacts", id));
  }
};

// ==========================================
// JOURNEY TRACKER SERVICE
// ==========================================
export const journeyService = {
  getJourneys: async (userId: string): Promise<Journey[]> => {
    const q = query(
      collection(db, "journeys"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const journeys: Journey[] = [];
    snap.forEach((doc) => {
      journeys.push({ id: doc.id, ...doc.data() } as Journey);
    });
    return journeys;
  },

  getActiveJourneys: async (userId: string): Promise<Journey[]> => {
    const q = query(
      collection(db, "journeys"), 
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const journeys: Journey[] = [];
    snap.forEach((doc) => {
      journeys.push({ id: doc.id, ...doc.data() } as Journey);
    });
    return journeys;
  },

  startJourney: async (journey: Omit<Journey, "id" | "status" | "createdAt">): Promise<string> => {
    const newJourney: Omit<Journey, "id"> = {
      ...journey,
      status: "active",
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "journeys"), newJourney);

    // Auto-create a Notification alert for user
    await notificationService.addNotification({
      userId: journey.userId,
      title: "Journey Started",
      message: `Your journey from ${journey.source} to ${journey.destination} is now being monitored. Expected arrival: ${journey.expectedArrivalTime}.`,
      type: "journey",
      read: false
    });

    // Auto-create simulated SMS for each guardian contact
    try {
      const userSnap = await getDoc(doc(db, "users", journey.userId));
      const userName = userSnap.exists() ? (userSnap.data().name || "Your friend") : "Your friend";
      
      const contacts = await contactService.getContacts(journey.userId);
      for (const contact of contacts) {
        await notificationService.addNotification({
          userId: journey.userId,
          title: `SMS Sent to Guardian: ${contact.name}`,
          message: `Progress alert SMS dispatched to ${contact.phone}: "SafeHer tracking: ${userName} has started a journey from ${journey.source} to ${journey.destination}. Expected arrival: ${journey.expectedArrivalTime}."`,
          type: "journey",
          read: false
        });
      }
    } catch (err) {
      console.error("Failed to simulate guardian notifications on journey start:", err);
    }

    return docRef.id;
  },

  updateJourneyStatus: async (id: string, status: Journey["status"]): Promise<void> => {
    const docRef = doc(db, "journeys", id);
    await updateDoc(docRef, { status });

    if (status === "completed") {
      try {
        const journeySnap = await getDoc(docRef);
        if (journeySnap.exists()) {
          const journeyData = journeySnap.data() as Journey;
          const userSnap = await getDoc(doc(db, "users", journeyData.userId));
          const userName = userSnap.exists() ? (userSnap.data().name || "Your friend") : "Your friend";

          await notificationService.addNotification({
            userId: journeyData.userId,
            title: "Arrived Safely!",
            message: `You checked in as safely arrived at ${journeyData.destination}.`,
            type: "journey",
            read: false
          });

          const contacts = await contactService.getContacts(journeyData.userId);
          for (const contact of contacts) {
            await notificationService.addNotification({
              userId: journeyData.userId,
              title: `Safe Arrival SMS Sent to: ${contact.name}`,
              message: `Arrival alert SMS dispatched to ${contact.phone}: "SafeHer update: ${userName} has arrived safely at their destination."`,
              type: "journey",
              read: false
            });
          }
        }
      } catch (err) {
        console.error("Failed to simulate guardian notifications on journey completion:", err);
      }
    }
  }
};

// ==========================================
// INCIDENT REPORTING SERVICE
// ==========================================
export const incidentService = {
  getIncidents: async (): Promise<Incident[]> => {
    const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const incidents: Incident[] = [];
    snap.forEach((doc) => {
      incidents.push({ id: doc.id, ...doc.data() } as Incident);
    });
    return incidents;
  },

  getUserIncidents: async (userId: string): Promise<Incident[]> => {
    const q = query(
      collection(db, "incidents"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const incidents: Incident[] = [];
    snap.forEach((doc) => {
      incidents.push({ id: doc.id, ...doc.data() } as Incident);
    });
    return incidents;
  },

  reportIncident: async (incident: Omit<Incident, "id" | "createdAt">): Promise<string> => {
    const newIncident: Omit<Incident, "id"> = {
      ...incident,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "incidents"), newIncident);
    return docRef.id;
  }
};

// ==========================================
// SOS EVENTS SERVICE
// ==========================================
export const sosService = {
  getSOSHistory: async (userId: string): Promise<SOSEvent[]> => {
    const q = query(
      collection(db, "sosHistory"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const list: SOSEvent[] = [];
    snap.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as SOSEvent);
    });
    return list;
  },

  triggerSOS: async (userId: string, location: SOSEvent["location"]): Promise<string> => {
    const sosEvent: Omit<SOSEvent, "id"> = {
      userId,
      timestamp: new Date().toISOString(),
      location,
      status: "active",
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "sosHistory"), sosEvent);
    
    // Auto-create a Notification alert for user
    await notificationService.addNotification({
      userId,
      title: "SOS Alert Triggered!",
      message: `SOS alert activated at ${new Date().toLocaleTimeString()}. Emergency contacts simulated-notified with coordinates (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}).`,
      type: "sos",
      read: false,
    });

    // Auto-create simulated urgent SMS for each guardian contact
    try {
      const userSnap = await getDoc(doc(db, "users", userId));
      const userName = userSnap.exists() ? (userSnap.data().name || "Your friend") : "Your friend";
      
      const contacts = await contactService.getContacts(userId);
      for (const contact of contacts) {
        await notificationService.addNotification({
          userId,
          title: `URGENT SOS SMS Sent to: ${contact.name}`,
          message: `URGENT SOS Alert from ${userName}! I need help immediately. My current location is: https://maps.google.com/?q=${location.lat},${location.lng}`,
          type: "sos",
          read: false
        });
      }
    } catch (err) {
      console.error("Failed to simulate guardian notifications on SOS:", err);
    }

    return docRef.id;
  },

  resolveSOS: async (id: string): Promise<void> => {
    const docRef = doc(db, "sosHistory", id);
    await updateDoc(docRef, { status: "resolved" });
  }
};

// ==========================================
// NOTIFICATIONS SERVICE
// ==========================================
export const notificationService = {
  getNotifications: async (userId: string): Promise<SafeNotification[]> => {
    const q = query(
      collection(db, "notifications"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    const list: SafeNotification[] = [];
    snap.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as SafeNotification);
    });
    return list;
  },

  addNotification: async (notif: Omit<SafeNotification, "id" | "createdAt">): Promise<string> => {
    const newNotif: Omit<SafeNotification, "id"> = {
      ...notif,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "notifications"), newNotif);
    return docRef.id;
  },

  markAsRead: async (id: string): Promise<void> => {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { read: true });
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    snap.forEach(async (d) => {
      await updateDoc(doc(db, "notifications", d.id), { read: true });
    });
  }
};
