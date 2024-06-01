import Select from "react-select";
import { Controller } from "react-hook-form";

export default function FormSelect({
  label,
  name,
  options,
  defaultValue,
  control,
}: {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  defaultValue?: { value: any; label: string };
  control: any;
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, name } }) => (
          <Select
            instanceId={name}
            options={options}
            defaultValue={defaultValue}
            onChange={(val) => onChange(val?.value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "rgb(99 102 241)" : "gray",
                "&:hover": {
                  borderColor: "rgb(99 102 241)",
                },
                boxShadow: "none",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? "rgb(99 102 241)" : "white",
                color: state.isFocused ? "white" : "black",
                "&:active": {
                  backgroundColor: "rgb(99 102 241)",
                  color: "white",
                },
              }),
            }}
          />
        )}
      />
    </div>
  );
}
