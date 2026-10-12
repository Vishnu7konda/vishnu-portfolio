import { useState, useEffect } from 'react';

// Available Font Awesome icons for skills
const SKILL_ICONS = [
  { label: 'HTML5',      value: 'fab fa-html5' },
  { label: 'CSS3',       value: 'fab fa-css3-alt' },
  { label: 'JavaScript', value: 'fab fa-js' },
  { label: 'React',      value: 'fab fa-react' },
  { label: 'Node.js',    value: 'fab fa-node-js' },
  { label: 'Python',     value: 'fab fa-python' },
  { label: 'GitHub',     value: 'fab fa-github' },
  { label: 'Docker',     value: 'fab fa-docker' },
  { label: 'AWS',        value: 'fab fa-aws' },
  { label: 'Server',     value: 'fas fa-server' },
  { label: 'Database',   value: 'fas fa-database' },
  { label: 'Mobile',     value: 'fas fa-mobile-alt' },
  { label: 'Design',     value: 'fas fa-palette' },
  { label: 'Cloud',      value: 'fas fa-cloud' },
  { label: 'Code',       value: 'fas fa-code' },
  { label: 'AI/Brain',   value: 'fas fa-brain' },
  { label: 'Security',   value: 'fas fa-shield-alt' },
  { label: 'Terminal',   value: 'fas fa-terminal' },
  { label: 'Globe',      value: 'fas fa-globe' },
  { label: 'Wrench',     value: 'fas fa-wrench' },
];

// ── API helpers ──────────────────────────────────────────────────────────────
function makeApi(token) {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  return {
    get:    (url)       => fetch(url).then((r) => r.json()),
    post:   (url, body) => fetch(url, { method: 'POST',   headers: h, body: JSON.stringify(body) }).then((r) => r.json()),
    put:    (url, body) => fetch(url, { method: 'PUT',    headers: h, body: JSON.stringify(body) }).then((r) => r.json()),
    delete: (url)       => fetch(url, { method: 'DELETE', headers: h }).then((r) => r.json()),
  };
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`ad-toast ad-toast-${toast.type}`}>
      <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
      {toast.msg}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="ad-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ad-modal">{children}</div>
    </div>
  );
}

