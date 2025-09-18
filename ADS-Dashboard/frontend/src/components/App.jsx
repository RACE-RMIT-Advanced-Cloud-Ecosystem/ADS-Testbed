import { BrowserRouter, Routes, Route } from 'react-router';
import { AppProvider } from '@contexts/AppContext';

import MainLayout from './MainLayout';
import Overview from './pages/overview';
import Agreements from './pages/Agreements';
import DataOffering from './pages/DataOffering';
import Assets from './pages/Assets';
import Policies from './pages/Policies';
import Connectors from './pages/Connectors';
import Brokers from './pages/Brokers';
import Settings from './pages/Settings';
import Requests from './pages/Requests';
import CatalogBrowser from './pages/CatalogBrowser';
import NotFound from './pages/NotFound';

import useApp from '@hooks/useApp';

function AppContent() {
    useApp();
    
    return (
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH ?? (import.meta.env.PROD ? '/dashboard' : '/')}>
                <Routes>
                    <Route path="/" element={<MainLayout />} >
                        <Route index element={<Overview />} />

                        <Route path='agreements' element={<Agreements />} />
                        <Route path='data-offerings'>
                            <Route index element={<DataOffering />} />
                            <Route path='catalogs' element={<DataOffering page='catalogs' />} />
                        </Route>
                        <Route path='assets' element={<Assets />} />
                        <Route path='policies'>
                            <Route index element={<Policies />} />
                            <Route path='contracts' element={<Policies page='contracts' />} />
                        </Route>
                        <Route path='connectors' element={<Connectors />} />
                        <Route path='requests' element={<Requests />} />
                        <Route path='brokers' element={<Brokers />} />
                        <Route path='settings' element={<Settings />} />
                        <Route path='catalog-browser' element={<CatalogBrowser />} />
                        
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;