import './settings.css'
import { useState } from 'react'

// 暂时使用简单的实现来测试
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sound')

  const tabs = [
    { id: 'sound', label: '音效设置' },
    { id: 'advanced', label: '高级设置' },
    { id: 'view', label: '显示设置' },
    { id: 'data', label: '数据设置' },
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">设置</h1>
        <p className="settings-subtitle">自定义你的学习体验</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          <div className="settings-content-wrapper">
            <p>当前选中的设置: {activeTab}</p>
            <p>设置功能正在开发中...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
