export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input placeholder="Username" className="w-full mb-3 p-2 border rounded" />
        <input placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Create Account
        </button>

        <p className="text-sm text-center mt-3">
          Sudah punya akun? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
}
