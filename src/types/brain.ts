export type Partner = 'Key' | 'Nura';

export type DocumentType = 
  | 'overview' 
  | 'itinerary' 
  | 'kanban' 
  | 'budget' 
  | 'checklist' 
  | 'decision_log' 
  | 'tech_diagram' 
  | 'journal' 
  | 'general_notes';

export interface Frontmatter {
  type: string;
  status?: string;
  owners: Partner[];
  created: string;
  updated: string;
  tags: string[];
  budget?: number;
  location?: string;
  category?: string;
  summary?: string;
}

export interface BrainDocument {
  id: string;
  domainId: string;
  path: string;
  title: string;
  docType: DocumentType;
  frontmatter: Frontmatter;
  content: string;
  structuredData?: any;
}

export interface LifeDomain {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badgeColor: string;
  fileCount: number;
}

export type TaskStage = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';

export interface LifeTask {
  id: string;
  title: string;
  completed: boolean;
  stage: TaskStage;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: 'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health' | 'Admin';
  owner: Partner | 'Both';
  colorTag: string;
}

export interface ProjectTimelineMilestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  owner: Partner | 'Both';
}

export interface ProjectTimeline {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'On Track' | 'In Progress' | 'Completed' | 'Upcoming';
  color: string;
  milestones: ProjectTimelineMilestone[];
}

export interface InteractiveMapPin {
  id: string;
  name: string;
  region: string;
  coords: { x: number; y: number }; // percentage on SVG map
  day: number;
  category: 'sight' | 'restaurant' | 'hotel' | 'transit';
  description: string;
  mustTry?: string;
  booked: boolean;
}

export interface LiveDocComment {
  id: string;
  author: Partner;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  category: 'travel' | 'routine' | 'date' | 'appointment' | 'tech';
  attendees: Partner[];
  syncedWithProton: boolean;
}

export interface EmailItem {
  id: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  unread: boolean;
  folder: 'inbox' | 'sent' | 'drafts';
  tag: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Tech & AI' | 'Travel & Culture' | 'World' | 'Privacy & Security';
  summary: string;
  url: string;
  saved?: boolean;
}

export interface ScheduledAgent {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: 'Active' | 'Paused';
  lastRun: string;
  nextRun: string;
  actionType: 'flight_monitor' | 'life_admin' | 'tech_cve' | 'routine_prompt' | 'custom';
  prompt: string;
  lastResult?: string;
}

export interface ProposalOption {
  id: string;
  title: string;
  description: string;
  vibe: string;
  estimatedCost: string;
  location?: string;
  highlights: string[];
  bookingUrl?: string;
  votes: Partner[];
}

export interface PartnerProposal {
  id: string;
  title: string;
  category: 'date' | 'travel' | 'purchase' | 'project';
  createdBy: Partner;
  targetPartner: Partner;
  status: 'pending' | 'accepted' | 'tweaked' | 'declined';
  promptUsed: string;
  options: ProposalOption[];
  confirmedOptionId?: string;
  partnerNote?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: Partner | 'AI';
  text: string;
  timestamp: string;
  type: 'text' | 'voice' | 'proposal_card' | 'system';
  audioDuration?: number;
  proposalId?: string;
  reactions?: Record<string, Partner[]>;
}

export interface WhiteboardNode {
  id: string;
  type: 'concept' | 'sticky' | 'trip_stop' | 'tech_server';
  x: number;
  y: number;
  title: string;
  description: string;
  color: string;
  author: Partner;
  tags?: string[];
}

export interface WhiteboardConnection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

export type SecureItemCategory = 'credential' | 'note' | 'emergency' | 'document' | 'key';

export interface SecureVaultItem {
  id: string;
  title: string;
  category: SecureItemCategory;
  owner: Partner | 'Both';
  lastUpdated: string;
  secretValue: string;
  metadata?: Record<string, string>;
  notes: string;
  tags: string[];
  isEncrypted: boolean;
  securityLevel: 'standard' | 'high' | 'critical';
  revealed?: boolean;
}

export interface VaultAccessLog {
  id: string;
  partner: Partner;
  action: 'Unlocked Vault' | 'Revealed Secret' | 'Copied Credential' | 'Created Item' | 'Updated Note' | 'Failed Attempt';
  itemId?: string;
  itemTitle?: string;
  timestamp: string;
  device: string;
  ipMasked: string;
  status: 'authorized' | 'warning';
}

export interface DailyIntention {
  id: string;
  date: string;
  partner: Partner;
  intention: string;
  mood: 'grounded' | 'inspired' | 'calm' | 'grateful' | 'focused' | 'recharging';
  acknowledgedByPartner?: boolean;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  author: Partner;
  text: string;
  tag: 'Relationship' | 'Nature' | 'Work' | 'Health' | 'Small Joys' | 'Home';
  prompt?: string;
  likes: Partner[];
}

export interface SpiritualRitual {
  id: string;
  title: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  streak: number;
  completedToday: { Key: boolean; Nura: boolean };
  durationMinutes: number;
  icon: string;
}

export type CloudProvider = 'onedrive' | 'googledrive' | 'proton';

export interface CloudFileItem {
  id: string;
  name: string;
  provider: CloudProvider;
  folder: string;
  size: string;
  modified: string;
  modifiedBy: Partner | 'Both';
  type: 'folder' | 'document' | 'spreadsheet' | 'image' | 'archive' | 'pdf';
  linkedDocId?: string;
  linkedTaskId?: string;
  syncStatus: 'synced' | 'syncing' | 'offline_only';
  sharingAccess: 'Key & Nura (Shared)' | 'Key Only' | 'Nura Only';
  url?: string;
  starred?: boolean;
}

export interface CollaborationRule {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'in_review' | 'planned';
  category: 'storage' | 'realtime' | 'security' | 'permissions';
  partnerVotes: Partner[];
  badge: string;
}

export type MindMapFilter = 'all' | 'domains' | 'documents' | 'tasks' | 'timelines' | 'vault' | 'agents' | 'spiritual';

export interface MindMapConnection {
  fromId: string;
  toId: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'glow';
}

