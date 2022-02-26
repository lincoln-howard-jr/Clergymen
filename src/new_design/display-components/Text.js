import { useApp } from "../../AppProvider"

export default function (props) {
    const app = useApp ();
    return (
        <p className={`align-${props.col?.params?.textAlign || 'left'}`}>
            {
                props.col.value.map (t => (
                    <>
                        {
                            !!t.link &&
                            <span className="link" onClick={app.router.redirect (t.link)}>
                                {t.text}
                            </span>
                        }
                        {
                            !t.link &&
                            <span>{t.text}</span>
                        }
                    </>
                ))
            }
        </p>
    )
}