import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

export default function ToastWrapper({
    success,
    error,
}: {
    success: Array<string>;
    error: Array<string>;
}) {
    return (
        <div className="flex flex-col gap-5 fixed z-[99999999] bottom-16 bg-transparent right-5 max-w-xs items-center w-full h-fit">
            {success.map((message) => (
                <SuccessToast key={message} message={message} />
            ))}
            {error.map((message) => (
                <ErrorToast key={message} message={message} />
            ))}
        </div>
    );
}
