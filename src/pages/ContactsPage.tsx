import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { contactService, notificationService } from "../services/firestore";
import { EmergencyContact, SafeNotification } from "../types";
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Heart, 
  Trash2, 
  Edit3, 
  X, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ContactsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [dispatchLogs, setDispatchLogs] = useState<SafeNotification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Family");
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await contactService.getContacts(currentUser.uid);
      setContacts(data);
      const allNotifs = await notificationService.getNotifications(currentUser.uid);
      // Filter for simulated guardian SMS dispatches
      const smsLogs = allNotifs.filter(n => 
        n.title.toLowerCase().includes("sms sent") || 
        n.title.toLowerCase().includes("dispatched") ||
        n.message.toLowerCase().includes("sms") ||
        n.message.toLowerCase().includes("guardian")
      );
      setDispatchLogs(smsLogs);
    } catch (err) {
      console.error("Error fetching contacts and logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentUser]);

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setName("");
    setPhone("");
    setEmail("");
    setRelationship("Family");
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
    setRelationship(contact.relationship);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this emergency contact?")) return;
    try {
      await contactService.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name || !phone) {
      setError("Name and Phone Number are required.");
      return;
    }

    setError(null);
    try {
      if (editingContact) {
        // Edit existing
        await contactService.updateContact(editingContact.id, {
          name,
          phone,
          email,
          relationship
        });
      } else {
        // Add new
        await contactService.addContact({
          userId: currentUser.uid,
          name,
          phone,
          email,
          relationship
        });
        
        // Notify user
        await notificationService.addNotification({
          userId: currentUser.uid,
          title: "New Contact Added",
          message: `${name} has been successfully added to your Emergency Contacts list.`,
          type: "alert",
          read: false
        });

        // Simulating invitation SMS to guardian
        await notificationService.addNotification({
          userId: currentUser.uid,
          title: `Invitation SMS Sent to: ${name}`,
          message: `Simulated SMS invitation dispatched to ${phone}: "Hi ${name}, you have been added as an Emergency Guardian on SafeHer. You will receive real-time alerts in case of emergency."`,
          type: "alert",
          read: false
        });
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (err: any) {
      setError(err.message || "Failed to save contact.");
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="contacts-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Emergency Contacts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage trusted guardians who will be alerted instantly in case of an SOS.
          </p>
        </div>

        <button
          id="add-contact-btn"
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Guardian
        </button>
      </div>

      {/* Info Card Alert */}
      <div className="p-4 bg-pink-50/50 dark:bg-pink-950/10 border border-pink-100/30 dark:border-pink-900/30 rounded-2xl flex items-start gap-3.5 text-sm">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-slate-600 dark:text-slate-400">
          <strong>Important:</strong> Please ensure that these phone numbers are correct and that your contacts are aware that you have added them as a guardian.
        </p>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="contact-search-input"
          type="text"
          placeholder="Search by name or relationship..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-card-dark border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </div>

      {/* Contacts List Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading guardians...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/20 dark:border-slate-800 p-8">
          <HelpCircle className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">No Contacts Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-1">
            Create your emergency circle now so guardians are informed during an active SOS trigger.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-accent rounded-full pink-glow cursor-pointer"
          >
            Create First Guardian
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <motion.div
              layout
              key={contact.id}
              className="p-5 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-xs space-y-4 relative overflow-hidden group"
            >
              {/* Corner badge for Relationship */}
              <div className="absolute top-4 right-4 text-[10px] font-bold text-accent bg-pink-100/50 dark:bg-pink-950/40 dark:text-pink-400 px-3 py-1 rounded-full uppercase tracking-wider">
                {contact.relationship}
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-pink-50 dark:bg-pink-950/20 text-accent rounded-2xl">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-extrabold text-slate-950 dark:text-white truncate">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Guardian Contact</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-pink-50/50 dark:border-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-pink-400" />
                  <span className="font-mono">{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-pink-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  id={`edit-contact-${contact.id}`}
                  onClick={() => handleOpenEditModal(contact)}
                  className="p-2 bg-slate-50 hover:bg-pink-50 dark:bg-slate-900/40 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-accent transition-all cursor-pointer"
                  title="Edit Guardian"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  id={`delete-contact-${contact.id}`}
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 bg-slate-50 hover:bg-red-50 dark:bg-slate-900/40 dark:hover:bg-red-950/20 rounded-xl text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                  title="Delete Guardian"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Simulated SMS Notification Dispatch Logs */}
      <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-accent animate-pulse" /> Guardian SMS Dispatch Logs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of simulated SMS and email safety alerts sent to your guardians.
          </p>
        </div>

        {dispatchLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-pink-100/20 dark:border-slate-800">
            No SMS dispatches have been triggered yet.
            <p className="text-xs text-slate-400/80 mt-1">
              Add a contact, start a journey, or trigger an SOS to simulate guardian alerts!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {dispatchLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-pink-50/20 dark:border-slate-850 flex items-start gap-3"
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  log.title.includes("SOS") 
                    ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400" 
                    : log.title.includes("Arrival")
                    ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                    : "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.title}</h4>
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span> Delivered
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-950/50 p-2.5 rounded-xl border border-pink-100/10 dark:border-slate-800/40 select-all">
                    {log.message}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date(log.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div id="contact-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              id="contact-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  {editingContact ? "Edit Guardian" : "Add Emergency Guardian"}
                </h2>
                <button
                  id="close-contact-modal-btn"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    placeholder="E.g., Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone-input"
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Email Address (Optional)
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Relationship
                  </label>
                  <select
                    id="contact-relation-input"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Partner">Partner</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    id="contact-save-btn"
                    type="submit"
                    className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer"
                  >
                    Save Guardian
                  </button>
                  <button
                    id="contact-cancel-btn"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
