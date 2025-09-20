import React, { useState } from 'react';
import { useDemoAuth } from '../contexts/DemoAuthContext';

const DemoAdminPanel = () => {
  const {
    isAdmin,
    connectedUsers,
    sessionSettings,
    kickUser,
    toggleUserEditPermission,
    updateSessionSettings,
    closeSessionForAll
  } = useDemoAuth();

  const [showPanel, setShowPanel] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  if (!isAdmin()) {
    return null; // Don't render anything if not admin
  }

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const showConfirmDialog = (action, message) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setShowConfirmModal(true);
  };

  const onlineUsers = connectedUsers.filter(user => user.online);
  const regularUsers = onlineUsers.filter(user => user.role !== 'admin');

  return (
    <>
      {/* Admin Panel Toggle Button */}
      <button
        className="admin-toggle-btn"
        onClick={() => setShowPanel(!showPanel)}
        title="Panel de Administrador"
      >
        👑 Admin
      </button>

      {/* Admin Panel */}
      {showPanel && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3>Panel de Administrador</h3>
            <button 
              className="close-btn"
              onClick={() => setShowPanel(false)}
            >
              ×
            </button>
          </div>

          <div className="admin-panel-content">
            {/* Connected Users Section */}
            <div className="admin-section">
              <h4>Usuarios Conectados ({onlineUsers.length})</h4>
              <div className="users-list">
                {onlineUsers.map(user => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className={`user-role ${user.role}`}>
                        {user.role === 'admin' ? '👑' : '👤'}
                      </span>
                      {user.canEdit && <span className="edit-badge">✏️</span>}
                    </div>
                    {user.role !== 'admin' && (
                      <div className="user-actions">
                        <button
                          className="btn btn-small"
                          onClick={() => toggleUserEditPermission(user.id)}
                          title={user.canEdit ? 'Revocar edición' : 'Permitir edición'}
                        >
                          {user.canEdit ? '🚫' : '✏️'}
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => showConfirmDialog(
                            () => kickUser(user.id),
                            `¿Expulsar a ${user.name}? (volverá a conectarse en 3 segundos para la demo)`
                          )}
                          title="Expulsar usuario"
                        >
                          🚪
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {regularUsers.length === 0 && (
                  <p className="no-users">No hay usuarios regulares conectados</p>
                )}
              </div>
            </div>

            {/* Session Controls Section */}
            <div className="admin-section">
              <h4>Controles de Sesión</h4>
              <div className="session-controls">
                <div className="control-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={sessionSettings.chatLocked}
                      onChange={(e) => updateSessionSettings({ chatLocked: e.target.checked })}
                    />
                    <span>Bloquear Chat</span>
                  </label>
                </div>
                <div className="control-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={sessionSettings.postitsLocked}
                      onChange={(e) => updateSessionSettings({ postitsLocked: e.target.checked })}
                    />
                    <span>Bloquear Post-its</span>
                  </label>
                </div>
                <div className="control-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={sessionSettings.editingLocked}
                      onChange={(e) => updateSessionSettings({ editingLocked: e.target.checked })}
                    />
                    <span>Bloquear Edición General</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="admin-section">
              <h4>Estado de la Sesión</h4>
              <div className="status-grid">
                <div className={`status-item ${sessionSettings.chatLocked ? 'locked' : 'unlocked'}`}>
                  <span className="status-icon">{sessionSettings.chatLocked ? '🔒' : '💬'}</span>
                  <span>Chat {sessionSettings.chatLocked ? 'Bloqueado' : 'Activo'}</span>
                </div>
                <div className={`status-item ${sessionSettings.postitsLocked ? 'locked' : 'unlocked'}`}>
                  <span className="status-icon">{sessionSettings.postitsLocked ? '🔒' : '📝'}</span>
                  <span>Post-its {sessionSettings.postitsLocked ? 'Bloqueados' : 'Activos'}</span>
                </div>
                <div className={`status-item ${sessionSettings.editingLocked ? 'locked' : 'unlocked'}`}>
                  <span className="status-icon">{sessionSettings.editingLocked ? '🔒' : '✏️'}</span>
                  <span>Edición {sessionSettings.editingLocked ? 'Bloqueada' : 'Activa'}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="admin-section danger-zone">
              <h4>Zona Peligrosa</h4>
              <button
                className="btn btn-danger btn-full"
                onClick={() => showConfirmDialog(
                  closeSessionForAll,
                  '¿Cerrar la sesión para todos los usuarios? Esta acción expulsará a todos los usuarios. (Se reconectarán en 5 segundos para la demo)'
                )}
              >
                🔒 Cerrar Sesión para Todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>Confirmar Acción</h3>
            <p>{confirmMessage}</p>
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmAction}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoAdminPanel;