// Configuration - Replace with your Google Sheets Published CSV URLs for K.S. Chithra
const SHEETS_CONFIG = {
    malayalam: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=0&single=true&output=csv',
    tamil: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=633202374&single=true&output=csv',
    telugu: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=1972620029&single=true&output=csv',
    kannada: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=1314987480&single=true&output=csv',
    hindi: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=2082159835&single=true&output=csv',
    other: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF_EQ0k9tK0NMr_K4ig_fDGK7JGyJ-APUrm8jO00eb0VsKsHno2PUspQ2w6XayF_sIAkZbkyZkwGW0/pub?gid=91154675&single=true&output=csv'
};

// Global variables
let currentLanguage = '';
let allSongs = [];
let filteredSongs = [];
let currentPlayer = null;
let activeFilters = {};

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Get language class name for styling
function getLanguageClass(language) {
    if (!language) return '';
    return language.toLowerCase().replace(/\s+/g, '-');
}

// Fetch songs from Google Sheets CSV
async function fetchSongsFromSheet(sheetUrl) {
    try {
        const response = await fetch(sheetUrl);
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const songs = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const song = {};
        
        headers.forEach((header, index) => {
            song[header] = values[index] ? values[index].trim() : '';
        });
        
        // Add ALL songs, even without YouTube links
        if (song.song || song.title) {
            songs.push(song);
        }
    }
    
    return songs;
}

// Parse CSV line handling quoted commas
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values.map(v => v.replace(/^"|"$/g, ''));
}

// Get decade from year
function getDecade(year) {
    if (!year) return null;
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return null;
    return Math.floor(yearNum / 10) * 10;
}

// Display songs in grid
function displaySongs(songs) {
    const container = document.getElementById('songsGrid');
    if (!container) return;
    
    if (songs.length === 0) {
        container.innerHTML = '<div class="loading">No songs found matching your criteria</div>';
        return;
    }
    
    container.innerHTML = songs.map(song => createSongCard(song)).join('');
    
    // Add click handlers
    document.querySelectorAll('.song-card').forEach((card, index) => {
        card.addEventListener('click', () => playYouTubeVideo(songs[index]));
    });
    
    // Update stats
    updateStats(songs.length);
    updateActiveFiltersDisplay();
}

