const channels = [
  { id: "general", label: "general", description: "Community lounge" },
  { id: "coding", label: "coding", description: "Build and debug" },
  { id: "gaming", label: "gaming", description: "Queue up and unwind" },
  { id: "music", label: "music", description: "Tracks and playlists" },
];

function Sidebar({ activeChannel, onSelectChannel }) {
  return (
    <aside className="sidebar">
      <div className="server-pill">D</div>

      <div className="sidebar-panel">
        <div className="sidebar-header">
          <span>Discord Mini</span>
          <small>4 channels</small>
        </div>

        <div className="channel-group">
          <p className="section-label">Text channels</p>

          {channels.map((channel) => (
            <button
              className={`channel-button ${activeChannel === channel.id ? "active" : ""}`}
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
              type="button"
            >
              <span className="hash">#</span>
              <span>
                {channel.label}
                <small>{channel.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
