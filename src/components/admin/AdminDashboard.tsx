import React, { useState } from 'react';
import { AdminLayout, AdminTab } from './AdminLayout';
import { DashboardHome } from './DashboardHome';
import { PostsManager } from './PostsManager';
import { PostEditor } from './PostEditor';
import { CategoryManager } from './CategoryManager';
import { TickerManager } from './TickerManager';
import { MediaManager } from './MediaManager';
import { SettingsManager } from './SettingsManager';
import { FamilyManager } from './FamilyManager';
import { NewsArticle, CategoryItem, TickerItem, PhotoSlide, VideoSlide, SiteSettings, FamilyMember } from '../../types';
import {
  saveArticleToDb,
  deleteArticleFromDb,
  saveSiteSettingsToDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  saveTickerItemToDb,
  deleteTickerItemFromDb,
  savePhotoToDb,
  deletePhotoFromDb,
  saveVideoToDb,
  deleteVideoFromDb,
  saveFamilyMemberToDb,
  deleteFamilyMemberFromDb
} from '../../lib/firestoreService';

interface AdminDashboardProps {
  articles: NewsArticle[];
  categories: CategoryItem[];
  tickerItems: TickerItem[];
  photos: PhotoSlide[];
  videos: VideoSlide[];
  siteSettings: SiteSettings;
  familyMembers: FamilyMember[];
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  tickerItems,
  photos,
  videos,
  siteSettings,
  familyMembers,
  onExitAdmin,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  const handleNavigate = (tab: AdminTab, articleId?: string) => {
    if (articleId) {
      setEditingArticleId(articleId);
      setCurrentTab('edit-post');
    } else {
      if (tab === 'new-post') {
        setEditingArticleId(null);
      }
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generic wrapper to trigger auto-save status indicators
  const performSave = async <T,>(action: () => Promise<T>): Promise<T> => {
    setAutoSaveStatus('saving');
    try {
      const result = await action();
      setAutoSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString('bn-BD'));
      setTimeout(() => setAutoSaveStatus('idle'), 2500);
      return result;
    } catch (err) {
      console.error('Save action failed:', err);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 4000);
      throw err;
    }
  };

  // Article Actions
  const handleSaveArticle = async (article: Partial<NewsArticle> & { title: string }) => {
    return await performSave(async () => {
      const savedId = await saveArticleToDb(article);
      return savedId;
    });
  };

  const handleDeleteArticle = async (id: string) => {
    await performSave(async () => {
      await deleteArticleFromDb(id);
    });
  };

  const handleToggleLead = async (article: NewsArticle) => {
    await performSave(async () => {
      await saveArticleToDb({
        ...article,
        lead: !article.lead,
      });
    });
  };

  const handleToggleTicker = async (article: NewsArticle) => {
    await performSave(async () => {
      await saveArticleToDb({
        ...article,
        isTicker: !article.isTicker,
      });
    });
  };

  const handleQuickPost = async (title: string, content: string) => {
    await performSave(async () => {
      await saveArticleToDb({
        title,
        content,
        excerpt: content.slice(0, 150),
        category: 'জাতীয়',
        author: 'প্রধান সম্পাদক',
      });
    });
  };

  // Category Actions
  const handleSaveCategory = async (category: CategoryItem) => {
    await performSave(async () => {
      await saveCategoryToDb(category);
    });
  };

  const handleDeleteCategory = async (id: string) => {
    await performSave(async () => {
      await deleteCategoryFromDb(id);
    });
  };

