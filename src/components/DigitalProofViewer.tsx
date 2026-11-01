import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundEffects';
import {
  Video,
  Play,
  Pause,
  Maximize2,
  AlertTriangle,
  Radio,
  Eye,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface Props {
  caseId: string;
  evidenceName: string;
  tagNumber: string;
}

export const DigitalProofViewer: React.FC<Props> = ({ caseId, evidenceName, tagNumber }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timecode, setTimecode] = useState(caseId === 'case-001' ? '23:14:18' : '02:41:50');
  const [activeCam, setActiveCam] = useState<'cam1' | 'cam2' | 'hexdump'>('cam1');
  const [detectedMotion, setDetectedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Timecode counter simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const now = new Date();
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      if (caseId === 'case-001') {
        setTimecode(`23:14:${s}:${ms}`);
      } else {
        setTimecode(`02:41:${s}:${ms}`);
      }

      // Random motion flicker simulation
      if (Math.random() < 0.15) {
        setDetectedMotion(true);
        setTimeout(() => setDetectedMotion(false), 900);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, caseId]);

  // Procedural canvas video noise & night-vision scan rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = caseId === 'case-001' ? '#080d09' : '#0a0a0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Night vision or Halon fog tint
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (caseId === 'case-001') {
        grad.addColorStop(0, 'rgba(20, 50, 25, 0.4)');
        grad.addColorStop(1, 'rgba(5, 20, 10, 0.7)');
      } else {
        grad.addColorStop(0, 'rgba(25, 30, 45, 0.5)');
        grad.addColorStop(1, 'rgba(10, 12, 18, 0.8)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Architectural silhouettes / Camera perspective wireframe
      ctx.strokeStyle = caseId === 'case-001' ? 'rgba(70, 160, 90, 0.35)' : 'rgba(120, 140, 180, 0.35)';
      ctx.lineWidth = 1.5;

      if (caseId === 'case-001') {
        // Transom Corridor Wireframe Perspective
        ctx.beginPath();
        // Catwalk perspective lines
        ctx.moveTo(30, 30);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.moveTo(canvas.width - 30, 30);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.moveTo(30, canvas.height - 30);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.moveTo(canvas.width - 30, canvas.height - 30);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.stroke();

        // Transom Window Box
        ctx.strokeRect(canvas.width / 2 - 40, canvas.height / 2 - 50, 80, 50);

        // Motion bounding box if triggered
        if (detectedMotion) {
          ctx.strokeStyle = 'rgba(255, 60, 60, 0.8)';
          ctx.lineWidth = 2;
          ctx.strokeRect(canvas.width / 2 - 25, canvas.height / 2 - 35, 50, 60);
          ctx.fillStyle = 'rgba(255, 60, 60, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText('MOTION TRIPPED: CATWALK ELEVATOR LIFT', canvas.width / 2 - 60, canvas.height / 2 - 45);
        }
      } else {
        // Server Room 4B Rack Wireframe
        for (let i = 0; i < 4; i++) {
          const x = 50 + i * 75;
          ctx.strokeRect(x, 40, 50, 120);
          // Server LEDs blinking
          for (let j = 0; j < 6; j++) {
            ctx.fillStyle = (frame + j * 7) % 20 < 10 ? 'rgba(80, 220, 120, 0.8)' : 'rgba(220, 60, 60, 0.8)';
            ctx.fillRect(x + 8, 50 + j * 16, 4, 4);
          }
        }

        // Halon Inert Gas Cloud Simulation
        ctx.fillStyle = `rgba(180, 200, 220, ${0.15 + Math.sin(frame * 0.05) * 0.08})`;
        ctx.fillRect(0, 70, canvas.width, 100);

        if (detectedMotion) {
          ctx.strokeStyle = 'rgba(255, 40, 40, 0.85)';
          ctx.lineWidth = 2;
          ctx.strokeRect(180, 60, 90, 90);
          ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText('CRITICAL: HALON 1301 DISCHARGE ACTIVE', 80, 30);
        }
      }

      // Scanline static noise
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Random video static particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      for (let n = 0; n < 35; n++) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        ctx.fillRect(rx, ry, 2, 1);
      }

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, caseId, detectedMotion]);

  const handleTogglePlay = () => {
    sound.playTapeClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="surveillance-hud-box p-4 space-y-3 font-mono-archive">
      {/* Top CCTV Status Bar */}
      <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#332F2A] text-[#A9A398]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[#E8DFCC] font-bold tracking-wider">LIVE SURVEILLANCE ARCHIVE</span>
          <span className="text-[#B49A67]">[{tagNumber}]</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-red-500 font-bold tracking-widest">{timecode}</span>
          <span className="bg-[#22201D] px-2 py-0.5 border border-[#3A3630] text-[10px]">
            {caseId === 'case-001' ? 'CAM-04 (ST. JUDE CATWALK)' : 'CAM-08 (TURING ANNEX 4B)'}
          </span>
        </div>
      </div>

      {/* Primary Video Feed Frame */}
      <div className="relative border border-[#3A3630] bg-black overflow-hidden group">
        <canvas
          ref={canvasRef}
          width={480}
          height={220}
          className="w-full h-52 sm:h-64 object-cover filter contrast-125"
        />

        {/* Video Overlay Watermark & Telemetry */}
        <div className="absolute top-2 left-3 text-[10px] text-[#A9A398]/70 pointer-events-none space-y-0.5">
          <div>BLACKWOOD UNIVERSITY DEPT OF SAFETY</div>
          <div>SENSOR: INFRARED OPTICAL MATRIX</div>
        </div>

        <div className="absolute top-2 right-3 text-right text-[10px] text-[#A9A398]/70 pointer-events-none">
          <div className="text-red-400 font-bold">REC ● 24FPS</div>
          <div>FEED BUFFER: SYNCED</div>
        </div>

        {detectedMotion && (
          <div className="absolute bottom-3 left-3 bg-red-950/80 border border-red-600 text-red-300 text-[10px] px-2 py-1 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>OPTICAL SENSOR TRIP RECORDED</span>
          </div>
        )}

        {/* Play / Pause Quick Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="p-1.5 bg-[#171717]/80 hover:bg-[#22201D] text-[#E8DFCC] border border-[#3A3630] cursor-pointer"
            title={isPlaying ? 'Pause Surveillance Playback' : 'Resume Surveillance Playback'}
          >
            {isPlaying ? <Pause className="w-3 h-3 text-[#B49A67]" /> : <Play className="w-3 h-3 text-[#B49A67]" />}
          </button>
        </div>
      </div>

      {/* Forensic Audio & Sub-Channel Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#A9A398]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTapeClick();
              setActiveCam('cam1');
            }}
            className={`px-2.5 py-1 cursor-pointer transition-colors ${
              activeCam === 'cam1'
                ? 'bg-[#B49A67] text-[#171717] font-bold'
                : 'bg-[#171717] text-[#A9A398] border border-[#2E2B26]'
            }`}
          >
            Optical Feed
          </button>
          <button
            onClick={() => {
              sound.playTapeClick();
              setActiveCam('hexdump');
            }}
            className={`px-2.5 py-1 cursor-pointer transition-colors ${
              activeCam === 'hexdump'
                ? 'bg-[#B49A67] text-[#171717] font-bold'
                : 'bg-[#171717] text-[#A9A398] border border-[#2E2B26]'
            }`}
          >
            Security Telemetry
          </button>
        </div>

        <span className="text-[10px] text-[#B49A67]">
          VERIFIED ARCHIVE CLIP · TIMESTAMP MATCHES CORONER TIMELINE
        </span>
      </div>

      {activeCam === 'hexdump' && (
        <div className="p-2.5 bg-[#121110] border border-[#2E2B26] text-[10px] text-[#A9A398] space-y-1">
          <div className="text-[#B49A67] font-bold">DIGITAL INQUEST TELEMETRY LOG:</div>
          <div className="font-mono text-[9px] text-[#E8DFCC] leading-relaxed">
            {caseId === 'case-001'
              ? '0x7F 0x45 0x4C 0x46 // KEYCARD_READER_EAST: CARD_ID: #044 (CLARA VANCE) ACCESS: 23:15:02 // OVERRIDE: FREIGHT_LIFT_1'
              : '0x00 0x00 0x00 0x00 // SHRED_CMD: sudo dd if=/dev/zero of=/dev/nvme0n1 // SUDO_TOKEN: 0x498 (DIR_RAO) TIME: 02:42:18'}
          </div>
        </div>
      )}
    </div>
  );
};
