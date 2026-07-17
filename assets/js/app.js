// assets/js/app.js
import { downloadsData } from '../data/files.js';

class DownloadHubApp {
  constructor() {
    this.items = downloadsData;
    this.favorites = JSON.parse(localStorage.getItem('hub_favorites')) || [];
    this.currentFilters = { search: '', category: 'all', sort: 'newest', view: 'grid' };
    
    this.initDOM();
    this.initEventListeners();
    this.render();
  }

  initDOM() {
    this.cardsContainer = document.getElementById('cards-container');
    this.searchInput = document.getElementById('global-search');
    this.categoryFilters = document.querySelectorAll('.cat-filter-btn');
    this.sortSelector = document.getElementById('sort-select');
    this.viewToggleGrid = document.getElementById('view-grid-btn');
    this.viewToggleList = document.getElementById('view-list-btn');
  }

  initEventListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.currentFilters.search = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    this.categoryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        this.categoryFilters.forEach(b => b.classList.remove('active-accent'));
        btn.classList.add('active-accent');
        this.currentFilters.category = btn.getAttribute('data-category');
        this.render();
      });
    });

    if (this.sortSelector) {
      this.sortSelector.addEventListener('change', (e) => {
        this.currentFilters.sort = e.target.value;
        this.render();
      });
    }

    if (this.viewToggleGrid && this.viewToggleList) {
      this.viewToggleGrid.addEventListener('click', () => {
        this.currentFilters.view = 'grid';
        this.render();
      });
      this.viewToggleList.addEventListener('click', () => {
        this.currentFilters.view = 'list';
        this.render();
      });
    }

    if (this.cardsContainer) {
      this.cardsContainer.addEventListener('click', (e) => {
        const favoriteBtn = e.target.closest('.fav-toggle-btn');
        if (favoriteBtn) {
          e.preventDefault(); // පිටුව මාරු වීම වළක්වයි
          const id = favoriteBtn.getAttribute('data-id');
          this.toggleFavorite(id, favoriteBtn);
        }
      });
    }
  }

  toggleFavorite(id, element) {
    const index = this.favorites.indexOf(id);
    if (index === -1) {
      this.favorites.push(id);
      element.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
    } else {
      this.favorites.splice(index, 1);
      element.innerHTML = '<i class="far fa-heart"></i>';
    }
    localStorage.setItem('hub_favorites', JSON.stringify(this.favorites));
  }

  getFilteredData() {
    let result = [...this.items];
    if (this.currentFilters.search) {
      const q = this.currentFilters.search;
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (this.currentFilters.category !== 'all') {
      result = result.filter(item => item.category === this.currentFilters.category);
    }
    result.sort((a, b) => {
      switch (this.currentFilters.sort) {
        case 'oldest': return new Date(a.date) - new Date(b.date);
        case 'largest': return b.bytes - a.bytes;
        case 'smallest': return a.bytes - b.bytes;
        case 'popular': return b.downloads - a.downloads;
        case 'alpha': return a.title.localeCompare(b.title);
        case 'newest':
        default: return new Date(b.date) - new Date(a.date);
      }
    });
    return result;
  }

  render() {
    if (!this.cardsContainer) return;
    const targetData = this.getFilteredData();
    
    if (targetData.length === 0) {
      this.cardsContainer.innerHTML = `
        <div class="col-span-full py-16 text-center text-gray-500">
          <i class="fas fa-search-minus text-4xl mb-4 opacity-50"></i>
          <p class="text-lg font-medium">No assets match your parameters.</p>
        </div>`;
      return;
    }

    const isGrid = this.currentFilters.view === 'grid';
    this.cardsContainer.className = isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4";

    this.cardsContainer.innerHTML = targetData.map(item => {
      const isFav = this.favorites.includes(item.id);
      return isGrid ? this.generateGridHTML(item, isFav) : this.generateListHTML(item, isFav);
    }).join('');
  }

  generateGridHTML(item, isFav) {
    return `
      <a href="downloads.html?id=${item.id}" class="group block bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="relative overflow-hidden aspect-video bg-gray-900">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold uppercase text-white bg-black/60 backdrop-blur-md rounded-full">${item.category}</span>
          <button class="fav-toggle-btn absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white bg-black/40 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors" data-id="${item.id}">
            <i class="${isFav ? 'fas fa-heart text-red-500' : 'far fa-heart'}"></i>
          </button>
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span>v${item.version} • ${item.size}</span>
            <span><i class="far fa-calendar-alt mr-1"></i>${item.date}</span>
          </div>
          <h3 class="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-1">${item.title}</h3>
          <p class="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">${item.description}</p>
          <div class="flex flex-wrap gap-1 mb-4">
            ${item.tags.map(tag => `<span class="text-xs bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] px-2 py-0.5 rounded-md">#${tag}</span>`).join('')}
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <span class="text-xs text-[var(--text-secondary)]"><i class="fas fa-download mr-1.5"></i>${item.downloads.toLocaleString()} views</span>
            <span class="bg-[var(--accent-color)] group-hover:bg-[var(--accent-hover)] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>View Details</span><i class="fas fa-arrow-right text-xs"></i>
            </span>
          </div>
        </div>
      </a>`;
  }

  generateListHTML(item, isFav) {
    return `
      <a href="downloads.html?id=${item.id}" class="group block bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
        <img src="${item.image}" alt="${item.title}" class="w-full sm:w-28 aspect-video sm:h-20 object-cover rounded-lg bg-gray-900" loading="lazy">
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] rounded">${item.category}</span>
            <h3 class="text-base font-bold text-[var(--text-primary)] truncate">${item.title}</h3>
          </div>
          <p class="text-xs text-[var(--text-secondary)] line-clamp-1 mb-2">${item.description}</p>
          <div class="flex gap-4 text-xs text-[var(--text-secondary)]">
            <span>Size: <b>${item.size}</b></span>
            <span>Date: <b>${item.date}</b></span>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-color)]">
          <button class="fav-toggle-btn w-9 h-9 border border-[var(--border-color)] text-[var(--text-secondary)] flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-id="${item.id}">
            <i class="${isFav ? 'fas fa-heart text-red-500' : 'far fa-heart'}"></i>
          </button>
          <span class="bg-[var(--accent-color)] text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <span>Open</span><i class="fas fa-arrow-right text-xs"></i>
          </span>
        </div>
      </a>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.HubAppInstance = new DownloadHubApp();
});
