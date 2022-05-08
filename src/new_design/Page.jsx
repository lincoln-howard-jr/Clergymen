import { useApp } from "../AppProvider";
import Row from './Row'

export default function Page () {
  const app = useApp ();

  console.log (`is history = ${app.pages.history}`);
  console.log (`is editing = ${app.pages.editing}`);
  console.log (`no current page = ${!app.pages.currentPage}`);
  console.log (`has param = ${!!app.pages?.currentPage?.param}`);
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