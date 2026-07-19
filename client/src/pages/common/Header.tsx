type Props = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
  return (
    <header className="h-14 bg-muted/0 shadow flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded hover:bg-gray-100"
        >
          ☰
        </button>

        <h1 className="font-semibold text-lg">
          Admin Dashboard
        </h1>
      </div>

      <div className="text-sm text-gray-600">
        Admin
      </div>
    </header>
  );
}