  const handleAddCategoryByName = async (name: string) => {
    const newCat: CategoryItem = {
      id: 'cat-' + Date.now(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      order: categories.length + 1,
      visible: true,
    };
    await handleSaveCategory(newCat);
  };

  // Ticker Actions
  const handleSaveTickerItem = async (item: Partial<TickerItem>) => {
    return await performSave(async () => {
      return await saveTickerItemToDb(item);
    });
  };

  const handleDeleteTickerItem = async (id: string) => {
    await performSave(async () => {
      await deleteTickerItemFromDb(id);
    });
  };

  // Media Actions
  const handleSavePhoto = async (photo: Partial<PhotoSlide>) => {
    return await performSave(async () => {
      return await savePhotoToDb(photo);
    });
  };

  const handleDeletePhoto = async (id: string) => {
    await performSave(async () => {
      await deletePhotoFromDb(id);
    });
  };

  const handleSaveVideo = async (video: Partial<VideoSlide>) => {
    return await performSave(async () => {
      return await saveVideoToDb(video);
    });
  };

  const handleDeleteVideo = async (id: string) => {
    await performSave(async () => {
      await deleteVideoFromDb(id);
    });
  };

  // Settings Actions
  const handleSaveSettings = async (newSettings: Partial<SiteSettings>) => {
    await performSave(async () => {
      await saveSiteSettingsToDb(newSettings);
    });
  };

  // Family Members Actions
  const handleSaveFamilyMember = async (member: Partial<FamilyMember>) => {
    return await performSave(async () => {
      return await saveFamilyMemberToDb(member);
    });
  };

  const handleDeleteFamilyMember = async (id: string) => {
    await performSave(async () => {
      await deleteFamilyMemberFromDb(id);
    });
  };

  const currentArticleToEdit = editingArticleId
    ? articles.find((a) => a.id === editingArticleId) || null
    : null;

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={(tab) => handleNavigate(tab)}
      onExitAdmin={onExitAdmin}
      onLogout={onLogout}
      siteSettings={siteSettings}
      autoSaveStatus={autoSaveStatus}
      lastSavedText={lastSavedTime ? `সর্বশেষ সেভ: ${lastSavedTime}` : undefined}
    >
      {/* 1. Dashboard Home */}
      {currentTab === 'dashboard' && (
        <DashboardHome
          articles={articles}
          categoriesCount={categories.length}
          photosCount={photos.length}
          videosCount={videos.length}
          tickerCount={tickerItems.length}
          siteSettings={siteSettings}
          onNavigate={handleNavigate}
          onQuickPost={handleQuickPost}
          autoSaveStatus={autoSaveStatus}
        />
      )}

      {/* 2. All Posts */}
      {currentTab === 'posts' && (
        <PostsManager
          articles={articles}
          categories={categories}
          onNavigate={handleNavigate}
          onDeleteArticle={handleDeleteArticle}
          onToggleLead={handleToggleLead}
          onToggleTicker={handleToggleTicker}
        />
      )}

      {/* 3. New Post */}
      {currentTab === 'new-post' && (
        <PostEditor
          key="new-post-editor"
          initialArticle={null}
          categories={categories}
          onSaveArticle={handleSaveArticle}
          onNavigate={(tab) => handleNavigate(tab)}
          onAddCategory={handleAddCategoryByName}
          autoSaveStatus={autoSaveStatus}
        />
      )}

      {/* 4. Edit Post */}
      {currentTab === 'edit-post' && (
        <PostEditor
          key={`edit-post-${editingArticleId}`}
          initialArticle={currentArticleToEdit}
          categories={categories}
          onSaveArticle={handleSaveArticle}
          onNavigate={(tab) => handleNavigate(tab)}
          onAddCategory={handleAddCategoryByName}
          autoSaveStatus={autoSaveStatus}
        />
      )}

      {/* 5. Categories */}
      {currentTab === 'categories' && (
        <CategoryManager
          categories={categories}
          articles={articles}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* 6. Breaking Ticker */}
      {currentTab === 'ticker' && (
        <TickerManager
          tickerItems={tickerItems}
          onSaveTickerItem={handleSaveTickerItem}
          onDeleteTickerItem={handleDeleteTickerItem}
        />
      )}

      {/* 7. Photos */}
      {currentTab === 'media-photos' && (
        <MediaManager
          type="photos"
          photos={photos}
          videos={videos}
          onSavePhoto={handleSavePhoto}
          onDeletePhoto={handleDeletePhoto}
          onSaveVideo={handleSaveVideo}
          onDeleteVideo={handleDeleteVideo}
        />
      )}

      {/* 8. Videos */}
      {currentTab === 'media-videos' && (
        <MediaManager
          type="videos"
          photos={photos}
          videos={videos}
          onSavePhoto={handleSavePhoto}
          onDeletePhoto={handleDeletePhoto}
          onSaveVideo={handleSaveVideo}
          onDeleteVideo={handleDeleteVideo}
        />
      )}

      {/* 9. Site Settings & Admin Profile */}
      {(currentTab === 'settings' || currentTab === 'profile' || currentTab === 'users') && (
        <SettingsManager
          key={currentTab === 'profile' || currentTab === 'users' ? 'admin-profile-view' : 'portal-settings-view'}
          settings={siteSettings}
          onSaveSettings={handleSaveSettings}
          autoSaveStatus={autoSaveStatus}
          initialSubTab={currentTab === 'profile' || currentTab === 'users' ? 'profile' : 'general'}
        />
      )}

      {/* 10. Our Family Members */}
      {currentTab === 'family' && (
        <FamilyManager
          members={familyMembers}
          onSaveMember={handleSaveFamilyMember}
          onDeleteMember={handleDeleteFamilyMember}
        />
      )}
    </AdminLayout>
  );
};
