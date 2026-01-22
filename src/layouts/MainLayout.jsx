import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from '../components/NavigationComponent';
import { NotificationToggle } from '../components/NotificationComponent';

function Main() {
    const { id } = useParams();

    return (
        <>
            <Sidebar />
            <main className="flex-1 p-4 ml-64">
                <Outlet />
            </main>
            <NotificationToggle />
        </>
    );
}

export default Main;