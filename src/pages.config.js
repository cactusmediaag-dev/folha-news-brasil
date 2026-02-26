/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Banners from './pages/Banners';
import Categoria from './pages/Categoria';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import HomeConfig from './pages/HomeConfig';
import Noticia from './pages/Noticia';
import Painel from './pages/Painel';
import PostEditor from './pages/PostEditor';
import Posts from './pages/Posts';
import Privacidade from './pages/Privacidade';
import Settings from './pages/Settings';
import Team from './pages/Team';
import WebPush from './pages/WebPush';
import WebStories from './pages/WebStories';
import Alertas from './pages/Alertas';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Banners": Banners,
    "Categoria": Categoria,
    "Dashboard": Dashboard,
    "Home": Home,
    "HomeConfig": HomeConfig,
    "Noticia": Noticia,
    "Painel": Painel,
    "PostEditor": PostEditor,
    "Posts": Posts,
    "Privacidade": Privacidade,
    "Settings": Settings,
    "Team": Team,
    "WebPush": WebPush,
    "WebStories": WebStories,
    "Alertas": Alertas,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};