# K.S. Chithra Tribute Website

A beautiful, elegant tribute website celebrating the legendary playback singer K.S. Chithra - "The Nightingale of South India"

## Overview

This website is a comprehensive tribute to K.S. Chithra, featuring:
- 25,000+ songs across 18+ languages
- Interactive song browsing with advanced filtering
- YouTube integration for instant playback
- Statistics and analytics dashboard
- Awards, timeline, and collaboration pages
- Responsive design with feminine, elegant aesthetics

## Key Differences from K.J. Yesudas Website

While inspired by the Yesudas tribute site, this version features:

1. **Feminine Color Palette**: Soft rose pinks (#C9184A) and complementary golds instead of dark theme
2. **Lighter Design**: White backgrounds with elegant rose accents
3. **Different Icons**: Floral emojis (🌺🌹🏵️🌸🌼🌷) instead of theatrical ones
4. **Softer Typography**: Georgia/Cambria fonts for a more graceful feel
5. **Unique Hero Section**: Tailored statistics (25,000+ songs, 18+ languages, 40+ years)
6. **K.S. Chithra Biography**: Complete rewrite with her life story, achievements, and legacy
7. **Modified Quick Filters**: Updated year ranges to match her career (1980-2015 focus)

## File Structure

```
chithra-tribute/
├── index.html              # Home page
├── about.html              # Biography and achievements
├── malayalam.html          # Malayalam songs
├── tamil.html              # Tamil songs (similar to Malayalam)
├── telugu.html             # Telugu songs
├── kannada.html            # Kannada songs
├── hindi.html              # Hindi songs
├── other.html              # Other languages
├── statistics.html         # Career statistics
├── favorites.html          # User favorites
├── awards.html             # Awards and honors
├── timeline.html           # Career timeline
├── collaborations.html     # Collaboration network
├── css/
│   └── chithra-styles.css  # Main stylesheet
└── js/
    └── chithra-main.js     # Main JavaScript
```

## Setup Instructions

### Step 1: Prepare Your Google Sheets Database

1. Create a Google Sheet with the following columns:
   - Song (or Title)
   - Movie (or Film/Album)
   - Year
   - Composer (or Music Director)
   - Co-Singer (or Cosinger/Singer)
   - Genre (or Category)
   - Language
   - Type (Film Song, Devotional, Classical, etc.)
   - YouTube (YouTube link)

2. Create separate sheets for:
   - Malayalam
   - Tamil
   - Telugu
   - Kannada
   - Hindi
   - Other Languages

3. Publish each sheet as CSV:
   - File → Share → Publish to web
   - Choose the specific sheet
   - Select "Comma-separated values (.csv)"
   - Copy the published URL

### Step 2: Update JavaScript Configuration

Open `js/chithra-main.js` and replace the placeholder URLs:

```javascript
const SHEETS_CONFIG = {
    malayalam: 'YOUR_MALAYALAM_SHEET_CSV_URL',
    tamil: 'YOUR_TAMIL_SHEET_CSV_URL',
    telugu: 'YOUR_TELUGU_SHEET_CSV_URL',
    kannada: 'YOUR_KANNADA_SHEET_CSV_URL',
    hindi: 'YOUR_HINDI_SHEET_CSV_URL',
    other: 'YOUR_OTHER_LANGUAGES_SHEET_CSV_URL'
};
```

### Step 3: Add Your Images

1. Add a photo of K.S. Chithra named `chithra.jpg` to the root directory
2. The image should be approximately 400x400px for best results

### Step 4: Customize Content

Update the following in the HTML files:
- Footer contact information (currently: sibinvk2007@gmail.com)
- Any specific statistics or facts you want to highlight
- Song counts in the language cards (currently estimates)

### Step 5: Create Additional Language Pages

For Tamil, Telugu, Kannada, and Hindi pages:
1. Copy `malayalam.html`
2. Rename to the appropriate language
3. Update the page header (title and description)
4. Change the icon emoji if desired

### Step 6: Deploy

#### GitHub Pages (Recommended):
1. Create a new repository on GitHub
2. Upload all files maintaining the folder structure
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repository-name`

#### Alternative Hosting:
- Upload to any web hosting service that supports static HTML
- Ensure folder structure is maintained

## Features

### Song Browsing
- Grid layout with song cards
- Thumbnail with play overlay
- Song details (movie, year, composer, co-singer)
- Genre tags and language badges
- YouTube video integration

### Advanced Filtering
- Quick filters (Recent, Classic, Golden Era, Modern)
- Filter by: Type, Language, Genre, Composer, Co-Singer, Decade
- Year range selection
- Real-time search across all fields
- Active filter display

### Mini Player
- Embedded YouTube player at bottom of page
- Minimize/maximize controls
- Song information display
- Smooth scrolling to player

### Responsive Design
- Mobile-friendly layout
- Tablet optimization
- Desktop full-width experience

## Customization Tips

### Changing Colors
Edit `css/chithra-styles.css` CSS variables:
```css
:root {
    --rose-deep: #C9184A;    /* Primary color */
    --rose-medium: #E63946;   /* Hover states */
    --gold-deep: #D4A574;     /* Accent color */
}
```

### Adding New Features
The JavaScript is modular and easy to extend:
- `createSongCard()`: Modify song card HTML
- `applyFilters()`: Add new filter logic
- `populateFilters()`: Add new filter dropdowns

### Statistics Page
You'll need to create similar statistics logic as in the original site, adapted for K.S. Chithra's data.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits

- Website Design & Development: Sibin.V.K
- Inspired by: K.J. Yesudas Tribute Website
- Data Source: Google Sheets
- Video Source: YouTube

## License

This is a fan tribute website. All music rights belong to their respective owners.

## Support

For issues or questions, contact: sibinvk2007@gmail.com

---

**A Tribute to the Legendary K.S. Chithra - The Nightingale of South India**

Celebrating over 40 years of musical excellence
