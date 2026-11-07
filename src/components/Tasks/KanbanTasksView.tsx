import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  Tag,
  Filter,
  Layers,
  ArrowRight,
  ListTodo,
  Grid,
  Users,
  Search,
  GripVertical,
  Trash2,
  Edit2,
  Clock,
  ArrowUpDown,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Circle,
  Send,
  MoreVertical,
  X
} from 'lucide-react';
import { LifeTask, TaskStage, Partner } from '../../types/brain';

export type TaskViewMode = 'kanban' | 'list' | 'matrix' | 'workload';
export type TaskGroupBy = 'stage' | 'category' | 'owner' | 'none';
export type TaskSortBy = 'priority' | 'dueDate' | 'title' | 'stage';

interface KanbanTasksViewProps {
  currentPartner: Partner;
  tasks: LifeTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, category: 'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health' | 'Admin', owner: Partner | 'Both', priority: 'high' | 'medium' | 'low', stage?: TaskStage) => void;
  onMoveTaskStage: (taskId: string, newStage: TaskStage) => void;
  onOpenAi: (prompt: string) => void;
  onUpdateTask?: (task: LifeTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

const STAGES: { stage: TaskStage; label: string; iconColor: string; bgAccent: string }[] = [
  { stage: 'backlog', label: 'Backlog', iconColor: 'bg-slate-400', bgAccent: 'bg-slate-50/70 dark:bg-slate-900/40' },
  { stage: 'todo', label: 'To Do', iconColor: 'bg-blue-500', bgAccent: 'bg-blue-50/40 dark:bg-blue-950/20' },
  { stage: 'in_progress', label: 'In Progress', iconColor: 'bg-amber-500', bgAccent: 'bg-amber-50/40 dark:bg-amber-950/20' },
  { stage: 'review', label: 'Review / QA', iconColor: 'bg-violet-500', bgAccent: 'bg-violet-50/40 dark:bg-violet-950/20' },
  { stage: 'completed', label: 'Completed', iconColor: 'bg-emerald-500', bgAccent: 'bg-emerald-50/40 dark:bg-emerald-950/20' },
];

export const KanbanTasksView: React.FC<KanbanTasksViewProps> = ({
  currentPartner,
  tasks,
  onToggleTask,
  onAddTask,
  onMoveTaskStage,
  onOpenAi,
  onUpdateTask,
  onDeleteTask,
}) => {
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState<TaskViewMode>('kanban');
  const [mobileStageFilter, setMobileStageFilter] = useState<TaskStage | 'all'>('all');
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<Partner | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  
  // List View Preferences
  const [groupBy, setGroupBy] = useState<TaskGroupBy>('stage');
  const [sortBy, setSortBy] = useState<TaskSortBy>('priority');
  const [quickAddInput, setQuickAddInput] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState<'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health' | 'Admin'>('Home');

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<TaskStage | null>(null);
  const [dragOverQuadrant, setDragOverQuadrant] = useState<string | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<LifeTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health' | 'Admin'>('Tech');
  const [taskOwner, setTaskOwner] = useState<Partner | 'Both'>('Both');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskStage, setTaskStage] = useState<TaskStage>('todo');
  const [taskDueDate, setTaskDueDate] = useState('This week');

  // AI Breakdown Assistant Modal
  const [isAiBreakdownOpen, setIsAiBreakdownOpen] = useState(false);
  const [breakdownGoal, setBreakdownGoal] = useState('');

  // Category Styling Helpers
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tech': return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Travel': return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Finances': return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Home': return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Health': return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      default: return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low', interactive = false, taskId?: string) => {
    const nextPriority: Record<'high' | 'medium' | 'low', 'high' | 'medium' | 'low'> = {
      high: 'low',
      medium: 'high',
      low: 'medium'
    };

    const handleClick = (e: React.MouseEvent) => {
      if (!interactive || !taskId || !onUpdateTask) return;
      e.stopPropagation();
      const current = tasks.find(t => t.id === taskId);
      if (current) {
        onUpdateTask({ ...current, priority: nextPriority[current.priority] });
      }
    };

    switch (priority) {
      case 'high':
        return (
          <span 
            onClick={handleClick}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1 shrink-0 ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}`}
            title={interactive ? 'Click to cycle priority' : undefined}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            High
          </span>
        );
      case 'medium':
        return (
          <span 
            onClick={handleClick}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0 ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}`}
            title={interactive ? 'Click to cycle priority' : undefined}
          >
            Med
          </span>
        );
      default:
        return (
          <span 
            onClick={handleClick}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}`}
            title={interactive ? 'Click to cycle priority' : undefined}
          >
            Low
          </span>
        );
    }
  };

  // Stage Navigation
  const getNextStage = (stage: TaskStage): TaskStage | null => {
    const stages: TaskStage[] = ['backlog', 'todo', 'in_progress', 'review', 'completed'];
    const idx = stages.indexOf(stage);
    return idx < stages.length - 1 ? stages[idx + 1] : null;
  };

  const getPrevStage = (stage: TaskStage): TaskStage | null => {
    const stages: TaskStage[] = ['backlog', 'todo', 'in_progress', 'review', 'completed'];
    const idx = stages.indexOf(stage);
    return idx > 0 ? stages[idx - 1] : null;
  };

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverStage(null);
    setDragOverQuadrant(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, stage: TaskStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, targetStage: TaskStage) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onMoveTaskStage(taskId, targetStage);
    }
    setDragOverStage(null);
    setDraggedTaskId(null);
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = searchQuery === '' || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPartner = partnerFilter === 'All' ? true : t.owner === partnerFilter || t.owner === 'Both';
      const matchesCategory = categoryFilter === 'All' ? true : t.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
      return matchesSearch && matchesPartner && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, partnerFilter, categoryFilter, priorityFilter]);

  // Sorted Tasks
  const sortedTasks = useMemo(() => {
    const copy = [...filteredTasks];
    copy.sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'dueDate') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'stage') {
        const stages: TaskStage[] = ['backlog', 'todo', 'in_progress', 'review', 'completed'];
        return stages.indexOf(a.stage) - stages.indexOf(b.stage);
      }
      return 0;
    });
    return copy;
  }, [filteredTasks, sortBy]);

  // Quick Inline Add Task (in List view)
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddInput.trim()) return;
    onAddTask(quickAddInput.trim(), quickAddCategory, 'Both', 'medium', 'todo');
    setQuickAddInput('');
  };

  // Full Modal Submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title: taskTitle.trim(),
        category: taskCategory,
        owner: taskOwner,
        priority: taskPriority,
        stage: taskStage,
        completed: taskStage === 'completed',
        dueDate: taskDueDate.trim() || 'This week',
      });
    } else {
      onAddTask(taskTitle.trim(), taskCategory, taskOwner, taskPriority, taskStage);
    }

    closeModal();
  };

  const openAddModal = (defaultStage: TaskStage = 'todo') => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskCategory('Tech');
    setTaskOwner('Both');
    setTaskPriority('medium');
    setTaskStage(defaultStage);
    setTaskDueDate('This week');
    setIsModalOpen(true);
  };

  const openEditModal = (task: LifeTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskCategory(task.category);
    setTaskOwner(task.owner);
    setTaskPriority(task.priority);
    setTaskStage(task.stage);
    setTaskDueDate(task.dueDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // AI Breakdown Submission
  const handleAiBreakdownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakdownGoal.trim()) return;
    
    // Create 3-4 structured subtasks
    const goal = breakdownGoal.trim();
    onAddTask(`Research specs & requirements for: ${goal}`, 'Tech', 'Key', 'high', 'todo');
    onAddTask(`Review budget & partner alignment for: ${goal}`, 'Finances', 'Both', 'medium', 'todo');
    onAddTask(`Draft execution checklist & timeline for: ${goal}`, 'Home', 'Nura', 'medium', 'backlog');

    setBreakdownGoal('');
    setIsAiBreakdownOpen(false);
  };

  // Summary Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.stage === 'completed' || t.completed).length;
  const inProgressTasks = tasks.filter(t => t.stage === 'in_progress').length;
  const completionPercentage = Math.round((completedTasks / (totalTasks || 1)) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto flex flex-col w-full pb-20 md:pb-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Executive Task Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Drag & Drop Enabled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex flex-wrap items-center gap-3">
            <span>Life Task Operations</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {completedTasks}/{totalTasks} Done ({completionPercentage}%)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Multi-view task operations with drag-and-drop, partner assignments, priority matrix, and mobile ergonomics.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* 4 View Modes Segmented Control */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Board View (Drag & Drop)"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Task List & Checklist View"
            >
              <ListTodo className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Eisenhower Priority Matrix (Urgent vs Important)"
            >
              <Grid className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Matrix</span>
            </button>

            <button
              onClick={() => setViewMode('workload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'workload'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Partner Workload Balance"
            >
              <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="hidden sm:inline">Workload</span>
            </button>
          </div>

          {/* AI Goal Breakdown Assistant */}
          <button
            onClick={() => setIsAiBreakdownOpen(true)}
            className="px-3 py-2 rounded-2xl bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs min-h-[44px]"
            title="Break complex goals into subtasks"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="hidden sm:inline">AI Decompose</span>
          </button>

          {/* Add Task Primary CTA */}
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-indigo-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips & Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Owner Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['All', 'Key', 'Nura'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPartnerFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  partnerFilter === p
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Travel">Travel</option>
            <option value="Finances">Finances</option>
            <option value="Home">Home</option>
            <option value="Health">Health</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* List View Controls (when in list mode) */}
          {viewMode === 'list' && (
            <>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block mx-1" />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-mono">Group:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as TaskGroupBy)}
                  className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden font-semibold"
                >
                  <option value="stage">By Stage</option>
                  <option value="category">By Category</option>
                  <option value="owner">By Owner</option>
                  <option value="none">Flat List</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-mono">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as TaskSortBy)}
                  className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden font-semibold"
                >
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Alphabetical</option>
                  <option value="stage">Stage</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: KANBAN BOARD VIEW (DRAG & DROP + MOBILE OPTIMIZED) */}
      {/* ========================================================= */}
      {viewMode === 'kanban' && (
        <div className="space-y-4">
          {/* Mobile-Only Stage Filter Pills for Fast Phone Switching */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setMobileStageFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap min-h-[36px] transition-all ${
                mobileStageFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Columns ({filteredTasks.length})
            </button>
            {STAGES.map(col => {
              const count = filteredTasks.filter(t => t.stage === col.stage).length;
              return (
                <button
                  key={col.stage}
                  onClick={() => setMobileStageFilter(col.stage)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap min-h-[36px] transition-all flex items-center gap-1.5 ${
                    mobileStageFilter === col.stage
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{col.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* 5 Columns Grid (Responsive on desktop, carousel or filtered on phone) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {STAGES.filter(col => mobileStageFilter === 'all' || mobileStageFilter === col.stage).map((col) => {
              const colTasks = filteredTasks.filter(t => (t.stage || (t.completed ? 'completed' : 'todo')) === col.stage);
              const isDropActive = dragOverStage === col.stage;

              return (
                <div
                  key={col.stage}
                  onDragOver={(e) => handleDragOverColumn(e, col.stage)}
                  onDragLeave={() => setDragOverStage(null)}
                  onDrop={(e) => handleDropOnColumn(e, col.stage)}
                  className={`flex flex-col rounded-3xl border-2 transition-all p-3.5 min-h-[480px] shadow-sm ${col.bgAccent} ${
                    isDropActive 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.01]' 
                      : 'border-slate-300 dark:border-slate-800 shadow-slate-200/40 dark:shadow-black/40'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.iconColor}`} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                        {col.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {colTasks.length}
                      </span>
                      <button
                        onClick={() => openAddModal(col.stage)}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        title={`Add task to ${col.label}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks Container */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                    {colTasks.length === 0 ? (
                      <div className={`text-center py-12 px-3 text-slate-400 dark:text-slate-500 text-xs italic border-2 border-dashed rounded-2xl transition-all ${
                        isDropActive 
                          ? 'border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold' 
                          : 'border-slate-300/70 dark:border-slate-800'
                      }`}>
                        {isDropActive ? 'Drop card here' : `No tasks in ${col.label.toLowerCase()}`}
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const isBeingDragged = draggedTaskId === task.id;
                        const prevStage = getPrevStage(col.stage);
                        const nextStage = getNextStage(col.stage);

                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-3.5 shadow-sm shadow-slate-200/70 dark:shadow-black/60 transition-all group cursor-grab active:cursor-grabbing ${
                              isBeingDragged 
                                ? 'opacity-40 scale-95 border-dashed border-indigo-500' 
                                : 'border-slate-250 dark:border-slate-750/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'
                            }`}
                          >
                            {/* Card Header: Category + Priority + Grip */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${getCategoryColor(task.category)}`}>
                                {task.category}
                              </span>

                              <div className="flex items-center gap-1">
                                {getPriorityBadge(task.priority, true, task.id)}
                                <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>

                            {/* Task Title */}
                            <p className={`text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-3 ${
                              task.stage === 'completed' || task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}>
                              {task.title}
                            </p>

                            {/* Card Footer: Owner + Due Date + 1-Tap Mobile Stage Arrows */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs ${
                                  task.owner === 'Key' ? 'bg-indigo-600' :
                                  task.owner === 'Nura' ? 'bg-violet-600' : 'bg-slate-600'
                                }`}>
                                  {task.owner[0]}
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{task.owner}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Fast Touch Stage Chevrons (Crucial for mobile phones!) */}
                                {prevStage && (
                                  <button
                                    onClick={() => onMoveTaskStage(task.id, prevStage)}
                                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                    title={`Move back to ${prevStage}`}
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => openEditModal(task)}
                                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  title="Edit Task"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                {nextStage && (
                                  <button
                                    onClick={() => onMoveTaskStage(task.id, nextStage)}
                                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    title={`Advance to ${nextStage}`}
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: NORMAL TASK LIST & HIGH-DENSITY CHECKLIST VIEW */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Quick Inline Add Task Bar */}
          <form onSubmit={handleQuickAdd} className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />
            <input
              type="text"
              value={quickAddInput}
              onChange={(e) => setQuickAddInput(e.target.value)}
              placeholder="Quick add new task... press Enter to save"
              className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
            />
            <select
              value={quickAddCategory}
              onChange={(e) => setQuickAddCategory(e.target.value as any)}
              className="text-xs p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none hidden sm:block"
            >
              <option value="Home">Home</option>
              <option value="Tech">Tech</option>
              <option value="Travel">Travel</option>
              <option value="Finances">Finances</option>
              <option value="Health">Health</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={!quickAddInput.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shrink-0 shadow-2xs"
            >
              Add
            </button>
          </form>

          {/* Grouped or Flat List Container */}
          <div className="space-y-6">
            {groupBy === 'none' ? (
              /* Flat List */
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 shadow-md overflow-hidden">
                {sortedTasks.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs italic">
                    No matching tasks found.
                  </div>
                ) : (
                  sortedTasks.map((task) => (
                    <TaskListItemRow
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onMoveStage={onMoveTaskStage}
                      onEdit={openEditModal}
                      onDelete={onDeleteTask}
                      getCategoryColor={getCategoryColor}
                      getPriorityBadge={getPriorityBadge}
                    />
                  ))
                )}
              </div>
            ) : (
              /* Grouped List */
              (groupBy === 'stage' ? STAGES.map(s => ({ key: s.stage, label: s.label, color: s.iconColor })) :
               groupBy === 'category' ? ['Tech', 'Travel', 'Finances', 'Home', 'Health', 'Admin'].map(c => ({ key: c, label: c, color: 'bg-indigo-500' })) :
               ['Key', 'Nura', 'Both'].map(o => ({ key: o, label: `${o}'s Tasks`, color: 'bg-violet-500' }))
              ).map(group => {
                const groupTasks = sortedTasks.filter(t => {
                  if (groupBy === 'stage') return t.stage === group.key;
                  if (groupBy === 'category') return t.category === group.key;
                  return t.owner === group.key;
                });

                if (groupTasks.length === 0) return null;

                return (
                  <div key={group.key} className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${group.color}`} />
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                          {group.label}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        {groupTasks.length} tasks
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
                      {groupTasks.map((task) => (
                        <TaskListItemRow
                          key={task.id}
                          task={task}
                          onToggle={onToggleTask}
                          onMoveStage={onMoveTaskStage}
                          onEdit={openEditModal}
                          onDelete={onDeleteTask}
                          getCategoryColor={getCategoryColor}
                          getPriorityBadge={getPriorityBadge}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: EISENHOWER PRIORITY MATRIX (URGENT VS IMPORTANT) */}
      {/* ========================================================= */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl text-xs text-indigo-950 dark:text-indigo-200 flex items-center justify-between">
            <span className="font-semibold">
              Eisenhower Matrix: Drag cards between quadrants to auto-adjust urgency and priority.
            </span>
            <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 font-bold">
              4 Focus Zones
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Q1: Do First (Urgent & Important) */}
            <MatrixQuadrantCard
              title="Q1: Urgent & Important (Do First)"
              subtitle="High priority tasks in progress or due this week"
              badgeColor="bg-rose-500"
              borderColor="border-rose-300 dark:border-rose-900/70"
              tasks={filteredTasks.filter(t => t.priority === 'high' && (t.stage === 'in_progress' || t.stage === 'todo'))}
              onDragOver={(e) => { e.preventDefault(); setDragOverQuadrant('q1'); }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
                const task = tasks.find(t => t.id === id);
                if (task && onUpdateTask) {
                  onUpdateTask({ ...task, priority: 'high', stage: 'todo' });
                }
                setDragOverQuadrant(null);
              }}
              isDragOver={dragOverQuadrant === 'q1'}
              onToggle={onToggleTask}
              onEdit={openEditModal}
            />

            {/* Q2: Schedule (Important, Not Urgent) */}
            <MatrixQuadrantCard
              title="Q2: Important, Not Urgent (Schedule)"
              subtitle="High & medium priority strategic goals in Backlog"
              badgeColor="bg-indigo-500"
              borderColor="border-indigo-300 dark:border-indigo-900/70"
              tasks={filteredTasks.filter(t => (t.priority === 'high' || t.priority === 'medium') && t.stage === 'backlog')}
              onDragOver={(e) => { e.preventDefault(); setDragOverQuadrant('q2'); }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
                const task = tasks.find(t => t.id === id);
                if (task && onUpdateTask) {
                  onUpdateTask({ ...task, priority: 'high', stage: 'backlog' });
                }
                setDragOverQuadrant(null);
              }}
              isDragOver={dragOverQuadrant === 'q2'}
              onToggle={onToggleTask}
              onEdit={openEditModal}
            />

            {/* Q3: Delegate / Shared (Urgent, Not Important) */}
            <MatrixQuadrantCard
              title="Q3: Urgent, Less Critical (Routine)"
              subtitle="Medium priority tasks, maintenance, and administrative routines"
              badgeColor="bg-amber-500"
              borderColor="border-amber-300 dark:border-amber-900/70"
              tasks={filteredTasks.filter(t => t.priority === 'medium' && t.stage !== 'backlog' && t.stage !== 'completed')}
              onDragOver={(e) => { e.preventDefault(); setDragOverQuadrant('q3'); }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
                const task = tasks.find(t => t.id === id);
                if (task && onUpdateTask) {
                  onUpdateTask({ ...task, priority: 'medium', stage: 'todo' });
                }
                setDragOverQuadrant(null);
              }}
              isDragOver={dragOverQuadrant === 'q3'}
              onToggle={onToggleTask}
              onEdit={openEditModal}
            />

            {/* Q4: Low Priority / Someday */}
            <MatrixQuadrantCard
              title="Q4: Low Priority / Backburner"
              subtitle="Nice-to-have ideas and completed tasks"
              badgeColor="bg-emerald-500"
              borderColor="border-emerald-300 dark:border-emerald-900/70"
              tasks={filteredTasks.filter(t => t.priority === 'low' || t.stage === 'completed')}
              onDragOver={(e) => { e.preventDefault(); setDragOverQuadrant('q4'); }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
                const task = tasks.find(t => t.id === id);
                if (task && onUpdateTask) {
                  onUpdateTask({ ...task, priority: 'low' });
                }
                setDragOverQuadrant(null);
              }}
              isDragOver={dragOverQuadrant === 'q4'}
              onToggle={onToggleTask}
              onEdit={openEditModal}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: PARTNER WORKLOAD & PIPELINE BALANCE */}
      {/* ========================================================= */}
      {viewMode === 'workload' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Key', 'Both', 'Nura'] as const).map(partner => {
            const partnerTasks = filteredTasks.filter(t => t.owner === partner);
            const active = partnerTasks.filter(t => t.stage !== 'completed' && !t.completed);
            const done = partnerTasks.filter(t => t.stage === 'completed' || t.completed);
            const percent = Math.round((done.length / (partnerTasks.length || 1)) * 100);

            return (
              <div 
                key={partner} 
                className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                      partner === 'Key' ? 'bg-indigo-600' :
                      partner === 'Nura' ? 'bg-violet-600' : 'bg-slate-700'
                    }`}>
                      {partner[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                        {partner === 'Both' ? 'Shared Couple Tasks' : `${partner}'s Pipeline`}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {active.length} active · {done.length} completed
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Task list for this partner */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {partnerTasks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400 italic">
                      No tasks assigned to {partner}.
                    </div>
                  ) : (
                    partnerTasks.map(t => (
                      <div 
                        key={t.id}
                        className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-2 shadow-2xs hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => onToggleTask(t.id)}
                            className="p-1 text-slate-400 hover:text-emerald-600"
                          >
                            {t.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4" />}
                          </button>
                          <span className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {t.title}
                          </span>
                        </div>

                        {/* Reassign toggle */}
                        <button
                          onClick={() => {
                            if (!onUpdateTask) return;
                            const next: Record<Partner | 'Both', Partner | 'Both'> = {
                              Key: 'Nura',
                              Nura: 'Both',
                              Both: 'Key'
                            };
                            onUpdateTask({ ...t, owner: next[t.owner] });
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                          title="Click to reassign"
                        >
                          Shift ↺
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT TASK MODAL (RESPONSIVE PC & MOBILE) */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>{editingTask ? 'Edit Task Details' : 'Create New Life Task'}</span>
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Schedule Douro wine tour tickets or update Proxmox server"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category:
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Travel">Travel</option>
                    <option value="Finances">Finances</option>
                    <option value="Home">Home</option>
                    <option value="Health">Health</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Owner:
                  </label>
                  <select
                    value={taskOwner}
                    onChange={(e) => setTaskOwner(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Both">Shared (Both)</option>
                    <option value="Key">Key</option>
                    <option value="Nura">Nura</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority:
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stage:
                  </label>
                  <select
                    value={taskStage}
                    onChange={(e) => setTaskStage(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-xs"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date:
                  </label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    placeholder="e.g. This week, Nov 14"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingTask && onDeleteTask ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTask(editingTask.id);
                      closeModal();
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* AI GOAL BREAKDOWN MODAL */}
      {/* ========================================================= */}
      {isAiBreakdownOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Goal Decomposer</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Break high-level goals into 3 subtasks</p>
                </div>
              </div>
              <button onClick={() => setIsAiBreakdownOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAiBreakdownSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  What goal do Key & Nura want to accomplish?
                </label>
                <textarea
                  rows={3}
                  required
                  value={breakdownGoal}
                  onChange={(e) => setBreakdownGoal(e.target.value)}
                  placeholder="e.g. Plan our Portugal 2027 Sintra day trip and castle tour, or upgrade the homelab NAS storage..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-sans text-xs focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiBreakdownOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Subtasks</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// SUBCOMPONENT: Task List Item Row (High-density checklist)
// =========================================================
interface TaskListItemRowProps {
  task: LifeTask;
  onToggle: (taskId: string) => void;
  onMoveStage: (taskId: string, stage: TaskStage) => void;
  onEdit: (task: LifeTask) => void;
  onDelete?: (taskId: string) => void;
  getCategoryColor: (cat: string) => string;
  getPriorityBadge: (p: 'high' | 'medium' | 'low', interactive?: boolean, taskId?: string) => React.ReactNode;
}

const TaskListItemRow: React.FC<TaskListItemRowProps> = ({
  task,
  onToggle,
  onMoveStage,
  onEdit,
  onDelete,
  getCategoryColor,
  getPriorityBadge,
}) => {
  return (
    <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Left: Checkbox + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Circle className="w-5 h-5 hover:text-slate-600" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold leading-snug truncate ${
            task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
          }`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
            <span>Due {task.dueDate}</span>
            <span>·</span>
            <span>Assigned to {task.owner}</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Category, Priority, Stage Selector, Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold hidden sm:inline ${getCategoryColor(task.category)}`}>
          {task.category}
        </span>

        {getPriorityBadge(task.priority, true, task.id)}

        {/* Stage Selector Dropdown */}
        <select
          value={task.stage}
          onChange={(e) => onMoveStage(task.id, e.target.value as TaskStage)}
          className="text-[11px] font-mono px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
        >
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Done</option>
        </select>

        {/* Edit and Delete Buttons */}
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================
// SUBCOMPONENT: Eisenhower Matrix Quadrant Card
// =========================================================
interface MatrixQuadrantCardProps {
  title: string;
  subtitle: string;
  badgeColor: string;
  borderColor: string;
  tasks: LifeTask[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  onToggle: (taskId: string) => void;
  onEdit: (task: LifeTask) => void;
}

const MatrixQuadrantCard: React.FC<MatrixQuadrantCardProps> = ({
  title,
  subtitle,
  badgeColor,
  borderColor,
  tasks,
  onDragOver,
  onDrop,
  isDragOver,
  onToggle,
  onEdit,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 shadow-sm min-h-[260px] flex flex-col justify-between transition-all ${borderColor} ${
        isDragOver ? 'ring-4 ring-indigo-500/20 scale-[1.01] bg-indigo-50/40 dark:bg-indigo-950/40' : ''
      }`}
    >
      <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
              {title}
            </h3>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="space-y-2 flex-1 my-3 overflow-y-auto max-h-[280px] pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 italic">
            Drag tasks here to assign
          </div>
        ) : (
          tasks.map(t => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', t.id);
              }}
              className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl flex items-center justify-between gap-2 shadow-2xs hover:border-indigo-400 transition-colors cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2 min-w-0">
                <button onClick={() => onToggle(t.id)} className="p-0.5 text-slate-400 hover:text-emerald-600">
                  {t.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                </button>
                <span className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono text-slate-400">{t.owner}</span>
                <button onClick={() => onEdit(t)} className="p-1 text-slate-400 hover:text-indigo-600">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span>Drop tasks to prioritize</span>
        <span>Auto-syncs</span>
      </div>
    </div>
  );
};
