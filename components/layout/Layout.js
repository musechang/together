import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, hideSearch = false, hideFooter = false }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar hideSearch={hideSearch} />
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
