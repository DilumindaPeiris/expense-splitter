import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Check } from 'lucide-react';

const EMOJI_AVATARS = ['👨🏻‍💻', '👩🏻‍💻', '👨🏼‍🌾', '👩🏽‍🚀', '👨🏻‍🎨', '👩🏼‍⚖️', '👨🏽‍🍳', '👩🏻‍🔬', '🧙‍♂️', '🥷'];
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#3B82F6', '#EF4444'];

export default function GroupModal({ 
  isOpen, 
  onClose, 
  onSaveGroup, 
  initialGroup 
}) {
  const [name, setName] = useState(initialGroup?.name || '');
  const [currency, setCurrency] = useState(initialGroup?.currency || 'USD');
  const [members, setMembers] = useState(
    initialGroup?.members || [
      { id: `mem-init-1`, name: 'Alice', avatar: '👩🏻‍💻', color: '#6366F1' },
      { id: `mem-init-2`, name: 'Bob', avatar: '👨🏼‍🌾', color: '#10B981' },
      { id: `mem-init-3`, name: 'Charlie', avatar: '👨🏻‍🎨', color: '#F59E0B' }
    ]
  );
  const [newMemberName, setNewMemberName] = useState('');

  if (!isOpen) return null;


  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const randomAvatar = EMOJI_AVATARS[members.length % EMOJI_AVATARS.length];
    const randomColor = COLORS[members.length % COLORS.length];

    setMembers([
      ...members,
      {
        id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: newMemberName.trim(),
        avatar: randomAvatar,
        color: randomColor
      }
    ]);
    setNewMemberName('');
  };

  const handleRemoveMember = (id) => {
    if (members.length <= 2) {
      alert('A group must have at least 2 members!');
      return;
    }
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveGroup({
      id: initialGroup?.id || `grp-${Date.now()}`,
      name: name.trim(),
      currency,
      members,
      expenses: initialGroup?.expenses || [],
      settlements: initialGroup?.settlements || []
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {initialGroup ? 'Edit Group & Members' : 'Create New Expense Group'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group mb-4">
            <label className="form-label">Group Name</label>
            <input
              type="text"
              placeholder="e.g. Summer Vacation, Apartment Flat 4B, Roadtrip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input text-base"
              required
            />
          </div>

          {/* Members List Section */}
          <div className="my-5">
            <label className="form-label mb-2 block">Group Members ({members.length})</label>
            
            {/* Add Member Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter new member name..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMember(); } }}
                className="form-input text-xs"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="btn btn-secondary text-xs px-3"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Members chips */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map((m, idx) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{m.avatar}</span>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => {
                        const updated = [...members];
                        updated[idx].name = e.target.value;
                        setMembers(updated);
                      }}
                      className="bg-transparent text-xs font-semibold text-white outline-none border-b border-transparent hover:border-slate-700 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Color Picker dots */}
                    <div className="flex items-center gap-1">
                      {COLORS.slice(0, 4).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            const updated = [...members];
                            updated[idx].color = c;
                            setMembers(updated);
                          }}
                          className={`w-3.5 h-3.5 rounded-full ${m.color === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs px-5"
            >
              <Check className="w-4 h-4" />
              <span>{initialGroup ? 'Save Changes' : 'Create Group'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
