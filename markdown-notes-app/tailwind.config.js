/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        // 三栏深灰层次：侧边栏最深，编辑器与侧边栏同色，预览区稍浅
        panel: {
          sidebar: '#161618',
          editor: '#161618',
          preview: '#1f1f23',
          modal: '#1c1c1f',
          modalBorder: 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
  },
  plugins: [],
}
