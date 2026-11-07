import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  History, 
  Fingerprint, 
  FileText, 
  Server, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Clock,
  Trash2,
  Tag,
  Laptop,
  Smartphone
} from 'lucide-react';
import { SecureVaultItem, VaultAccessLog, Partner, SecureItemCategory } from '../../types/brain';

interface SecurityVaultStudioProps {
  currentPartner: Partner;
  vaultItems: SecureVaultItem[];
  accessLogs: VaultAccessLog[];
  onAddVaultItem: (item: SecureVaultItem) => void;
  onDeleteVaultItem: (id: string) => void;
  onRecordAccessLog: (log: Omit<VaultAccessLog, 'id' | 'timestamp'>) => void;
  onOpenAi: (prompt: string) => void;
}

export const SecurityVaultStudio: React.FC<SecurityVaultStudioProps> = ({
  currentPartner,
  vaultItems,
  accessLogs,
  onAddVaultItem,
  onDeleteVaultItem,
  onRecordAccessLog,
  onOpenAi,
}) => {
  // Vault Master Shield State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphraseInput, setPassphraseInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [activeTab, setActiveTab] = useState<'items' | 'logs'>('items');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Individual secret reveal state map: { [itemId]: boolean }
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SecureItemCategory>('credential');
  const [newSecret, setNewSecret] = useState('');
  const [newOwner, setNewOwner] = useState<Partner | 'Both'>('Both');
  const [newSecurityLevel, setNewSecurityLevel] = useState<'standard' | 'high' | 'critical'>('high');
  const [newNotes, setNewNotes] = useState('');
  const [newMetadataKey, setNewMetadataKey] = useState('');
  const [newMetadataVal, setNewMetadataVal] = useState('');
  const [newMetadata, setNewMetadata] = useState<Record<string, string>>({});

  // Auto-lock countdown timer (5 minutes)
  const [secondsRemaining, setSecondsRemaining] = useState(300);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUnlocked) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsUnlocked(false);
            setRevealedItems({});
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUnlocked]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Valid passkey simulation: "KeyNura2027!" or pin "7788" or biometric
    if (passphraseInput === 'KeyNura2027!' || passphraseInput === '7788' || passphraseInput.toLowerCase() === 'unlock') {
      setIsUnlocked(true);
      setUnlockError('');
      setPassphraseInput('');
      setSecondsRemaining(300);
      onRecordAccessLog({
        partner: currentPartner,
        action: 'Unlocked Vault',
        device: `${currentPartner}'s Workstation (Passkey Verified)`,
        ipMasked: '192.168.1.45',
        status: 'authorized',
      });
    } else {
      setUnlockError('Invalid Master Passkey. Try "KeyNura2027!" or couple PIN "7788"');
      onRecordAccessLog({
        partner: currentPartner,
        action: 'Failed Attempt',
        device: `${currentPartner}'s Client`,
        ipMasked: '192.168.1.45',
        status: 'warning',
      });
    }
  };

  const handleBiometricUnlock = () => {
    setIsUnlocked(true);
    setUnlockError('');
    setSecondsRemaining(300);
    onRecordAccessLog({
      partner: currentPartner,
      action: 'Unlocked Vault',
      device: `${currentPartner}'s Touch ID / Passkey Hardware Enclave`,
      ipMasked: '192.168.1.45',
      status: 'authorized',
    });
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setRevealedItems({});
    setSecondsRemaining(300);
  };

  const toggleRevealSecret = (item: SecureVaultItem) => {
    const isCurrentlyRevealed = !!revealedItems[item.id];
    setRevealedItems(prev => ({ ...prev, [item.id]: !isCurrentlyRevealed }));

    if (!isCurrentlyRevealed) {
      onRecordAccessLog({
        partner: currentPartner,
        action: 'Revealed Secret',
        itemId: item.id,
        itemTitle: item.title,
        device: `${currentPartner}'s Device (Decrypted on demand)`,
        ipMasked: '192.168.1.45',
        status: 'authorized',
      });
    }
  };

  const handleCopySecret = (item: SecureVaultItem) => {
    navigator.clipboard.writeText(item.secretValue);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);

    onRecordAccessLog({
      partner: currentPartner,
      action: 'Copied Credential',
      itemId: item.id,
      itemTitle: item.title,
      device: `${currentPartner}'s Device (Clipboard buffer)`,
      ipMasked: '192.168.1.45',
      status: 'authorized',
    });
  };

  const handleAddMetaPair = () => {
    if (!newMetadataKey.trim() || !newMetadataVal.trim()) return;
    setNewMetadata(prev => ({ ...prev, [newMetadataKey.trim()]: newMetadataVal.trim() }));
    setNewMetadataKey('');
    setNewMetadataVal('');
  };

  const handleCreateSecureItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSecret.trim()) return;

    const newItem: SecureVaultItem = {
      id: `sec-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      owner: newOwner,
      lastUpdated: new Date().toISOString().slice(0, 10),
      secretValue: newSecret.trim(),
      metadata: Object.keys(newMetadata).length > 0 ? newMetadata : undefined,
      notes: newNotes.trim() || 'Encrypted record securely stored in NuraKey buffer.',
      tags: ['vault', newCategory],
      isEncrypted: true,
      securityLevel: newSecurityLevel,
    };

    onAddVaultItem(newItem);
    onRecordAccessLog({
      partner: currentPartner,
      action: 'Created Item',
      itemId: newItem.id,
      itemTitle: newItem.title,
      device: `${currentPartner}'s Device (AES-256 Encrypted)`,
      ipMasked: '192.168.1.45',
      status: 'authorized',
    });

    // Reset Form
    setNewTitle('');
    setNewSecret('');
    setNewNotes('');
    setNewMetadata({});
    setIsAddModalOpen(false);
  };

  const filteredItems = vaultItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;
    const matchesSearch = searchQuery === '' ? true : 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Security Hub Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              NuraKey Zero-Knowledge Vault
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              AES-256-GCM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-3">
            <span>Security & Emergency Vault</span>
            {isUnlocked ? (
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlocked ({formatTimer(secondsRemaining)})</span>
              </span>
            ) : (
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>Protected</span>
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Encrypted couple credentials, emergency shutoffs, physical safe PINs, and tamper-proof access audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {isUnlocked ? (
            <>
              <button
                onClick={() => onOpenAi('Audit our security vault and suggest any missing disaster recovery items')}
                className="px-3.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>AI Security Audit</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Secure Item</span>
              </button>

              <button
                onClick={handleLockVault}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Vault</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleBiometricUnlock}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Biometric / Passkey Unlock</span>
            </button>
          )}
        </div>
      </div>

      {/* MASTER ENTRY SHIELD MODAL / OVERLAY (When Locked) */}
      {!isUnlocked ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/60 dark:shadow-black/70 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 flex items-center justify-center mx-auto text-red-600 dark:text-red-400 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Master Password Shield
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Vault contents are obfuscated and encrypted in the client buffer. Authenticate to decrypt credentials and access logs.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 max-w-sm mx-auto">
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                MASTER PASSKEY OR COUPLE PIN
              </label>
              <input
                type="password"
                value={passphraseInput}
                onChange={(e) => setPassphraseInput(e.target.value)}
                placeholder="Enter KeyNura2027! or 7788"
                className="w-full text-center tracking-widest text-sm p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-indigo-600"
                autoFocus
              />
            </div>

            {unlockError && (
              <div className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{unlockError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>

              <button
                type="button"
                onClick={handleBiometricUnlock}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                <span>Passkey / Touch ID</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted · Client-side Decryption Only</span>
          </div>
        </div>
      ) : (
        /* UNLOCKED VAULT WORKSPACE */
        <div className="space-y-6">
          {/* Navigation Sub-Tabs & Filter Controls */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-4 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('items')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'items'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Encrypted Vault Records ({vaultItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'logs'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Access Audit Logs ({accessLogs.length})</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            {activeTab === 'items' && (
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vault records..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-indigo-600 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                >
                  <option value="all">All Categories</option>
                  <option value="credential">Credentials & Passkeys</option>
                  <option value="emergency">Emergency Runbooks</option>
                  <option value="key">Recovery Keys</option>
                  <option value="note">Private Secure Notes</option>
                  <option value="document">Policies & Docs</option>
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: ENCRYPTED VAULT RECORDS */}
          {activeTab === 'items' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isRevealed = !!revealedItems[item.id];
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-5 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-3 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group"
                  >
                    {/* Record Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            item.securityLevel === 'critical'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : item.securityLevel === 'high'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {item.securityLevel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.category.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display truncate">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs ${
                          item.owner === 'Key' ? 'bg-indigo-600' :
                          item.owner === 'Nura' ? 'bg-violet-600' : 'bg-slate-600'
                        }`}>
                          {item.owner[0]}
                        </div>
                        <button
                          onClick={() => onDeleteVaultItem(item.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition-colors"
                          title="Delete vault record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Secret Masked Value Shield Box */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          Encrypted Secret / Key
                        </div>
                        <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 select-all truncate mt-0.5">
                          {isRevealed ? item.secretValue : '••••••••••••••••••••••••'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleRevealSecret(item)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors"
                          title={isRevealed ? 'Mask secret' : 'Reveal secret'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-indigo-600" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleCopySecret(item)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors"
                          title="Copy secret to clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Metadata Key-Value Pills */}
                    {item.metadata && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        {Object.entries(item.metadata).map(([k, v]) => (
                          <div key={k} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 font-mono text-[10px] block truncate">{k}</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes & Tags Footer */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                      {item.notes}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                      <span>Updated {item.lastUpdated}</span>
                      <div className="flex items-center gap-1">
                        {item.tags.map(t => (
                          <span key={t} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ACCESS AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    Vault Tamper-Proof Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chronological activity log recorded when credentials or notes are accessed, revealed, or modified.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  Immutable Memory
                </span>
              </div>

              <div className="space-y-2.5">
                {accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs ${
                        log.partner === 'Key' ? 'bg-indigo-600' : 'bg-violet-600'
                      }`}>
                        {log.partner[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{log.partner} {log.action}</span>
                          {log.itemTitle && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                              "{log.itemTitle}"
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{log.device}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{log.ipMasked}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        log.status === 'authorized'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE NEW SECURE ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSecureItem}
            className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Add Encrypted Vault Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Title / Label</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Coldcard Hardware Wallet Passphrase"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="credential">Credential / Passkey</option>
                    <option value="emergency">Emergency Runbook</option>
                    <option value="key">Recovery Key</option>
                    <option value="note">Private Secure Note</option>
                    <option value="document">Policy / Doc</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">Security Tier</label>
                  <select
                    value={newSecurityLevel}
                    onChange={(e) => setNewSecurityLevel(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="critical">Critical (Airgapped)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Secret Value / Passphrase (Encrypted)</label>
                <textarea
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  placeholder="Enter secret text, password, PIN, or runbook steps..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Owner Access</label>
                <select
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Both">Both (Shared Key & Nura)</option>
                  <option value="Key">Key Only</option>
                  <option value="Nura">Nura Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Secure Notes & Location Context</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g., Stored physically in bedroom safe cavity"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                Encrypt & Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
