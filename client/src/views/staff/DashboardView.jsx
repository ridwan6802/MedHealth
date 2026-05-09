import { Link } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function DashboardView() {
  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <header className="dashboard-header staff-header">
          <h1>Welcome, Staff</h1>
          <p>Manage pharmacy operations efficiently</p>
        </header>

        <section className="dashboard-cards staff-dashboard-grid">
          <Link to="/staff/orders" className="card dashboard-card"><h3>Manage Orders</h3><p>View and process customer orders.</p></Link>
          <a href="/staff/notifications" className="card dashboard-card"><h3>Send Notifications</h3><p>Send notifications to the admin team.</p></a>
          <a href="/staff/messages" className="card dashboard-card"><h3>Messages</h3><p>View and respond to customer messages.</p></a>
          <Link to="/staff/medicines" className="card dashboard-card"><h3>Medicine List</h3><p>View and manage medicine inventory.</p></Link>
        </section>
      </div>
    </main>
  );
}
