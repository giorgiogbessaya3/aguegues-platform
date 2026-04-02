'use client'

import Header from './Header'

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {/* Offset content by sidebar width on desktop, full width on mobile */}
            <div
                className="page-content-wrapper"
                style={{ minHeight: '100dvh' }}
            >
                {children}
            </div>

            <style>{`
                /* Desktop: push content right of the 240px sidebar */
                @media (min-width: 768px) {
                    .page-content-wrapper {
                        margin-left: 240px;
                    }
                }
                /* Mobile: full width (topbar is sticky above) */
                @media (max-width: 767px) {
                    .page-content-wrapper {
                        margin-left: 0;
                    }
                }
            `}</style>
        </>
    )
}
