import './sidebar.css'
import { BookOpen, Code, Home, Library, Menu, Settings, X } from 'lucide-react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { path: '/', icon: Home, label: '主页' },
    { path: '/typing', icon: BookOpen, label: '记单词' },
    { path: '/gallery', icon: Library, label: '词库' },
    { path: '/grammar', icon: Code, label: '语法' },
    { path: '/progress-editor', icon: Settings, label: '进度管理' },
  ]

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Qwerty Learner</h2>
          <button className="sidebar-toggle" onClick={onToggle}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  // 移动端点击后关闭侧边栏
                  if (window.innerWidth <= 768) {
                    onToggle()
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">快乐学习，每天进步</p>
        </div>
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default Sidebar
