import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from '../components/NavigationComponent';
import { NotificationToggle } from '../components/NotificationComponent';

function Main() {
    const { id } = useParams();

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-64 overflow-x-hidden">
                <div className="w-full mx-auto p-4 min-[2500px]:scale-[1.5] min-[2500px]:origin-top min-[2500px]:w-[66.666%] min-[3500px]:scale-[2.0] min-[3500px]:w-[50%]">
                    <Outlet />
                </div>
            </main>
            <NotificationToggle />
        </>
    );
}

export default Main;