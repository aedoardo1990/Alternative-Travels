import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home</h1>}/>
          <Route exact path="/login" render={() => <h1>Login</h1>}/>
          <Route exact path="/signup" render={() => <h1>Sign Up</h1>}/>
          <Route render={() => <h1>Page not found <i class="fa-solid fa-circle-radiation fa-beat-fade"></i></h1>}/>
        </Switch>
      </Container>
    </div>
  );
}

export default App;