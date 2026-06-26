/** @type {import('tailwindcss').Config} */
// Tailwind සැකසුම් - Mushroom Mate වර්ණ පද්ධතිය (color tokens)
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // පොහොර වර්ණ පැලට්ටුව (earthy farm palette)
        pine:   { DEFAULT: '#1f3d2b', 50:'#eef4ef', 100:'#d4e4d8', 600:'#2c5a3d', 700:'#1f3d2b', 800:'#16301f' },
        spore:  { DEFAULT: '#a7d129', 400:'#bce04a', 500:'#a7d129', 600:'#8bb31f' },
        clay:   { DEFAULT:'#c4622d', 500:'#c4622d', 600:'#a8501f' },
        cream:  { DEFAULT:'#f7f4ec', 100:'#fbf9f3', 200:'#f0ebdd' },
        soil:   { DEFAULT:'#3a2e26', 700:'#4a3b30' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(31,61,43,0.18)',
        card: '0 2px 12px -4px rgba(31,61,43,0.12)',
      },
      keyframes: {
        'fade-up': { '0%':{opacity:0,transform:'translateY(16px)'}, '100%':{opacity:1,transform:'translateY(0)'} },
        'fade-in': { '0%':{opacity:0}, '100%':{opacity:1} },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
      }
    },
  },
  plugins: [],
}
