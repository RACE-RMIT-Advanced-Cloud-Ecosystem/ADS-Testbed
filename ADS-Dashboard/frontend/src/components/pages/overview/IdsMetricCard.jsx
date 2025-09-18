import PropTypes from "prop-types";
import s from '@styles/pages/overview.module.css'
import c from 'clsx';
import { useIdsComponentMetric } from "@contexts/AppContext";
import { Link } from "react-router";
import PillTag from "../utils/PillTag";
import icons from "@utils/icons";

function IdsMetricCard({ name, to, subMetricFields }) {

    const {metrics} = useIdsComponentMetric();

    return (
        <Link 
            className={c(s['ids-metric-card'], name, 'clickable')}
            to={to}
        >
            <div className={s['section-top']}>
                <PillTag theme={name} className={s['pill']}>{ name.toUpperCase() }</PillTag>
                <div className={s['icon']}>{ icons[name] }</div>
            </div>
            <div className={s['metric']}>{ metrics[name] ?? '-' }</div>
            { 
                subMetricFields?.length && 
                <div className={s['sub-metrics']}>
                    {
                        subMetricFields.map(field => (
                            <div key={field} className={s['item']} >
                                <div className={s['value']}>{ metrics[`${name}-${field}`] ?? '-' }</div>
                                <div className={s['label']}>{ field.toUpperCase() }</div>
                            </div>
                        ))
                    }
                </div>
            }
        </Link>
    );
}

IdsMetricCard.propTypes = {
    name: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    subMetricFields: PropTypes.arrayOf(PropTypes.string)
}

export default IdsMetricCard;