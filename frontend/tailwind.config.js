/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0284C7', // Deep, professional sky blue
                    light: '#38BDF8',
                    dark: '#0369A1',
                    50: '#F0F9FF',
                },
                secondary: {
                    DEFAULT: '#059669', // Emerald
                    light: '#34D399',
                    dark: '#047857',
                    50: '#ECFDF5',
                },
                accent: {
                    DEFAULT: '#4F46E5', // Indigo
                    light: '#818CF8',
                    dark: '#4338CA',
                    50: '#EEF2FF',
                },
                background: '#F8FAFC',
                surface: '#FFFFFF',
                'surface-muted': '#F1F5F9',
                'text-main': '#0F172A',
                'text-muted': '#64748B',
                border: '#E2E8F0',
                error: '#EF4444',
                success: '#10B981',
                warning: '#F59E0B',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
                'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.03)',
                'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.4)',
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(198,93%,60%,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
}
