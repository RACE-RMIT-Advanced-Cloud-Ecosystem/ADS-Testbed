import s from '@styles/navigation.module.css'
import Section from './Section';
import NavLink from './NavLink';

import logo from '@assets/logo.svg';

import { RiDashboard3Fill, RiSearchLine  } from "react-icons/ri";
import { FaPlug } from "react-icons/fa";
import { TbNetwork } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import icons from '@utils/icons';


function LeftNavigation() {

    return (
        <div className={s['left-navigation']}>
            <div className={s['top-logo']}>
                <img src={logo} alt="logo" className={s['logo']} />
                <div className={s['service-title']}>Australian Dataspace Testbed Service</div>
            </div>

            <Section>
                <NavLink to={'/'} title='Dashboard' icon={<RiDashboard3Fill />} />
                <NavLink to={'/agreements'} title='Agreements' icon={icons['agreement']} />
            </Section>

            <Section title="MY DATA">
                <NavLink to={'/data-offerings'} title='Data Offerings' icon={icons['resource']} />
                <NavLink to={'/assets'} title='My Assets' icon={icons['representation']} />
                <NavLink to={'/policies'} title='My Policies' icon={icons['policy']} />
            </Section>

            <Section title="DATA CONSUMPTION">
                <NavLink to={'/requests'} title='Requests' icon={icons['request']} />
                <NavLink to={'/catalog-browser'} title='Catalog Browser' icon={<RiSearchLine />} />
            </Section>

            <Section title="DATASPACE">
                <NavLink to={'/brokers'} title='Brokers' icon={icons['broker']} />
                <NavLink to={'/connectors'} title='Connectors' icon={<FaPlug />} />
            </Section>

            <Section title="SYSTEM">
                <NavLink to={'/settings'} title='Settings' icon={<IoMdSettings />} />
            </Section>
        </div>
    )
}

export default LeftNavigation;