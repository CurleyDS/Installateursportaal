import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from '../components/NavComponent';

function Main() {
    const { id } = useParams();

    return (
        <>
            <Sidebar />
            <main className="ml-64 w-full p-4">
                <Outlet />
            </main>
        </>
    );
}

export default Main;