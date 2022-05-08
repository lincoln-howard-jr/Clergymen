import { useApp } from "../../AppProvider"

export default function Text (props) {
    const app = useApp ();
    const redirect = t => {
        if (t.param) return app.router.redirect (t.link, t.param);
        return app.router.redirect (t.link)
    }
    return (
        <p className={`align-${props.col?.params?.textAlign || 'left'}`}>
            {
                !props.col?.params?.isHeading &&
                props.col.value.map (t => (
                    <>
                        {
                            !!t.link &&
                            <span key={`text-${t.text}-link=${t.link}`} className="link" onClick={redirect (t)}>
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
            {
                props.col?.params?.isHeading &&
                <h1>
                    {
                        props.col.value.map (t => (
                            <>
                                {
                                    !!t.link &&
                                    <span key={`text-${t.text}-link=${t.link}`} className="link" onClick={redirect (t)}>
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
                </h1>
            }
        </p>
    )
}