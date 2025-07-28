import { useState } from "react"

export default function Home() {
  const [step, setStep] = useState("token")
  const [token, setToken] = useState("")
  const [number, setNumber] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!token || !number) return setMsg("Isi token dan nomor!")
    setLoading(true)
    setMsg("Memverifikasi...")

    try {
      const res = await fetch("/api/verifikasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, number })
      })
      const data = await res.json()
      setMsg(data.message)
      if (data.success) setStep("done")
    } catch (err) {
      setMsg("Gagal terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * {
          box-sizing: border-box;
        }
        body, html, .page {
          padding: 0;
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #e0f7fa, #e1f5fe);
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          max-width: 420px;
          width: 100%;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }
        .card h2 {
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 22px;
          color: #333;
        }
        .card img {
          margin-bottom: 20px;
          border-radius: 50%;
        }
        input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 15px;
          margin-top: 10px;
          transition: border 0.3s;
        }
        input:focus {
          border-color: #0072ff;
          outline: none;
        }
        button {
          width: 100%;
          padding: 14px;
          margin-top: 18px;
          border: none;
          border-radius: 10px;
          background-color: #0072ff;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s;
        }
        button:hover {
          background-color: #005fd1;
          transform: translateY(-1px);
        }
        .loader {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .dot {
          width: 10px;
          height: 10px;
          background: #0072ff;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          to {
            opacity: 0.3;
            transform: translateY(-10px);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
        }
      `}</style>

      <div className="card">
        <img src="https://ui-avatars.com/api/?name=Verify&background=0072ff&color=fff" width="64" />
        <h2>Verifikasi WhatsApp</h2>

        {step === "token" && (
          <>
            <input
              placeholder="Masukkan Token"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <button onClick={() => {
              if (!token) return setMsg("Isi token dulu!");
              setStep("number");
              setMsg("");
            }}>
              Lanjut
            </button>
          </>
        )}

        {step === "number" && (
          <>
            <input
              placeholder="Nomor WhatsApp (62xxxx)"
              value={number}
              onChange={e => setNumber(e.target.value)}
            />
            <button onClick={submit}>
              Verifikasi Sekarang
            </button>
          </>
        )}

        {loading && (
          <div className="loader">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        )}

        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  )
}
