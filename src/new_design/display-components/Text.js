import { useApp } from "../../AppProvider"

export default function Text (props) {
    const app = useApp ();
    return (
        <p className={`align-${props.col?.params?.textAlign || 'left'}`}>
            {
                props.col.value.map (t => (
                    <>
                        {
                            !!t.link &&
                            <span key={`text-${t.text}-link=${t.link}`} className="link" onClick={app.router.redirect (t.link)}>
                                {t.text}
                            </span>
                        }
                        {
                            !t.link &&
                            <span key={`text-${t.text}`}>{t.text}</span>
                        }
                    </>
                ))
            }
        </p>
    )
}