// Create song card HTML
function createSongCard(song) {
    const title = song.song || song.title || 'Untitled';
    const movie = song.movie || song.film || song.album || '';
    const year = song.year || '';
    const composer = song.composer || song['music director'] || song.music || '';
    const cosinger = song.cosinger || song['co-singer'] || song.singer || '';
    const genre = song.genre || song.category || '';
    const language = song.language || '';
    const type = song.type || '';
    const languageClass = getLanguageClass(language);
    const youtubeUrl = song.youtube || song['youtube link'] || song.link || '';
    const hasVideo = !!youtubeUrl;
    const isFilmSong = type.toLowerCase().includes('film');
    const movieLabel = isFilmSong ? 'Movie:' : 'Album:';

    
    // Format co-singers nicely
    let cosingerDisplay = cosinger;
    if (cosinger) {
        const singers = cosinger.split(',').map(s => s.trim()).filter(s => s.length > 0);
        cosingerDisplay = singers.join(', ');
    }
    
    return `
        <div class="song-card ${!hasVideo ? 'no-video' : ''}" data-genre="${genre}" data-type="${type}">
            <div class="song-card-container">
                <!-- K.S. Chithra Image on LEFT -->
                <div class="chithra-image-side">
                    ${hasVideo ? '<div class="play-overlay-card"><div class="play-icon-card">▶</div></div>' : '<div class="no-video-overlay-card"><div class="no-video-text">No Video</div></div>'}
                </div>
                
                <!-- Song Details on RIGHT -->
                <div class="song-details-side">
                    ${language ? `<div class="language-header-card">${language}</div>` : ''}
                    <h3 class="song-title-card">${title}</h3>
                    <div class="song-meta-card">
                        ${type ? `<div class="meta-row"><span class="meta-label">Type:</span> ${type}</div>` : ''}
                        ${movie ? `<div class="meta-row"><span class="meta-label">${movieLabel}</span> ${movie}</div>` : ''}

                        ${year ? `<div class="meta-row"><span class="meta-label">Year:</span> ${year}</div>` : ''}
                        ${composer ? `<div class="meta-row"><span class="meta-label">Music:</span> ${composer}</div>` : ''}
                        ${cosingerDisplay ? `<div class="meta-row"><span class="meta-label">CoSinger:</span> ${cosingerDisplay}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Play YouTube video in mini player
function playYouTubeVideo(song) {
    const youtubeUrl = song.youtube || song['youtube link'] || song.link || '';
    const videoId = getYouTubeVideoId(youtubeUrl);
    
    if (!videoId) {
        alert('YouTube video not available for this song');
        return;
    }
    
    const miniPlayer = document.getElementById('miniPlayer');
    const playerContainer = document.getElementById('playerContainer');
    const songTitle = document.getElementById('playerSongTitle');
    const songDetails = document.getElementById('playerSongDetails');
    
    const title = song.song || song.title || 'Untitled';
    const movie = song.movie || song.film || song.album || '';
    const cosinger = song.cosinger || song['co-singer'] || '';
    
    songTitle.textContent = title;
    songDetails.textContent = [movie, cosinger].filter(Boolean).join(' • ');
    
    // Create YouTube iframe
    playerContainer.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
    
    // Show mini player
    miniPlayer.classList.remove('hidden');
    miniPlayer.classList.remove('minimized');
    
    // Scroll to player smoothly
    miniPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query === '') {
            filteredSongs = allSongs;
        } else {
            filteredSongs = allSongs.filter(song => {
                const searchFields = [
                    song.song || song.title || '',
                    song.movie || song.film || song.album || '',
                    song.composer || song['music director'] || '',
                    song.cosinger || song['co-singer'] || '',
                    song.genre || song.category || ''
                ].map(field => field.toLowerCase());
                
                return searchFields.some(field => field.includes(query));
            });
        }
        
        applyFilters();
    });
}

// Quick filters
function setupQuickFilters() {
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const currentYear = new Date().getFullYear();
            
            // Remove active class from all buttons
            document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const yearFromInput = document.getElementById('yearFrom');
            const yearToInput = document.getElementById('yearTo');
            
            switch(filter) {
                case 'recent':
                    yearFromInput.value = currentYear - 10;
                    yearToInput.value = currentYear;
                    break;
                case 'classic':
                    yearFromInput.value = 1980;
                    yearToInput.value = 2000;
                    break;
                case 'golden':
                    yearFromInput.value = 1985;
                    yearToInput.value = 1995;
                    break;
                case 'modern':
                    yearFromInput.value = 2000;
                    yearToInput.value = 2015;
                    break;
            }
            
            applyFilters();
        });
    });
}

// Setup all filters
function setupFilters() {
    const filters = ['typeFilter', 'languageFilter', 'genreFilter', 'composerFilter', 'cosingerFilter', 'decadeFilter'];
    
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
    
    const yearFrom = document.getElementById('yearFrom');
    const yearTo = document.getElementById('yearTo');
    
    if (yearFrom) yearFrom.addEventListener('input', applyFilters);
    if (yearTo) yearTo.addEventListener('input', applyFilters);
    
    setupQuickFilters();
    
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

// Apply filters
function applyFilters() {
    let filtered = [...filteredSongs];
    
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter && typeFilter.value !== 'all') {
        filtered = filtered.filter(s => s.type === typeFilter.value);
    }
    
    // Language filter
    const languageFilter = document.getElementById('languageFilter');
    if (languageFilter && languageFilter.value !== 'all') {
        filtered = filtered.filter(s => s.language === languageFilter.value);
    }
    
    // Genre filter
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter && genreFilter.value !== 'all') {
        filtered = filtered.filter(s => (s.genre || s.category) === genreFilter.value);
    }
    
    // Composer filter
    const composerFilter = document.getElementById('composerFilter');
    if (composerFilter && composerFilter.value !== 'all') {
        filtered = filtered.filter(s => (s.composer || s['music director']) === composerFilter.value);
    }
    
    // Co-singer filter
    const cosingerFilter = document.getElementById('cosingerFilter');
    if (cosingerFilter && cosingerFilter.value !== 'all') {
        filtered = filtered.filter(s => {
            const cosinger = s.cosinger || s['co-singer'] || '';
            const singers = cosinger.split(',').map(singer => singer.trim());
            return singers.includes(cosingerFilter.value);
        });
    }
    
    // Decade filter
    const decadeFilter = document.getElementById('decadeFilter');
    if (decadeFilter && decadeFilter.value !== 'all') {
        const decade = parseInt(decadeFilter.value);
        filtered = filtered.filter(s => getDecade(s.year) === decade);
    }
    
    // Year range filter
    const yearFrom = document.getElementById('yearFrom');
    const yearTo = document.getElementById('yearTo');
    if (yearFrom && yearFrom.value) {
        const from = parseInt(yearFrom.value);
        filtered = filtered.filter(s => {
            const year = parseInt(s.year);
            return !isNaN(year) && year >= from;
        });
    }
    if (yearTo && yearTo.value) {
        const to = parseInt(yearTo.value);
        filtered = filtered.filter(s => {
            const year = parseInt(s.year);
            return !isNaN(year) && year <= to;
        });
    }
    
    displaySongs(filtered);
}

