import BackgroundImage from './img/parchment.jpg';
import Nav from './new_design/Nav';
import Page from './new_design/Page';
import PageEditor from './new_design/PageEditor';
import Auth from './pages/Auth';

function App() {
  return (
    <>
      <div className="background-image">
        <img src={BackgroundImage} />
      </div>
      <Nav />
      <Page />
      <PageEditor />
      <Auth />
    </>
  );
}

export default App;
