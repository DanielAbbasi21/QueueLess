function Customer() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload(); // 🔥 reloadar appen
  };

  return (
    <div>
      <h2>Customer Page</h2>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Customer;