// Clear all filters
function clearAllFilters() {
    // Reset all select elements
    const selects = ['typeFilter', 'languageFilter', 'genreFilter', 'composerFilter', 'cosingerFilter', 'decadeFilter'];
    selects.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = 'all';
    });
    
    // Reset year inputs
    const yearFrom = document.getElementById('yearFrom');
    const yearTo = document.getElementById('yearTo');
    if (yearFrom) yearFrom.value = '';
    if (yearTo) yearTo.value = '';
    
    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Remove active class from quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Reset active filters
    activeFilters = {};
    
    // Reset display
    filteredSongs = allSongs;
    displaySongs(allSongs);
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    const filters = [];
    
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter && typeFilter.value !== 'all') {
        filters.push({ label: 'Type', value: typeFilter.options[typeFilter.selectedIndex].text });
    }
    
    const languageFilter = document.getElementById('languageFilter');
    if (languageFilter && languageFilter.value !== 'all') {
        filters.push({ label: 'Language', value: languageFilter.options[languageFilter.selectedIndex].text });
    }
    
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter && genreFilter.value !== 'all') {
        filters.push({ label: 'Genre', value: genreFilter.options[genreFilter.selectedIndex].text });
    }
    
    const composerFilter = document.getElementById('composerFilter');
    if (composerFilter && composerFilter.value !== 'all') {
        filters.push({ label: 'Composer', value: composerFilter.options[composerFilter.selectedIndex].text });
    }
    
    const cosingerFilter = document.getElementById('cosingerFilter');
    if (cosingerFilter && cosingerFilter.value !== 'all') {
        filters.push({ label: 'Co-Singer', value: cosingerFilter.options[cosingerFilter.selectedIndex].text });
    }
    
    const decadeFilter = document.getElementById('decadeFilter');
    if (decadeFilter && decadeFilter.value !== 'all') {
        filters.push({ label: 'Decade', value: decadeFilter.options[decadeFilter.selectedIndex].text });
    }
    
    const yearFrom = document.getElementById('yearFrom');
    const yearTo = document.getElementById('yearTo');
    if (yearFrom && yearTo && (yearFrom.value || yearTo.value)) {
        const from = yearFrom.value || '?';
        const to = yearTo.value || '?';
        filters.push({ label: 'Year Range', value: `${from} - ${to}` });
    }
    
    if (filters.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = filters.map(f => 
        `<span class="active-filter">${f.label}: ${f.value}</span>`
    ).join('');
}

// Populate filter dropdowns
function populateFilters(songs) {
    populateTypeFilter(songs);
    populateLanguageFilter(songs);
    populateGenreFilter(songs);
    populateComposerFilter(songs);
    populateCosingerFilter(songs);
    populateDecadeFilter(songs);
}

