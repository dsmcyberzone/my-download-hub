// assets/js/single-download.js
import { downloadsData } from '../data/files.js';

document.addEventListener('DOMContentLoaded', () => {
  // URL එකෙන් ID එක ගන්නවා (e.g. ?id=tiktok-ai-prompt-01)
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  if (!itemId) {
    document.body.innerHTML = '<div class="text-center py-20 text-xl font-bold">Invalid Asset ID!</div>';
    return;
  }

  // ඩේටා එක හොයාගන්නවා
  const item = downloadsData.find(i => i.id === itemId);

  if (!item) {
    document.body.innerHTML = '<div class="text-center py-20 text-xl font-bold">Asset Not Found!</div>';
    return;
  }

  // downloads.html පිටුවේ තියෙන Elements වලට ඩේටා දානවා
  const titleEl = document.getElementById('page-title') || document.querySelector('h1');
  const descEl = document.getElementById('page-description') || document.querySelector('.description-text');
  const imgEl = document.getElementById('page-image') || document.querySelector('.main-preview-img');
  const downloadBtn = document.getElementById('page-download-btn') || document.querySelector('.download-trigger');
  
  // Prompt එක කොපි කරන්න අවශ්‍ය වෙනම Box එකක් හදන්න (description එක වෙනුවට)
  const promptBox = document.getElementById('prompt-copy-box');

  if (titleEl) titleEl.innerText = item.title;
  if (imgEl) imgEl.src = item.image;
  
  if (descEl) {
    // මෙතනදී මුළු දිග විස්තරයම (Prompt එක) ලස්සනට පේන්න සලස්වනවා
    descEl.innerHTML = `
      <div class="bg-gray-50 dark:bg-gray-900/60 p-5 rounded-xl border border-[var(--border-color)] font-mono text-sm leading-relaxed whitespace-pre-wrap select-all relative group">
        <button id="single-copy-btn" class="absolute top-3 right-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[var(--accent-color)] hover:text-white transition-all flex items-center gap-1">
          <i class="far fa-copy"></i> Copy Prompt
        </button>
        <span id="prompt-content-text">${item.description}</span>
      </div>
    `;

    // Copy Button Logic
    setTimeout(() => {
      const btn = document.getElementById('single-copy-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const txt = document.getElementById('prompt-content-text').innerText;
          navigator.clipboard.writeText(txt).then(() => {
            btn.innerHTML = '<i class="fas fa-check text-green-500"></i> Copied!';
            setTimeout(() => {
              btn.innerHTML = '<i class="far fa-copy"></i> Copy Prompt';
            }, 2000);
          });
        });
      }
    }, 100);
  }

  if (downloadBtn) {
    downloadBtn.href = item.file;
    if (item.isExternal) {
      downloadBtn.setAttribute('target', '_blank');
      downloadBtn.setAttribute('rel', 'noopener noreferrer');
    } else {
      downloadBtn.setAttribute('download', '');
    }
  }
});
