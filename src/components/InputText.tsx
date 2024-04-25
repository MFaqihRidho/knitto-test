export default function InputText({
    changeValue,
    value,
}: {
    changeValue: (newValue: string) => void;
    value: string;
}) {
    return (
        <input
            id="inputText"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                changeValue(e.target.value)
            }
            value={value}
            className="w-full h-10 py-1 px-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none"
            type="text"
            placeholder="Add new task"
        />
    );
}
