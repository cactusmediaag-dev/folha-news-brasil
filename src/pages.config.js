import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import PostEditor from './pages/PostEditor';
import Banners from './pages/Banners';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Posts": Posts,
    "PostEditor": PostEditor,
    "Banners": Banners,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};