export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}