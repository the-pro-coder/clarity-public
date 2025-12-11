import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import capitalize from "../util/Capitalize";
import { toast } from "sonner";
export default function InputField({
  label,
  placeholder,
  type,
  required,
  annotations,
  binding,
  valueBinding,
  maxLength,
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
  maxLength?: number;
  binding: Dispatch<SetStateAction<string>>;
  valueBinding?: string;
}) {
  label = capitalize(label);

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
      <Label htmlFor={label} className="font-semibold text-secondary">
        {label.split("_").map((word) => ` ${capitalize(word)}`)}
        {required ? <span className="text-destructive"> *</span> : ""}
      </Label>
      {valueBinding != null ? (
        <Input
          required={required}
          type={type}
          name={label}
          id={label}
          value={valueBinding}
          className="bg-accent"
          onChange={(e) => {
            if (maxLength != undefined && e.target.value.length <= maxLength) {
              binding(e.target.value);
            } else if (maxLength == undefined) {
              binding(e.target.value);
            } else {
              toast.error(
                `${maxLength} caracters only in ${label
                  .split("_")
                  .map((word) => `${capitalize(word)}`)
                  .join(" ")}`,
                {
                  position: "top-center",
                }
              );
            }
          }}
          placeholder={placeholder}
        />
      ) : (
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
      )}
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
