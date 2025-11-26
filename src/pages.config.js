import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import PostEditor from './pages/PostEditor';
import Banners from './pages/Banners';
import WebPush from './pages/WebPush';
import Team from './pages/Team';
import HomeConfig from './pages/HomeConfig';
import Settings from './pages/Settings';
import Painel from './pages/Painel';
import Home from './pages/Home';
import Noticia from './pages/Noticia';
import Categoria from './pages/Categoria';
import WebStories from './pages/WebStories';
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
    "Painel": Painel,
    "Home": Home,
    "Noticia": Noticia,
    "Categoria": Categoria,
    "WebStories": WebStories,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};