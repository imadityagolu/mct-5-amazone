import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Home from './pages/Home'
import AllProducts from './pages/AllProducts';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Singleproduct from './pages/Singleproduct';
import CartProvider from './contexts/CartContext'
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
  path: "/",
  element: <Layout/>,

  children: [
    {
      index: true,
      element: <Home/>
    },
    {
      path: "/AllProducts",
      element: <AllProducts/>
    },
    {
      path: "/product/:id",
      element: <Singleproduct/>
    },
    {
      path: "/Cart",
      element: (
      <ProtectedRoute>
        <Cart/>
      </ProtectedRoute>
      ),
    },
    {
      path: "/Order",
      element: (
      <ProtectedRoute>
        <Order/>
      </ProtectedRoute>
      ),
    },
    {
      path: "/Wishlist",
      element: (
      <ProtectedRoute>
        <Wishlist/>
      </ProtectedRoute>
      ),
    },
    {
      path: "/Login",
      element: <Login/>
    },
    {
      path: "/Register",
      element: <Register/>
    },
    {
      path: "/Profile",
      element: (
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: <NoPage/>
    },
  ],
}
]);

function App(){
  return (
  <Provider store={store}>
  <AuthProvider>
    <CartProvider>
      <RouterProvider router = {router}/>
    </CartProvider>
    <Toaster position="top-right" />
  </AuthProvider>
  </Provider>
  );
}
export default App;
