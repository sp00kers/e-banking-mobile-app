import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import './FamilyAssistPage.css';

const INITIAL_FAMILY_MEMBERS = [
  { id: 1, name: 'John', relation: 'Son', connected: true, avatar: '👨' },
  { id: 2, name: 'May', relation: 'Daughter', connected: true, avatar: '👩' },
];

const MOCK_TRANSACTIONS = [
  { id: 'ft1', date: '2026-04-10', description: 'Supermarket', amount: -67.80 },
  { id: 'ft2', date: '2026-04-09', description: 'Social Security', amount: 1850.00 },
  { id: 'ft3', date: '2026-04-08', description: 'Medical Center', amount: -35.50 },
  { id: 'ft4', date: '2026-04-06', description: 'Electric Company', amount: -98.25 },
];

function FamilyAssistPage({ accountBalance, onBack }) {
  const { t } = useTranslation();

  const [familyMembers, setFamilyMembers] = useState(INITIAL_FAMILY_MEMBERS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [familyAssistEnabled, setFamilyAssistEnabled] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null); // 'remove' | 'emergency' | null
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');

  const handleToggleFamilyAssist = () => {
    if (familyAssistEnabled) {
      setShowConfirmDialog('disableAll');
    } else {
      setFamilyAssistEnabled(true);
      setFamilyMembers(prev => prev.map(m => ({ ...m, connected: true })));
    }
  };

  const handleSelectMember = (member) => {
    if (!member.connected || !familyAssistEnabled) return;
    setSelectedMember(member);
  };

  const handleRemoveAccess = () => {
    if (!selectedMember) return;
    setShowConfirmDialog('remove');
  };

  const handleEmergencyStop = () => {
    setShowConfirmDialog('emergency');
  };

  const confirmAction = () => {
    if (showConfirmDialog === 'remove' && selectedMember) {
      setFamilyMembers(prev =>
        prev.map(m => m.id === selectedMember.id ? { ...m, connected: false } : m)
      );
      setSelectedMember(null);
    } else if (showConfirmDialog === 'emergency' || showConfirmDialog === 'disableAll') {
      setFamilyMembers(prev => prev.map(m => ({ ...m, connected: false })));
      setFamilyAssistEnabled(false);
      setSelectedMember(null);
    }
    setShowConfirmDialog(null);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRelation.trim()) return;
    const avatars = ['👨', '👩', '🧑', '👴', '👵', '🧓'];
    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      relation: newMemberRelation.trim(),
      connected: true,
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    };
    setFamilyMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberRelation('');
    setShowAddForm(false);
  };

  return (
    <div className="family-assist-screen">
      <button onClick={onBack} className="return-btn">
        {t('common.returnHome')}
      </button>

      <div className="family-assist-header">
        <h2>👨‍👩‍👦 {t('family.title')}</h2>
      </div>

      {/* Toggle Switch */}
      <div className="family-toggle-card">
        <div className="toggle-info">
          <span className="toggle-label">{t('family.toggleLabel')}</span>
          <span className={`toggle-status ${familyAssistEnabled ? 'enabled' : 'disabled'}`}>
            {familyAssistEnabled ? t('family.enabled') : t('family.disabled')}
          </span>
        </div>
        <button
          className={`toggle-switch ${familyAssistEnabled ? 'on' : 'off'}`}
          onClick={handleToggleFamilyAssist}
          aria-label="Toggle Family Assist Mode"
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {familyAssistEnabled && (
        <>
          {/* Section 1: Family Members List */}
          <div className="family-section-card">
            <h3>{t('family.membersTitle')}</h3>
            <div className="family-members-list">
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  className={`family-member-row ${selectedMember?.id === member.id ? 'selected' : ''} ${!member.connected ? 'disconnected' : ''}`}
                  onClick={() => handleSelectMember(member)}
                  disabled={!member.connected}
                >
                  <span className="member-avatar">{member.avatar}</span>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-relation">– {member.relation}</span>
                  </div>
                  <span className={`member-dot ${member.connected ? 'dot-green' : 'dot-red'}`} />
                </button>
              ))}
            </div>

            {!showAddForm ? (
              <button className="add-member-btn" onClick={() => setShowAddForm(true)}>
                ➕ {t('family.addMember')}
              </button>
            ) : (
              <div className="add-member-form">
                <div className="add-member-fields">
                  <input
                    type="text"
                    placeholder={t('family.namePlaceholder')}
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="add-member-input"
                  />
                  <input
                    type="text"
                    placeholder={t('family.relationPlaceholder')}
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="add-member-input"
                  />
                </div>
                <div className="add-member-actions">
                  <button className="add-confirm-btn" onClick={handleAddMember}>
                    ✅ {t('family.confirmAdd')}
                  </button>
                  <button className="add-cancel-btn" onClick={() => { setShowAddForm(false); setNewMemberName(''); setNewMemberRelation(''); }}>
                    {t('confirm.cancelButton')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Selected Family Member View */}
          {selectedMember && (
            <div className="family-section-card viewer-panel">
              <h3>👁️ {t('family.viewingTitle', { name: selectedMember.name })}</h3>
              <div className="view-only-badge">
                ⚠️ {t('family.viewOnlyWarning')}
              </div>

              <div className="viewer-balance-card">
                <div className="viewer-balance-label">{t('overview.balanceTitle')}</div>
                <div className="viewer-balance-value">RM {(accountBalance || 5200).toFixed(2)}</div>
              </div>

              <div className="viewer-transactions">
                <h4>{t('family.recentTransactions')}</h4>
                {MOCK_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="viewer-tx-row">
                    <div className="viewer-tx-info">
                      <span className="viewer-tx-desc">{tx.description}</span>
                      <span className="viewer-tx-date">{tx.date}</span>
                    </div>
                    <span className={`viewer-tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                      {tx.amount > 0 ? '+' : '-'}RM {Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog family-confirm-dialog">
            <div className="family-confirm-icon">
              {showConfirmDialog === 'emergency' || showConfirmDialog === 'disableAll' ? '🛑' : '🚫'}
            </div>
            <h3>
              {showConfirmDialog === 'remove'
                ? t('family.confirmRemoveTitle')
                : showConfirmDialog === 'emergency'
                ? t('family.confirmEmergencyTitle')
                : t('family.confirmDisableTitle')}
            </h3>
            <p>
              {showConfirmDialog === 'remove'
                ? `${t('family.confirmRemoveMsg')} ${selectedMember?.name}?`
                : showConfirmDialog === 'emergency'
                ? t('family.confirmEmergencyMsg')
                : t('family.confirmDisableMsg')}
            </p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={() => setShowConfirmDialog(null)}>
                {t('confirm.cancelButton')}
              </button>
              <button
                className={`confirm-btn ${showConfirmDialog !== 'remove' ? 'emergency-confirm' : ''}`}
                onClick={confirmAction}
              >
                {showConfirmDialog === 'remove'
                  ? t('family.confirmRemoveBtn')
                  : t('family.confirmEmergencyBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyAssistPage;
