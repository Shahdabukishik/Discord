function Navbar({ channel, user, onLogout, connected }) {
  return (
    <header className="navbar">
      <div>
        <p className="section-label">Current channel</p>
        <h1>
          <span>#</span> {channel}
        </h1>
      </div>

      <div className="nav-actions">
        <span className={`status-dot ${connected ? "online" : ""}`} />
        <span className="username">{user?.username}</span>
        <button className="ghost-button" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
