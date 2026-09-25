import { getItem, setItem, STORAGE_KEYS, DEFAULT_ARTICLES } from './storage';

export const getArticles = () => {
  return getItem(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
};

export const addArticle = (title, category, content, author) => {
  const articles = getItem(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  const newArt = {
    id: "art-" + Math.random().toString(36).substr(2, 9),
    title,
    category,
    content,
    author: author || "Staff Admin",
    date: new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })
  };
  articles.unshift(newArt);
  setItem(STORAGE_KEYS.ARTICLES, articles);
  return newArt;
};

export const deleteArticle = (artId) => {
  let articles = getItem(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  articles = articles.filter(a => a.id !== artId);
  setItem(STORAGE_KEYS.ARTICLES, articles);
};