// ── Skill Form ───────────────────────────────────────────────────────────────
function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    id:   initial?.id   || undefined,
    icon: initial?.icon || 'fas fa-code',
    title: initial?.title || '',
    desc:  initial?.desc  || '',
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="ad-form">
      <div className="ad-form-header">
        <h2><i className="fas fa-code"></i> {initial ? 'Edit Skill' : 'Add New Skill'}</h2>
        <button className="ad-close" onClick={onCancel} aria-label="Close"><i className="fas fa-times"></i></button>
      </div>

      {/* Icon picker */}
      <div className="ad-field">
        <label>Icon <span className="ad-hint">— click to select or type custom class below</span></label>
        <div className="ad-icon-preview">
          <i className={form.icon}></i>
          <code>{form.icon}</code>
        </div>
        <div className="ad-icon-grid">
          {SKILL_ICONS.map((ic) => (
            <button
              key={ic.value}
              type="button"
              className={`ad-icon-opt ${form.icon === ic.value ? 'selected' : ''}`}
              onClick={() => set('icon', ic.value)}
              title={ic.label}
            >
              <i className={ic.value}></i>
              <span>{ic.label}</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Custom icon class (e.g. fas fa-star)"
          value={form.icon}
          onChange={(e) => set('icon', e.target.value)}
          className="ad-input"
        />
      </div>

      <div className="ad-field">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. Frontend Development"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className="ad-input"
        />
      </div>

      <div className="ad-field">
        <label>Description</label>
        <textarea
          placeholder="Brief description of this skill..."
          value={form.desc}
          onChange={(e) => set('desc', e.target.value)}
          rows={3}
          className="ad-input"
        />
      </div>

      <div className="ad-form-actions">
        <button className="ad-btn ad-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="ad-btn ad-btn-primary" onClick={() => onSave(form)} disabled={!form.title}>
          <i className="fas fa-save"></i> {initial ? 'Update' : 'Add'} Skill
        </button>
      </div>
    </div>
  );
}

// ── Project Form ─────────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    id:        initial?.id        || undefined,
    title:     initial?.title     || '',
    desc:      initial?.desc      || '',
    image:     initial?.image     || '',
    alt:       initial?.alt       || '',
    liveUrl:   initial?.liveUrl   || '',
    githubUrl: initial?.githubUrl || '#',
    tech: Array.isArray(initial?.tech) ? initial.tech.join(', ') : (initial?.tech || ''),
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);
    
    set('image', 'Uploading...');
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set('image', data.url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
      set('image', '');
    }
  };

  return (
    <div className="ad-form">
      <div className="ad-form-header">
        <h2><i className="fas fa-briefcase"></i> {initial ? 'Edit Project' : 'Add New Project'}</h2>
        <button className="ad-close" onClick={onCancel} aria-label="Close"><i className="fas fa-times"></i></button>
      </div>

      <div className="ad-form-grid">
        <div className="ad-field ad-field-full">
          <label>Project Title</label>
          <input type="text" placeholder="My Awesome Project" value={form.title} onChange={(e) => set('title', e.target.value)} className="ad-input" />
        </div>

        <div className="ad-field">
          <label>Image URL / Path <span className="ad-hint">— or upload from device</span></label>
          <div className="ad-upload-row">
            <input type="text" placeholder="/image.png or https://example.com/img.png" value={form.image} onChange={(e) => set('image', e.target.value)} className="ad-input" />
            <label className="ad-btn ad-btn-ghost ad-upload-btn">
              <i className="fas fa-upload"></i> Upload
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </div>
          {form.image && form.image !== 'Uploading...' && (
            <img
              src={form.image} alt="preview"
              className="ad-img-preview"
              onError={(e) => { e.target.style.opacity = '0.3'; }}
            />
          )}
          {form.image === 'Uploading...' && (
            <div className="ad-uploading">
              <i className="fas fa-spinner fa-spin"></i> Uploading image...
            </div>
          )}
        </div>

        <div className="ad-field">
          <label>Image Alt Text</label>
          <input type="text" placeholder="Description of the image" value={form.alt} onChange={(e) => set('alt', e.target.value)} className="ad-input" />
        </div>

        <div className="ad-field">
          <label>Live Demo URL</label>
          <input type="url" placeholder="https://myproject.netlify.app" value={form.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} className="ad-input" />
        </div>

        <div className="ad-field">
          <label>GitHub URL</label>
          <input type="text" placeholder="https://github.com/user/repo or #" value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} className="ad-input" />
        </div>

        <div className="ad-field ad-field-full">
          <label>Tech Stack <span className="ad-hint">— comma separated</span></label>
          <input type="text" placeholder="React, Node.js, MongoDB, Express" value={form.tech} onChange={(e) => set('tech', e.target.value)} className="ad-input" />
        </div>
      </div>

      <div className="ad-field">
        <label>Description</label>
        <textarea placeholder="Describe what this project does..." value={form.desc} onChange={(e) => set('desc', e.target.value)} rows={4} className="ad-input" />
      </div>

      <div className="ad-form-actions">
        <button className="ad-btn ad-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="ad-btn ad-btn-primary" onClick={() => onSave(form)} disabled={!form.title}>
          <i className="fas fa-save"></i> {initial ? 'Update' : 'Add'} Project
        </button>
      </div>
    </div>
  );
}

