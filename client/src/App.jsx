import AppRouter from './routes/AppRouter';
import SiteFooter from './components/SiteFooter';

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-content">
        <AppRouter />
      </div>
      <SiteFooter />
    </div>
  );
}
