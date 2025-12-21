export function GradientBackground({ gradient }: { gradient: null | string }) {
    if (gradient === null) {
        return null;
    }
    return (
        <>
            <div
                style={{ background: gradient }}
                className="animate-fade fixed inset-x-0 top-0 -z-50 h-[60vh] transform-gpu duration-500"
            />

            <div className="fixed inset-x-0 top-0 -z-50 h-[60vh] bg-linear-to-t from-[#fff] dark:from-[#000]" />
            <div className="fixed inset-x-0 top-0 -z-40 h-[60vh] bg-linear-to-t from-[#fff] via-[#fff] opacity-50 dark:from-[#000] dark:via-[#000]" />
            <div className="fixed inset-x-0 top-[40vh] -z-30 h-[20vh] bg-linear-to-t from-[#fff] via-[#fff] opacity-80 dark:from-[#000] dark:via-[#000]" />
        </>
    );
}