// ── Skills Section ───────────────────────────────────────────────────────────
function SkillsSection({ skills, onAdd, onEdit, onDelete }) {
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <div>
          <h2>Skills &amp; Expertise</h2>
          <p>{skills.length} skill{skills.length !== 1 ? 's' : ''} currently displayed</p>
        </div>
        <button className="ad-btn ad-btn-primary" onClick={onAdd}>
          <i className="fas fa-plus"></i> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="ad-empty">
          <i className="fas fa-code"></i>
          <p>No skills yet — add your first one!</p>
        </div>
      ) : (
        <div className="ad-skill-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="ad-skill-card">
              <div className="ad-skill-icon"><i className={skill.icon}></i></div>
              <div className="ad-skill-body">
                <h3>{skill.title}</h3>
                <p>{skill.desc}</p>
              </div>
              <div className="ad-actions">
                <button className="ad-act ad-act-edit"   title="Edit"   onClick={() => onEdit(skill)}>
                  <i className="fas fa-pen"></i>
                </button>
                <button className="ad-act ad-act-delete" title="Delete" onClick={() => onDelete(skill.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection({ projects, onAdd, onEdit, onDelete }) {
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <div>
          <h2>Featured Projects</h2>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''} currently displayed</p>
        </div>
        <button className="ad-btn ad-btn-primary" onClick={onAdd}>
          <i className="fas fa-plus"></i> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="ad-empty">
          <i className="fas fa-briefcase"></i>
          <p>No projects yet — add your first one!</p>
        </div>
      ) : (
        <div className="ad-proj-list">
          {projects.map((project) => (
            <div key={project.id} className="ad-proj-card">
              <div className="ad-proj-img">
                <img
                  src={project.image} alt={project.alt || project.title}
                  onError={(e) => { e.target.src = 'https://placehold.co/120x70?text=No+Image'; }}
                />
              </div>
              <div className="ad-proj-info">
                <h3>{project.title}</h3>
                <p>{project.desc?.substring(0, 110)}{project.desc?.length > 110 ? '…' : ''}</p>
                <div className="ad-tags">
                  {(project.tech || []).map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="ad-proj-links">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="ad-proj-link">
                      <i className="fas fa-external-link-alt"></i> Live
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="ad-proj-link">
                      <i className="fab fa-github"></i> GitHub
                    </a>
                  )}
                </div>
              </div>
              <div className="ad-actions">
                <button className="ad-act ad-act-edit"   title="Edit"   onClick={() => onEdit(project)}>
                  <i className="fas fa-pen"></i>
                </button>
                <button className="ad-act ad-act-delete" title="Delete" onClick={() => onDelete(project.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Admin Dashboard (main) ───────────────────────────────────────────────────
export default function AdminDashboard({ token, onLogout }) {
  const [tab,      setTab]      = useState('skills');
  const [skills,   setSkills]   = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const [modal,    setModal]    = useState(null); // {type:'skill'|'project', data:null|item}

  const api = makeApi(token);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get('/api/data')
      .then((d) => { setSkills(d.skills || []); setProjects(d.projects || []); })
      .catch(() => notify('Failed to load data', 'error'))
      .finally(() => setLoading(false));
  }, []);

  // ── Skills CRUD ──
  const saveSkill = async (form) => {
    try {
      if (form.id) {
        const updated = await api.put(`/api/admin/skills/${form.id}`, form);
        setSkills((p) => p.map((s) => (s.id === form.id ? updated : s)));
        notify('Skill updated!');
      } else {
        const created = await api.post('/api/admin/skills', form);
        setSkills((p) => [...p, created]);
        notify('Skill added!');
      }
      setModal(null);
    } catch { notify('Failed to save skill', 'error'); }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await api.delete(`/api/admin/skills/${id}`);
    setSkills((p) => p.filter((s) => s.id !== id));
    notify('Skill deleted');
  };

  // ── Projects CRUD ──
  const saveProject = async (form) => {
    const data = {
      ...form,
      tech: typeof form.tech === 'string'
        ? form.tech.split(',').map((t) => t.trim()).filter(Boolean)
        : form.tech,
    };
    try {
      if (data.id) {
        const updated = await api.put(`/api/admin/projects/${data.id}`, data);
        setProjects((p) => p.map((pr) => (pr.id === data.id ? updated : pr)));
        notify('Project updated!');
      } else {
        const created = await api.post('/api/admin/projects', data);
        setProjects((p) => [...p, created]);
        notify('Project added!');
      }
      setModal(null);
    } catch { notify('Failed to save project', 'error'); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/api/admin/projects/${id}`);
    setProjects((p) => p.filter((pr) => pr.id !== id));
    notify('Project deleted');
  };

  return (
    <div className="ad-layout">
      <Toast toast={toast} />

      {/* ── Header ── */}
      <header className="ad-header">
        <div className="ad-header-brand">
          <span className="ad-brand-icon">VK</span>
          <div>
            <span className="ad-brand-title">Portfolio Admin</span>
            <span className="ad-brand-sub">Manage skills &amp; projects</span>
          </div>
        </div>
        <div className="ad-header-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn-ghost ad-btn-sm">
            <i className="fas fa-external-link-alt"></i> View Site
          </a>
          <button className="ad-btn ad-btn-danger ad-btn-sm" onClick={onLogout}>
            <i className="fas fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="ad-tabs-bar">
        <button
          className={`ad-tab ${tab === 'skills' ? 'active' : ''}`}
          onClick={() => setTab('skills')}
        >
          <i className="fas fa-code"></i> Skills
          <span className="ad-count">{skills.length}</span>
        </button>
        <button
          className={`ad-tab ${tab === 'projects' ? 'active' : ''}`}
          onClick={() => setTab('projects')}
        >
          <i className="fas fa-briefcase"></i> Projects
          <span className="ad-count">{projects.length}</span>
        </button>
      </div>

      {/* ── Main content ── */}
      <main className="ad-main">
        {loading ? (
          <div className="ad-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading data…</span>
          </div>
        ) : tab === 'skills' ? (
          <SkillsSection
            skills={skills}
            onAdd={() => setModal({ type: 'skill', data: null })}
            onEdit={(s) => setModal({ type: 'skill', data: s })}
            onDelete={deleteSkill}
          />
        ) : (
          <ProjectsSection
            projects={projects}
            onAdd={() => setModal({ type: 'project', data: null })}
            onEdit={(p) => setModal({ type: 'project', data: p })}
            onDelete={deleteProject}
          />
        )}
      </main>

      {/* ── Modal ── */}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === 'skill' ? (
            <SkillForm initial={modal.data} onSave={saveSkill} onCancel={() => setModal(null)} />
          ) : (
            <ProjectForm initial={modal.data} onSave={saveProject} onCancel={() => setModal(null)} />
          )}
        </Modal>
      )}
    </div>
  );
}
