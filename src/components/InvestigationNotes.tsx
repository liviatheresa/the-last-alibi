import React, { useState, useEffect } from 'react';
import { ScreenId, CaseData, Team, DetectiveNote } from '../types';
import { StorageService } from '../services/storageService';
import { sound } from '../services/soundEffects';
import {
  Pin,
  Trash2,
  Copy,
  CheckCircle2,
  Star,
  Plus,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  onNavigate: (screen: ScreenId) => void;
}

export const InvestigationNotes: React.FC<Props> = ({ caseData, team, onNavigate }) => {
  const [notes, setNotes] = useState<DetectiveNote[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'hypothesis' | 'inconsistency' | 'lead' | 'question'>(
    'lead'
  );
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [copiedReport, setCopiedReport] = useState(false);

  const [suspicionRatings, setSuspicionRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    caseData.suspects.forEach((s) => {
      initial[s.id] = 3;
    });
    return initial;
  });

  useEffect(() => {
    const loadedNotes = StorageService.getNotes(team.id, caseData.id);
    setNotes(loadedNotes);
  }, [team.id, caseData.id]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    sound.playTypewriter();

    const note: DetectiveNote = {
      id: `note_${Date.now()}`,
      author: `${team.leadDetective} (${team.currentRole})`,
      content: newContent.trim(),
      timestamp: 'Just now',
      category: newCategory,
      linkedSuspectId: selectedSuspectId || undefined,
      isPinned: true,
    };

    const updated = [note, ...notes];
    setNotes(updated);
    StorageService.saveNotes(team.id, caseData.id, updated);
    setNewContent('');
  };

  const handleTogglePin = (id: string) => {
    sound.playTapeClick();
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setNotes(updated);
    StorageService.saveNotes(team.id, caseData.id, updated);
  };

  const handleDeleteNote = (id: string) => {
    sound.playTapeClick();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    StorageService.saveNotes(team.id, caseData.id, updated);
  };

  const handleRatingChange = (suspectId: string, rating: number) => {
    sound.playTypewriter();
    setSuspicionRatings((prev) => ({
      ...prev,
      [suspectId]: rating,
    }));
  };

  const handleCopyReport = () => {
    sound.playDramaticChime();
    const reportText = `
=== BLACKWOOD CONSTABULARY CASE FILE SUMMARY ===
CASE: ${caseData.code} - ${caseData.title}
LOCATION: ${caseData.location}
VICTIM: ${caseData.victim.name} (${caseData.victim.causeOfDeath})
SYNDICATE: ${team.name} (Lead: ${team.leadDetective})

SUSPECT SUSPICION RATINGS:
${caseData.suspects.map((s) => `• ${s.name} (${s.role}): ${suspicionRatings[s.id] || 3}/5 Stars`).join('\n')}

INVESTIGATION NOTES & LEADS:
${notes.map((n) => `[${n.category.toUpperCase()}] ${n.content} (by ${n.author})`).join('\n')}
=================================================
`.trim();

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const filteredNotes = notes.filter((n) => {
    if (filterCategory === 'ALL') return true;
    return n.category === filterCategory;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'hypothesis':
        return 'WORKING HYPOTHESIS';
      case 'inconsistency':
        return 'BROKEN ALIBI';
      case 'lead':
        return 'FORENSIC LEAD';
      case 'question':
        return 'UNRESOLVED QUESTION';
      default:
        return 'NOTE';
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Editorial Header */}
        <div className="border-b border-[#2E2B26] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest mb-1">
              CONSTABULARY DEDUCTION CHAMBER · CASE #{caseData.code}
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC]">
              Syndicate Blackboard & Notes
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#A9A398] italic mt-0.5">
              Connect witness statements to forensic evidence, calibrate probability ratings, and synthesize your final hypothesis.
            </p>
          </div>

          <button
            onClick={handleCopyReport}
            className="btn-dossier px-4 py-2 text-xs font-mono-archive flex items-center gap-2 cursor-pointer"
          >
            {copiedReport ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
                <span>Dossier Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#B49A67]" />
                <span>Export Dossier Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Suspect Suspicion Ratings Meter */}
        <div className="manila-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
            <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
              SYNDICATE GUILT PROBABILITY INDEX (1 - 5 STARS)
            </span>
            <span className="font-mono-archive text-[10px] text-[#A9A398]">
              CALIBRATE WITH TEAM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseData.suspects.map((suspect) => {
              const rating = suspicionRatings[suspect.id] || 3;
              return (
                <div
                  key={suspect.id}
                  className="bg-[#171717] border border-[#2E2B26] p-3 flex items-center gap-3"
                >
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-12 h-14 object-cover border border-[#3A3630] filter contrast-105"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-editorial text-base font-bold text-[#E8DFCC] truncate">
                      {suspect.name}
                    </h2>
                    <div className="font-mono-archive text-[10px] text-[#B49A67] truncate">
                      {suspect.role}
                    </div>

                    {/* Star Clicker */}
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(suspect.id, star)}
                          className={`cursor-pointer transition-colors ${
                            star <= rating ? 'text-[#B49A67] fill-[#B49A67]' : 'text-[#332F2A]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Pinned Lead Form */}
        <div className="manila-card p-5 space-y-3">
          <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider block pb-2 border-b border-[#2E2B26]">
            PIN NEW LEAD OR HYPOTHESIS
          </span>

          <form onSubmit={handleAddNote} className="space-y-3 font-mono-archive text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#A9A398] mb-1 uppercase">CLASSIFICATION</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                  className="w-full bg-[#171717] border border-[#332F2A] px-3 py-2 text-[#E8DFCC] outline-none"
                >
                  <option value="lead">Forensic Lead</option>
                  <option value="inconsistency">Broken Alibi / Contradiction</option>
                  <option value="hypothesis">Working Hypothesis</option>
                  <option value="question">Unresolved Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#A9A398] mb-1 uppercase">LINK SUSPECT (OPTIONAL)</label>
                <select
                  value={selectedSuspectId}
                  onChange={(e) => setSelectedSuspectId(e.target.value)}
                  className="w-full bg-[#171717] border border-[#332F2A] px-3 py-2 text-[#E8DFCC] outline-none"
                >
                  <option value="">-- No Direct Link --</option>
                  {caseData.suspects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="w-full btn-gold py-2 text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>Pin to Blackboard</span>
                </button>
              </div>
            </div>

            <div>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Detail suspicious timestamps, chemical findings, or witness tells..."
                rows={2}
                className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] p-3 text-xs text-[#E8DFCC] font-sans outline-none resize-none"
              />
            </div>

            {/* Quick Deduction Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#A9A398] uppercase mr-1">QUICK STARTERS:</span>
              {[
                { label: 'Broken Alibi', cat: 'inconsistency' as const, text: 'Contradiction: Witness claims to have been in office, yet keycard/witness testimony records them elsewhere at ' },
                { label: 'Toxicology/Weapon', cat: 'lead' as const, text: 'Forensic Lead: The lethal method required specialized access to ' },
                { label: 'Motive Tie', cat: 'hypothesis' as const, text: 'Working Hypothesis: Motive stems from recent conflict regarding ' },
                { label: 'Timing Gap', cat: 'question' as const, text: 'Unresolved: An unaccounted 20-minute gap exists between ' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    sound.playTapeClick();
                    setNewCategory(chip.cat);
                    setNewContent(chip.text);
                  }}
                  className="px-2 py-0.5 bg-[#2E2B26] hover:bg-[#3A3630] text-[#B49A67] border border-[#3A3630] text-[10px] rounded-none cursor-pointer transition-colors"
                >
                  + {chip.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center justify-between pb-1 border-b border-[#2E2B26] font-mono-archive text-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[#A9A398] uppercase text-[10px] mr-1">FILTER:</span>
            {['ALL', 'hypothesis', 'inconsistency', 'lead', 'question'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playTypewriter();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 uppercase text-[11px] cursor-pointer transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#B49A67] text-[#171717] font-bold'
                    : 'bg-[#22201D] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-[#A9A398] text-[11px] shrink-0">
            {filteredNotes.length} Pinned Deductions
          </span>
        </div>

        {/* Blackboard Pinboard Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="manila-card p-12 text-center space-y-3">
            <Pin className="w-8 h-8 text-[#B49A67] mx-auto opacity-40" />
            <h3 className="font-editorial text-xl font-bold text-[#E8DFCC]">No Dossier Leads Under This Filter</h3>
            <p className="font-editorial text-sm text-[#A9A398] max-w-md mx-auto italic">
              Record witness discrepancies, analyze chemical traces from the Evidence Locker, or interrogate suspects to unlock vital testimony contradictions.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playTypewriter();
                  onNavigate('interrogation_room');
                }}
                className="btn-dossier px-4 py-2 text-xs font-mono-archive cursor-pointer"
              >
                Interrogate Suspects ➔
              </button>
              <button
                onClick={() => {
                  sound.playTypewriter();
                  onNavigate('evidence_library');
                }}
                className="btn-dossier px-4 py-2 text-xs font-mono-archive cursor-pointer"
              >
                Inspect Evidence ➔
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-5 manila-card flex flex-col justify-between transition-all ${
                  note.isPinned ? 'border-[#B49A67]' : 'border-[#332F2A] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26] mb-3 font-mono-archive text-[10px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className="text-[#B49A67] hover:text-[#E8DFCC] cursor-pointer"
                        title={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'rotate-45' : ''}`} />
                      </button>
                      <span className="text-[#B49A67] font-semibold">{getCategoryLabel(note.category)}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[#A9A398] hover:text-[#702D35] transition-colors cursor-pointer"
                      title="Remove note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="font-editorial text-base text-[#E8DFCC] italic leading-relaxed">
                    "{note.content}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E2B26] flex items-center justify-between font-mono-archive text-[10px] text-[#A9A398]">
                  <span className="truncate max-w-[180px]">{note.author}</span>
                  <span>{note.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call to Action: Grand Accusation Chamber */}
        <div className="manila-card p-6 bg-gradient-to-r from-[#22201D] via-[#1F1D1A] to-[#2B1B1E] border border-[#B49A67]/40 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest">
              CONFIDENTIAL MAGISTRATE CONVOCATION
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
              Ready to Formulate the Final Accusation?
            </h3>
            <p className="font-editorial text-sm text-[#A9A398] italic">
              When your syndicate has isolated the culprit, identified the critical murder weapon, and dismantled their alibi, convene before the University Tribunal.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playGavel();
              onNavigate('final_accusation');
            }}
            className="btn-gold px-6 py-3 text-xs uppercase font-bold tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <span>Enter Accusation Chamber</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
