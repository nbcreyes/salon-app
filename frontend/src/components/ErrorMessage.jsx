export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}