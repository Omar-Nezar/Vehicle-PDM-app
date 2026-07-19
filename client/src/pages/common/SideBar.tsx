import { Link } from "react-router-dom"

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/30 z-40"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-50 top-0 left-0 h-full w-64 bg-popover shadow transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-4 border-b font-semibold">
                    Menu
                </div>

                <nav className="p-4 space-y-2">
                    <a className="block p-2 rounded hover:bg-gray-100 cursor-pointer">
                        Dashboard
                    </a>
                    <Link to="/manageusers">
                        <a className="block p-2 rounded hover:bg-gray-100 cursor-pointer">
                            Users
                        </a>
                    </Link>
                    <a className="block p-2 rounded hover:bg-gray-100 cursor-pointer">
                        Inventory
                    </a>
                </nav>
            </aside>
        </>
    );
}