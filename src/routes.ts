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
import AlbumRoute from "@routes/album.route"
import audioMessageCategoryRoute from "@routes/audiomessagecategory.route"
import audioMessageCategorySubRoute from "@routes/audiomessagesubcategory.route"
import videoRoutes from "@routes/video.route"

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

  // {
  //   path: '/admin',
  //   func: adminRoutes,
  // },
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
    path: '/search',
    func: SearchRoute,
  },

  {
    path: '/album',
    func: AlbumRoute,
  },
  {
    path: '/audiomessagecategory',
    func: audioMessageCategoryRoute,
  },
  {
    path: '/audiomessagesubcategory',
    func: audioMessageCategorySubRoute,
  },
  {
    path: '/video',
    func: videoRoutes,
  },
  {
    path: '/audiomessage',
    func: audioMessageRoute,
  },

];

export default routes;