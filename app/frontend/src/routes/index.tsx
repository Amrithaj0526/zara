import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { Outlet } from 'react-router-dom';

const LayoutWithOutlet = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    element: <ProtectedRoute><LayoutWithOutlet /></ProtectedRoute>,
    children: [
  {
    path: '/profile',
    element: <ProfileView />,
  },
  {
    path: '/profile/edit',
    element: <ProfileEdit />,
  },
  {
    path: '/posts/create',
    element: <PostCreate />,
  },
  {
    path: '/posts',
    element: <PostList />,
  },
      {
        path: '/feed',
        element: <Feed />,
      },
      {
        path: '/posts/create',
        element: <PostCreate />,
      },
  {
    path: '/jobs',
    element: <JobList />,
  },
  {
    path: '/messages',
    element: <MessageList />,
      },
    ],
  },
]);

export default function Routes() {
  return (
    <div>
      <PostCreate />
      <PostList />
    </div>
  );
} 