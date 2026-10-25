const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'UI', 'StoryDrawer.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Add MessageSquare to lucide-react imports if not present
if (!code.includes('MessageSquare,')) {
  code = code.replace(
    '  Image as ImageIcon,',
    '  Image as ImageIcon,\r\n  MessageSquare,'
  );
}

// 2. Import CommentsPanel
if (!code.includes('CommentsPanel')) {
  code = code.replace(
    "import { getEntityDossier } from '../../lib/entityBestiary';",
    "import { getEntityDossier } from '../../lib/entityBestiary';\r\nimport { CommentsPanel } from './CommentsPanel';"
  );
}

// 3. Add mobileTab state
if (!code.includes('mobileTab')) {
  code = code.replace(
    'const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);',
    'const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);\r\n  const [mobileTab, setMobileTab] = useState<\'dossier\' | \'comments\'>(\'dossier\');'
  );
}

// 4. Update dialog className and wrap in flex container with Left CommentsPanel, Center Transparent Viewport, and Right Dossier
const oldDialogHeader = `  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={onClose}
      aria-labelledby="story-drawer-title"
      className="m-0 ml-auto h-full max-h-none w-full max-w-xl p-0 bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative flex flex-col h-full bg-[#060911]/98 border-l border-amber-500/25 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in slide-in-from-right duration-300">`;

const newDialogHeader = `  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={onClose}
      aria-labelledby="story-drawer-title"
      className="m-0 p-0 h-full max-h-none w-full max-w-none bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative w-full h-full flex justify-between overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANEL: EYEWITNESS COMMENTS & POPULAR TESTIMONIES          */}
        {/* ============================================================== */}
        <div
          className={\`shrink-0 h-full w-full lg:w-96 xl:w-[410px] z-30 transition-transform \${
            mobileTab === 'comments' ? 'flex' : 'hidden lg:flex'
          }\`}
        >
          <div className="w-full h-full flex flex-col">
            {/* Mobile Tab Switcher at top of comments */}
            <div className="lg:hidden flex items-center justify-between p-2.5 bg-[#070c16] border-b border-amber-500/20 text-xs">
              <button
                type="button"
                onClick={() => setMobileTab('dossier')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>{language === 'th' ? '← สลับไปดูคัมภีร์ข้อมูล' : '← Switch to Dossier'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CommentsPanel pin={pin} language={language} onClose={onClose} />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER TRANSPARENT VIEWPORT (50% TRANSPARENCY OVER 3D GLOBE)    */}
        {/* ============================================================== */}
        <div
          onClick={onClose}
          className="hidden lg:flex flex-1 h-full cursor-pointer bg-black/10 hover:bg-black/5 transition-colors items-end justify-center pb-8 select-none group z-10"
          title={language === 'th' ? 'คลิกที่ว่างตรงกลางเพื่อปิด' : 'Click center backdrop to close'}
        >
          <div className="opacity-0 group-hover:opacity-90 transition-opacity px-4 py-2 rounded-full bg-black/75 border border-amber-500/40 text-xs text-amber-200/90 backdrop-blur-md shadow-[0_0_24px_rgba(0,0,0,0.9)] flex items-center gap-2">
            <span>👁️</span>
            <span>
              {language === 'th'
                ? 'มุมมองลูกโลก 3D (โปร่งใส 50%) • คลิกที่ว่างเพื่อปิด'
                : '3D Globe View (50% Transparent) • Click to close'}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: STORY DOSSIER & MEDIA CAROUSEL                    */}
        {/* ============================================================== */}
        <div
          className={\`relative flex flex-col h-full w-full lg:max-w-xl xl:max-w-xl bg-[#060911]/98 border-l border-amber-500/25 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in slide-in-from-right duration-300 z-30 \${
            mobileTab === 'dossier' ? 'flex' : 'hidden lg:flex'
          }\`}
        >
          {/* Mobile Top Toggle for switching to comments */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#080e1b] border-b border-amber-500/20 text-xs">
            <button
              type="button"
              onClick={() => setMobileTab('comments')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'th' ? '💬 ดูความคิดเห็น & ยอดนิยม' : '💬 View Comments & Popular'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>`;

code = code.replace(oldDialogHeader.replace(/\n/g, '\r\n'), newDialogHeader.replace(/\n/g, '\r\n'));
if (code.includes('className="m-0 ml-auto h-full')) {
  code = code.replace(oldDialogHeader, newDialogHeader);
}

// 5. Close the wrapper div before closing </dialog>
// Currently line 617: </div> (closes the dossier inner div), then lightbox, then </dialog>
// We need to add one more </div> after the dossier closes.
const oldClosing = `        </div>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN FILL-PAGE LIGHTBOX OVERLAY`;

const newClosing = `        </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN FILL-PAGE LIGHTBOX OVERLAY`;

code = code.replace(oldClosing.replace(/\n/g, '\r\n'), newClosing.replace(/\n/g, '\r\n'));
if (code.includes(oldClosing)) {
  code = code.replace(oldClosing, newClosing);
}

fs.writeFileSync(targetPath, code);
console.log('Successfully updated StoryDrawer.tsx!');
