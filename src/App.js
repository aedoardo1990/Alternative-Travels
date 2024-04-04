import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import LoginForm from './pages/auth/LoginForm';
import SelectMedia from "./pages/posts/SelectMedia";
import PostCreateFormImage from "./pages/posts/PostCreateFormImage";
import PostCreateFormVideo from "./pages/posts/PostCreateFormVideo";
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditImageForm from './pages/posts/PostEditImageForm';
import PostEditVideoForm from './pages/posts/PostEditVideoForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from './pages/profiles/UsernameForm'
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import Map from "./pages/map/Map";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import MarketplacesPage from './pages/marketplace/MarketplacesPage';
import PostProduct from "./pages/marketplace/PostProduct";
import EditProduct from './pages/marketplace/EditProduct';

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => (
            <PostsPage message="No results found. Adjust the search keyword." />
          )}
          />
          <Route exact path="/newsfeed" render={() => (
            <PostsPage
              message="No results found. Adjust the search keyword or follow a user."
              filter={`owner__followed__owner__profile=${profile_id}&`}
            />
          )}
          />
          <Route exact path="/liked-posts" render={() => (
            <PostsPage
              message="No results found. Adjust the search keyword or like a post."
              filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
            />
          )}
          />
          <Route exact path="/login" render={() => <LoginForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/posts/add" render={() => <SelectMedia />} />
          <Route exact path="/posts/add/image" render={() => <PostCreateFormImage />} />
          <Route exact path="/posts/add/video" render={() => <PostCreateFormVideo />} />
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route exact path="/posts/:id/edit-image" render={() => <PostEditImageForm />} />
          <Route exact path="/posts/:id/edit-video" render={() => <PostEditVideoForm />} />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />} />
          <Route exact path="/profiles/:id/edit/password" render={() => <UserPasswordForm />} />
          <Route exact path="/profiles/:id/edit" render={() => <ProfileEditForm />} />
          <Route exact path="/map" render={() => <Map style={{ width: "100%", height: "100vh"}} zoom={13} />} />
          <Route exact path="/marketplace" render={() => (
            <MarketplacesPage message="No results found. Adjust the search keyword." />
          )}
          />
          <Route exact path="/marketplace/add/" render={() => <PostProduct />} />
          <Route exact path="/marketplace/:id" render={() => <MarketplacePage />} />
          <Route exact path="/marketplace/:id/edit-product" render={() => <EditProduct />} />
          <Route render={() => <h1>Page not found <i class="fa-solid fa-circle-radiation fa-beat-fade"></i></h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;