import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function AppLayout({ children, showFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="app" />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
