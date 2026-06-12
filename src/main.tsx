import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initTheme } from '@/lib/auth';

// Apply persisted theme before first render
initTheme();

createRoot(document.getElementById("root")!).render(<App />);
