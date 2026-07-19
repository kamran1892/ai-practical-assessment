export default function ErrorMessage({ error }) {
  if (!error) return null;

  const text =
    typeof error === 'string'
      ? error
      : error.errors?.length
        ? `${error.message}: ${error.errors.join('; ')}`
        : error.message || 'Something went wrong';

  return (
    <div className="error" role="alert">
      {text}
    </div>
  );
}
