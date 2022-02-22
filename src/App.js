import BackgroundImage from './img/parchment.jpg';
import Nav from './new_design/Nav';
import Page from './new_design/Page';
import PageEditor from './new_design/PageEditor';

function App() {
  return (
    <>
      <div className="background-image">
        <img src={BackgroundImage} />
      </div>
      <Nav />
      <Page />
      <PageEditor />
    </>
  );
}

export default App;
