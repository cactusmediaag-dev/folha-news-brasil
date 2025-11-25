import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import PostEditor from './pages/PostEditor';
import Banners from './pages/Banners';
import WebPush from './pages/WebPush';
import Team from './pages/Team';
import HomeConfig from './pages/HomeConfig';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Posts": Posts,
    "PostEditor": PostEditor,
    "Banners": Banners,
    "WebPush": WebPush,
    "Team": Team,
    "HomeConfig": HomeConfig,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};