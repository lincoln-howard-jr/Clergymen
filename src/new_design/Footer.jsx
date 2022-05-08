import { useApp } from "../AppProvider";
import Row from "./Row";

export default function Footer () {
    const app = useApp ();

    if (app.pages.page === 'footer' || !app.pages.footer || app.pages.editing || app.pages.reserved.find (p => p === app.router.page)) return null;
    return (
        <footer className="footer">
            {
                app.pages.footer.rows.map (row => <Row row={row} />)
            }
        </footer>
    )
}