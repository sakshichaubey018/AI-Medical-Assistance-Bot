import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  ChevronRight, 
  X,
  PlusCircle
} from 'lucide-react';
import { getArticles, addArticle, deleteArticle } from '../utils/mockData';

export default function HealthTips({ isAdmin, triggerToast }) {
  const [articles, setArticles] = useState(getArticles());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // CMS Creator state
  const [showCMS, setShowCMS] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Daily Habits');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const refreshArticles = () => {
    setArticles(getArticles());
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    addArticle(newTitle, newCategory, newContent, newAuthor || undefined);
    
    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setShowCMS(false);
    
    refreshArticles();
    triggerToast("New article added to the Health Library!");
  };

  const handleDeleteArticle = (id) => {
    deleteArticle(id);
    refreshArticles();
    triggerToast("Article removed successfully.");
  };

  // Filtered Articles
  const filteredArticles = articles.filter(art => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Health Library</h1>
          <p className="page-subtitle">Learn tips, routines, and factual information about general wellness.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowCMS(!showCMS)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={16} /> {showCMS ? "Close CMS Editor" : "Create New Article"}
          </button>
        )}
      </div>

      {/* Admin CMS Panel */}
      {showCMS && isAdmin && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--primary-blue)' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            CMS Console: Publish Article
          </h3>
          
          <form onSubmit={handleCreateArticle}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Article Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Navigating Seasonal Allergies"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Daily Habits">Daily Habits</option>
                  <option value="Common Illnesses">Common Illnesses</option>
                  <option value="Mental Wellness">Mental Wellness</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Dr. John Watson (optional)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article Body Content</label>
              <textarea 
                className="form-input" 
                rows="6"
                placeholder="Write your health recommendations and explanations here..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCMS(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Daily Habits', 'Common Illnesses', 'Mental Wellness'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search health library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlignment: 'center', color: 'var(--text-light)' }}>
          No articles match your search parameters. Try adjusting filters.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredArticles.map(art => (
            <div key={art.id} className={`feature-card ${art.category === 'Daily Habits' ? 'feature-card-mint' : art.category === 'Common Illnesses' ? 'feature-card-sky' : art.category === 'Mental Wellness' ? 'feature-card-lavender' : 'feature-card-pink'}`} style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px' }}>
              <div>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  color: art.category === 'Daily Habits' ? 'var(--accent-emerald)' : art.category === 'Common Illnesses' ? 'var(--primary-blue)' : 'var(--accent-warning)' 
                }}>
                  {art.category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700', marginTop: '6px', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {art.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                  {art.content}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {art.author}
                </span>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteArticle(art.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-error)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center' }}
                      title="Delete Article"
                    >
                      Delete
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedArticle(art)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: '600', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Read More <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Article Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <span style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              color: selectedArticle.category === 'Daily Habits' ? 'var(--accent-emerald)' : selectedArticle.category === 'Common Illnesses' ? 'var(--primary-blue)' : 'var(--accent-warning)',
              display: 'block',
              marginBottom: '8px'
            }}>
              {selectedArticle.category}
            </span>
            
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>
              {selectedArticle.title}
            </h2>

            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-body)', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> By {selectedArticle.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Published {selectedArticle.date}</span>
            </div>

            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-heading)', whiteSpace: 'pre-line' }}>
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
