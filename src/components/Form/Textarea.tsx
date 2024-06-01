export default function FormTextarea({
  label,
  name,
  register,
  rows = 3,
}: {
  label: string;
  name: string;
  register?: any;
  rows?: number;
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        className="form-input"
        rows={rows}
        {...register?.(name)}
      ></textarea>
    </div>
  );
}
