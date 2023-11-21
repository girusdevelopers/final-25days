import HomeRoute from '@routes/index.route';
import audioRoutes from "@routes/audio.route";
import userRoutes from "@routes/user.route"
import adminRoutes from "@routes/admin.route"
import S3Routes from "@routes/magazine.route"
import bannerRoutes from "@routes/banner.route"
import MessageRoutes from "@routes/message.route"
import articleRoutes from "@routes/article.route"
import SearchRoute from "@routes/search.route"
import audioMessageRoute from "@routes/audiomessage.route"


const routes = [
  {
    path: '/home',
    func: HomeRoute,
  },
  {
    path: '/audio',
    func: audioRoutes,
  },
  // {
  //   path: '/user',
  //   func: userRoutes,
  // },

  {
    path: '/admin',
    func: adminRoutes,
  },
  {
    path: '/magazine',
    func: S3Routes,
  },
  {
    path: '/banner',
    func: bannerRoutes,
  },
  {
    path: '/message',
    func: MessageRoutes,
  },
  {
    path: '/article',
    func: articleRoutes,
  },
  {
    path: '/',
    func: SearchRoute,
  },
  {
    path: '/audiomessage',
    func: audioMessageRoute,
  },
];

export default routes;