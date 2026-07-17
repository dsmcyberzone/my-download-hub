// assets/js/single-download.js
import { downloadsData } from '../data/files.js';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  const skeleton = document.getElementById('loading-skeleton');
  const content = document.getElementById('details-content');

  if (!itemId) {
    if(skeleton) skeleton.innerHTML = '<p class="text-red-500 font-bold">Error: No Asset ID provided!</p>';
    return;
  }

  const item = downloadsData.find(i => i.id === itemId);

  if (!item) {
    if(skeleton) skeleton.innerHTML = '<p class="text-red-500 font-bold">Error: Asset architecture not found!</p>';
    return;
  }

  // DOM UI Element Mapping
  document.getElementById('asset-image').src = item.image;
  document.getElementById('asset-image').alt = item.title;
  document.getElementById('asset-category').innerText = item.category;
  document.getElementById('asset-title').innerText = item.title;
  document.getElementById('asset-version').innerText = `v${item.version}`;
  document.getElementById('asset-size').innerText = item.size;
  document.getElementById('asset-date').innerText = item.date;
  document.getElementById('asset-downloads').innerText = item.downloads.toLocaleString();
  document.getElementById('asset-description').innerText = item.description;

  // Render Tags
  const tagsContainer = document.getElementById('asset-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = item.tags.map(tag => 
      `<span class="text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">#${tag}</span>`
    ).join('');
  }

  // Download Trigger Configuration
  const dlLink = document.getElementById('asset-download-link');
  if (dlLink) {
    dlLink.href = item.file;
    if (item.isExternal) {
      dlLink.setAttribute('target', '_blank');
      dlLink.setAttribute('rel', 'noopener noreferrer');
    } else {
      dlLink.setAttribute('download', '');
    }

    // Dynamic Download Counter Tracker Simulation
    dlLink.addEventListener('click', () => {
      item.downloads++;
      document.getElementById('asset-downloads').innerText = item.downloads.toLocaleString();
    });
  }

  // Copy Prompt Clipboard Module
  const copyBtn = document.getElementById('copy-prompt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(item.description).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check text-green-500"></i> <span>Copied!</span>';
        copyBtn.classList.add('bg-emerald-500', 'text-white');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i> <span>Copy Prompt</span>';
          copyBtn.classList.remove('bg-emerald-500', 'text-white');
        }, 2000);
      });
    });
  }

  // Remove skeleton and reveal content gracefully
  if(skeleton) skeleton.classList.add('hidden');
  if(content) content.classList.remove('hidden');
});
