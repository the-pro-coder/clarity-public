import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
export default function InputField({
  label,
  placeholder,
  type,
  required,
  annotations,
  binding,
}: {
  label: string;
  placeholder: string;
  type: string;
  required?: boolean | undefined;
  annotations?: {
    text: string;
    type: string;
    href: string;
  };
  binding: Dispatch<SetStateAction<string>>;
}) {
  label = label[0].toUpperCase() + label.substring(1);

  const Annotations: React.ReactNode =
    annotations?.type == "text" ? (
      <p className={`text-secondary text-sm`}>{annotations?.text}</p>
    ) : (
      <Link target="_blank" href={annotations?.href || ""}>
        <p className={`text-secondary text-sm hover:underline`}>
          {annotations?.text}
        </p>
      </Link>
    );
  return (
    <div className="flex flex-col gap-2 w-full m-auto">
      <Label htmlFor={label} className="font-semibold">
        {label
          .split("_")
          .map((word) => ` ${word[0].toUpperCase() + word.substring(1)}`)}
        {required ? <span className="text-destructive"> *</span> : ""}
      </Label>
      <Input
        required={required}
        type={type}
        name={label}
        id={label}
        className="bg-accent"
        onChange={(e) => {
          binding(e.target.value);
        }}
        placeholder={placeholder}
      />
      <div
        className={`flex w-full ${
          annotations?.type == "button" ? "justify-end" : ""
        }`}
      >
        {annotations != null && Annotations}
      </div>
    </div>
  );
}
