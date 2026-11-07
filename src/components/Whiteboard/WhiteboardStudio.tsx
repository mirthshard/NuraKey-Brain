import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Move, 
  PenTool, 
  Eraser, 
  MapPin, 
  StickyNote, 
  Layers, 
  RotateCcw
} from 'lucide-react';
import { WhiteboardNode, WhiteboardConnection, Partner } from '../../types/brain';

interface WhiteboardStudioProps {
  currentPartner: Partner;
  nodes: WhiteboardNode[];
  connections: WhiteboardConnection[];
  onAddNode: (node: WhiteboardNode) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
}

export const WhiteboardStudio: React.FC<WhiteboardStudioProps> = ({
  currentPartner,
  nodes,
  connections,
  onAddNode,
  onUpdateNodePosition,
  onDeleteNode,
}) => {
  const [activeTool, setActiveTool] = useState<'select' | 'pen' | 'sticky' | 'trip'>('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (node: WhiteboardNode, e: React.MouseEvent) => {
    if (activeTool !== 'select') return;
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - node.x,
        y: (e.clientY - rect.top) / zoom - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.round((e.clientX - rect.left) / zoom - dragOffset.x);
    const newY = Math.round((e.clientY - rect.top) / zoom - dragOffset.y);
    onUpdateNodePosition(draggingNodeId, Math.max(10, newX), Math.max(10, newY));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleCreateNode = (type: 'sticky' | 'trip_stop') => {
    const newNode: WhiteboardNode = {
      id: `wb-${Date.now()}`,
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      title: type === 'trip_stop' ? 'New Travel Stop' : 'New Idea Note',
      description: type === 'trip_stop' ? 'Details, sights & restaurant plans' : 'Brainstorm thought from ' + currentPartner,
      color: type === 'trip_stop' ? '#EC4899' : '#F59E0B',
      author: currentPartner,
      tags: [type === 'trip_stop' ? 'Travel' : 'Brainstorm'],
    };
    onAddNode(newNode);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#080C14] select-none relative overflow-hidden">
      {/* Top Floating Whiteboard Toolbar */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0E1526]/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'select'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Move & Select Nodes"
          >
            <Move className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleCreateNode('sticky')}
            className="p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all flex items-center gap-1.5"
            title="Add Idea Sticky Note"
          >
            <StickyNote className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sticky Note</span>
          </button>

          <button
            onClick={() => handleCreateNode('trip_stop')}
            className="p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all flex items-center gap-1.5"
            title="Add Travel Stop Card"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Trip Stop</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-1" />

          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.6))}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 px-2">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-xs text-slate-400 font-mono bg-[#0E1526]/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg">
            Live Shared Canvas · {nodes.length} Nodes
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* SVG Connectors Line Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.fromId);
            const toNode = nodes.find(n => n.id === conn.toId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 120;
            const y1 = fromNode.y + 40;
            const x2 = toNode.x + 120;
            const y2 = toNode.y + 40;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6366F1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                {conn.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Mindmap & Sticky Nodes */}
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="w-full h-full">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node, e)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '240px',
                }}
                className={`absolute p-4 rounded-2xl shadow-xl transition-shadow select-none cursor-grab active:cursor-grabbing border ${
                  isSelected
                    ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                } bg-[#0E1526]/95 backdrop-blur-md space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: node.color }} 
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {node.type.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-xs font-bold text-white line-clamp-1">
                  {node.title}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                  {node.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span>By {node.author}</span>
                  {node.tags && (
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">
                      {node.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
