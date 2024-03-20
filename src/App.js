import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import LoginForm from './pages/auth/LoginForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';

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
          <Route exact path="/posts/add" render={() => <PostCreateForm />} />
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route render={() => <h1>Page not found <i class="fa-solid fa-circle-radiation fa-beat-fade"></i></h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;