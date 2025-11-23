export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Panel de Control</h1>
      {/* User info and logout will go here */}
      <div>Nombre de Usuario</div>
    </header>
  );
}