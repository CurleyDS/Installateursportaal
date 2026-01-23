import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from '../components/NavigationComponent';
import { NotificationToggle } from '../components/NotificationComponent';

function Main() {
    const { id } = useParams();

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-64">
                <div className="w-[95%] mx-auto p-4 min-[2500px]:text-[1.25rem] min-[3000px]:text-[1.5rem]">
                    <Outlet />
                </div>
            </main>
            <NotificationToggle />
        </>
    );
}

export default Main;