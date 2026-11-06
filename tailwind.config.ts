import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0B0C10',
        acid: '#C4FF36',
        coral: '#FF5B42',
        cyber: '#FFDA35',
        violet: '#725BFF',
        paper: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        brutal: '6px 6px 0px #C4FF36',
        'brutal-coral': '6px 6px 0px #FF5B42',
        'brutal-violet': '6px 6px 0px #725BFF',
        'brutal-cyber': '6px 6px 0px #FFDA35',
      },
    },
  },
  plugins: [],
};

export default config;
