import './App.css';
import Nav from './components/Nav';
import Auth from './pages/Auth';
import Characters from './pages/Characters';
import Episodes from './pages/Episodes';
import CreateCharacter from './pages/CreateCharacter';
import CreateEpisode from './pages/CreateEpisode';
import EditCharacter from './pages/EditCharacter';
import About from './pages/About';

function App() {
  return (
    <>
      <Nav/>
      <Auth />
      <About />
      <Characters />
      <CreateCharacter />
      <EditCharacter />
      <Episodes />
      <CreateEpisode />
    </>
  );
}

export default App;
