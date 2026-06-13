import { useState } from 'react';
import { useTemplates } from '../context/TemplateContext';
import { useToast } from '../context/ToastContext';

function RippleButton({ children, className, onClick, ...props }) {
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
    if (onClick) onClick(event);
  };
  return <button className={className} onClick={createRipple} {...props}>{children}</button>;
}

export default function TemplatesScreen() {
  const {
    eventFolders = [],
    eventFolder,
    setEventFolder,
    addEventFolder,
    updateEventFolder,
    deleteEventFolder,
  } = useTemplates();
  const addToast = useToast();
  const [newFolderName, setNewFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  const handleCreate = () => {
    const created = addEventFolder(newFolderName);
    if (created) {
      setNewFolderName('');
      setRenameValue('');
      addToast('Event folder created', 'success');
    } else {
      addToast('Enter a folder name first.', 'warning');
    }
  };

  const handleUpdate = () => {
    if (!eventFolder) {
      addToast('Select a folder to rename.', 'warning');
      return;
    }
    if (updateEventFolder(eventFolder, renameValue || eventFolder)) {
      setRenameValue('');
      addToast('Event folder updated', 'success');
    } else {
      addToast('Enter a new folder name.', 'warning');
    }
  };

  const handleDelete = () => {
    if (!eventFolder) {
      addToast('Select a folder to delete.', 'warning');
      return;
    }
    if (deleteEventFolder(eventFolder)) {
      addToast('Event folder deleted', 'success');
    }
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Event Folders</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create, rename, and remove event folders for your saved cards.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="material-icons" style={{ color: 'var(--primary)' }}>folder_special</span>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Manage Event Folders</h3>
        </div>

        <div className="form-group">
          <select
            className="form-input"
            value={eventFolder}
            onChange={e => setEventFolder(e.target.value)}
            style={{ appearance: 'auto' }}
          >
            <option value="">Select an event folder</option>
            {eventFolders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
          <label className="form-label">Current Folder</label>
        </div>

        <div className="form-group">
          <input
            className="form-input"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="Summer Expo 2026"
          />
          <label className="form-label">Create New Folder</label>
        </div>

        <div className="form-group">
          <input
            className="form-input"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            placeholder="New folder name"
          />
          <label className="form-label">Rename Selected Folder</label>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <RippleButton className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Create</RippleButton>
          <RippleButton className="btn btn-outline" style={{ flex: 1 }} onClick={handleUpdate}>Update</RippleButton>
          <RippleButton className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Delete</RippleButton>
        </div>
      </div>
    </div>
  );
}
