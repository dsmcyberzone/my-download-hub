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

  // --- YOUTUBE EMBED MODULE ---
  const videoContainer = document.getElementById('video-container');
  const imageContainer = document.getElementById('image-container');
  const videoFrame = document.getElementById('asset-video-frame');

  if (item.youtubeUrl) {
    // YouTube සාමාන්‍ය ලින්ක් එකක් හෝ Share ලින්ක් එකක් Embed ලින්ක් එකකට හරවනවා
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = item.youtubeUrl.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
      videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
      videoContainer.classList.remove('hidden'); // වීඩියෝව පෙන්වන්න
      imageContainer.classList.add('hidden');    // ඉමේජ් එක හංගන්න
    }
  } else {
    // වීඩියෝ ලින්ක් එකක් නැත්නම් සාමාන්‍ය ඉමේජ් එක පෙන්වනවා
    document.getElementById('asset-image').src = item.image;
    document.getElementById('asset-image').alt = item.title;
    videoContainer.classList.add('hidden');
    imageContainer.classList.remove('hidden');
  }
  // ----------------------------

  // අනෙකුත් විස්තර පිරවීම
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

  // Download Action
  const dlLink = document.getElementById('asset-download-link');
  if (dlLink) {
    dlLink.href = item.file;
    if (item.isExternal) {
      dlLink.setAttribute('target', '_blank');
      dlLink.setAttribute('rel', 'noopener noreferrer');
    } else {
      dlLink.setAttribute('download', '');
    }

    dlLink.addEventListener('click', () => {
      item.downloads++;
      document.getElementById('asset-downloads').innerText = item.downloads.toLocaleString();
    });
  }

  // Copy Prompt Module
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

  if(skeleton) skeleton.classList.add('hidden');
  if(content) content.classList.remove('hidden');
});