function populateTypeFilter(songs) {
    const typeFilter = document.getElementById('typeFilter');
    if (!typeFilter) return;
    
    const types = [...new Set(songs.map(s => s.type).filter(Boolean))];
    types.sort();
    
    typeFilter.innerHTML = '<option value="all">All Types</option>' + 
        types.map(t => `<option value="${t}">${t}</option>`).join('');
}

function populateLanguageFilter(songs) {
    const languageFilter = document.getElementById('languageFilter');
    if (!languageFilter) return;
    
    const languages = [...new Set(songs.map(s => s.language).filter(Boolean))];
    languages.sort();
    
    languageFilter.innerHTML = '<option value="all">All Languages</option>' + 
        languages.map(l => `<option value="${l}">${l}</option>`).join('');
}

function populateGenreFilter(songs) {
    const genreFilter = document.getElementById('genreFilter');
    if (!genreFilter) return;
    
    const genres = [...new Set(songs.map(s => s.genre || s.category).filter(Boolean))];
    genres.sort();
    
    genreFilter.innerHTML = '<option value="all">All Genres</option>' + 
        genres.map(g => `<option value="${g}">${g}</option>`).join('');
}

function populateComposerFilter(songs) {
    const composerFilter = document.getElementById('composerFilter');
    if (!composerFilter) return;
    
    const composers = [...new Set(songs.map(s => s.composer || s['music director']).filter(Boolean))];
    composers.sort();
    
    composerFilter.innerHTML = '<option value="all">All Composers</option>' + 
        composers.map(c => `<option value="${c}">${c}</option>`).join('');
}

function populateCosingerFilter(songs) {
    const cosingerFilter = document.getElementById('cosingerFilter');
    if (!cosingerFilter) return;
    
    const cosingersSet = new Set();
    
    songs.forEach(song => {
        const cosinger = song.cosinger || song['co-singer'] || '';
        if (cosinger) {
            const singers = cosinger.split(',').map(s => s.trim()).filter(s => s.length > 0);
            singers.forEach(singer => cosingersSet.add(singer));
        }
    });
    
    const cosingers = [...cosingersSet].sort();
    
    cosingerFilter.innerHTML = '<option value="all">All Co-Singers</option>' + 
        cosingers.map(c => `<option value="${c}">${c}</option>`).join('');
}

function populateDecadeFilter(songs) {
    const decadeFilter = document.getElementById('decadeFilter');
    if (!decadeFilter) return;
    
    const decades = [...new Set(songs.map(s => getDecade(s.year)).filter(d => d !== null))];
    decades.sort((a, b) => a - b);
    
    decadeFilter.innerHTML = '<option value="all">All Decades</option>' + 
        decades.map(d => `<option value="${d}">${d}s</option>`).join('');
}

// Update stats display
function updateStats(count) {
    const statsDisplay = document.getElementById('statsDisplay');
    if (statsDisplay) {
        statsDisplay.textContent = `Showing ${count} of ${allSongs.length} songs`;
    }
}

// Mini player controls
function setupMiniPlayer() {
    const miniPlayer = document.getElementById('miniPlayer');
    const minimizeBtn = document.getElementById('minimizePlayer');
    const closeBtn = document.getElementById('closePlayer');
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            miniPlayer.classList.toggle('minimized');
            minimizeBtn.textContent = miniPlayer.classList.contains('minimized') ? '▲' : '▼';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            miniPlayer.classList.add('hidden');
            const playerContainer = document.getElementById('playerContainer');
            playerContainer.innerHTML = '';
        });
    }
}

// Initialize page
async function initializePage() {
    // Determine current language from page
    const path = window.location.pathname;
    currentLanguage = path.split('/').pop().replace('.html', '');
    
    // Setup mini player
    setupMiniPlayer();
    
    // If on a language page, load songs
    if (SHEETS_CONFIG[currentLanguage]) {
        const container = document.getElementById('songsGrid');
        if (container) {
            container.innerHTML = '<div class="loading">Loading songs from database...</div>';
            
            // Fetch songs
            allSongs = await fetchSongsFromSheet(SHEETS_CONFIG[currentLanguage]);
            filteredSongs = allSongs;
            
            // Display songs
            displaySongs(allSongs);
            
            // Setup search and filters
            setupSearch();
            setupFilters();
            populateFilters(allSongs);
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);
