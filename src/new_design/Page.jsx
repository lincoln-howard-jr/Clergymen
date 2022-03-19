import { useApp } from "../AppProvider";
import Episode from "./display-components/Episode";
import Image from "./display-components/Image";
import Text from "./display-components/Text";

function Row (props) {
  return (
    <div className={`row cols-${props.row.cols}`}>
      {
        props.row.contents.map (col => (
          <div className={col.type}>
            {col.type === 'text' && <Text col={col} /> }
            {col.type === 'image' && <Image col={col} />}
            {col.type === 'row' && <Row row={col.value} />}
            {col.type === 'episode' && <Episode col={col} />}
          </div>
        ))
      }
    </div>
  )
}

export default function Page () {
  const app = useApp ();

  if (app.pages.history || app.pages.editing || !app.pages.currentPage || (app.pages.currentPage.param && app.pages.currentPage.param !== app.router.param)) return null;

  return (
    <main>
      <h1>{app.pages.currentPage.title}</h1>
      {
        app.pages.currentPage.rows.map (row => (
          <Row row={row} />
        ))
      }
    </main>
  )
}