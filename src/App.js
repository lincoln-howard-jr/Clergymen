import BackgroundImage from './img/parchment.jpg';
import EpisodeManager from './new_design/admin/EpisodeManager';
import CreateEpisode from './new_design/admin/CreateEpisode';
import ManageContent from './new_design/admin/ManageContent';
import Nav from './new_design/Nav';
import Page from './new_design/Page';
import PageEditor from './new_design/PageEditor';
import PageList from './new_design/PageList';
import Auth from './pages/Auth';
import EditEpisode from './new_design/admin/EditEpisode';
import EditChannelInfo from './new_design/admin/EditChannelInfo';
import PageHistory from './new_design/PageHistory';
import ManageMedia from './new_design/admin/ManageMedia';
import { useApp } from './AppProvider';
import Footer from './new_design/Footer';
import CreateCharacter from './new_design/admin/CreateCharacter';
import ManageCharacters from './new_design/admin/ManageCharacters';
import EditCharacter from './new_design/admin/EditCharacter';

function App() {
  const app = useApp ();
  return (
    <>
      <div className="background-image">
        <img alt='' src={BackgroundImage} />
      </div>
      <Nav />
      <Page />
      {
        app.auth.isAuthenticated &&
        <>
          <PageEditor />
          <PageList />
          <PageHistory />
          <ManageContent />
          <EpisodeManager />
          <CreateEpisode />
          <EditEpisode />
          <ManageCharacters />
          <CreateCharacter />
          <EditCharacter />
          <EditChannelInfo />
          <ManageMedia />
        </> 
      }
      <Auth />
      <Footer />
    </>
  );
}

export default App;
