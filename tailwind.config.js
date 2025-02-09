/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#12263F',
        greylight:'#8A8A8A',
        greyThinlight:'#F4F4F4',
        grey:'#8A8894',
        blackDark:'#181818',
        blackDdark:'#202224',
        danger:'#EA0234',
        darklight:'#19334b',
      },
    },
  },
  plugins: [],
}

