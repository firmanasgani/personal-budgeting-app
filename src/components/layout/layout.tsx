import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }: { children: JSX.Element }) {
    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="tw-flex-1 tw-overflow-y-auto">
                <Navbar />
                {children}
                <Footer />
            </div>
        </div>
    );
}

