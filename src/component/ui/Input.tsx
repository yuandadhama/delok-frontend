type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
};

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="
          border
          rounded
          px-3
          py-2
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
        required
      />

      <div className="text-red-600">{error}</div>
    </div>
  );
}
