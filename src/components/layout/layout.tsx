import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }: { children: JSX.Element }) {
    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="tw-flex-1 tw-overflow-y-auto  tw-bg-gray-50">
                <Navbar />
                {children}
                <Footer />
            </div>
        </div>
    );
}

