import { useState } from "react"

export default function Home() {
  const [step, setStep] = useState("token")
  const [token, setToken] = useState("")
  const [number, setNumber] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!token || !number) return setMsg("⚠️ Isi token dan nomor!")

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
      setMsg("❌ Gagal menghubungi server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 420px;
          width: 100%;
          animation: fadeIn 0.7s ease;
          text-align: center;
          color: white;
        }
        input {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          margin-top: 20px;
          font-size: 15px;
          background: rgba(255,255,255,0.3);
          color: white;
          backdrop-filter: blur(5px);
          outline: none;
        }
        input::placeholder {
          color: #eee;
        }
        button {
          margin-top: 25px;
          padding: 14px;
          width: 100%;
          border: none;
          border-radius: 12px;
          background: #ffffff;
          color: #4a4a4a;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #ddd;
        }
        .loader {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .dot {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          animation: bounce 0.8s infinite alternate;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          to {
            transform: translateY(-10px);
            opacity: 0.6;
          }
        }

        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }

        .logo {
          margin-bottom: 20px;
        }

        .success {
          color: #b4ffb4;
        }

        .error {
          color: #ffb4b4;
        }
      `}</style>

      <div className="card">
        <div className="logo">
          <img src="https://ui-avatars.com/api/?name=WA+Bot&background=764ba2&color=fff&size=100" width="60" style={{ borderRadius: "50%" }} />
        </div>
        <h2 style={{ marginBottom: 10 }}>Verifikasi Token WhatsApp</h2>
        <p style={{ fontSize: 14, marginBottom: 20 }}>Masukkan token yang kamu dapat dari bot.</p>

        {step === "token" && (
          <>
            <input placeholder="🔐 Token 16 karakter" value={token} onChange={e => setToken(e.target.value)} />
            <button onClick={() => {
              if (!token) return setMsg("⚠️ Token tidak boleh kosong!");
              setStep("number")
              setMsg("")
            }}>Lanjut</button>
          </>
        )}

        {step === "number" && (
          <>
            <input placeholder="📱 Nomor WhatsApp (628xx)" value={number} onChange={e => setNumber(e.target.value)} />
            <button onClick={submit}>Verifikasi Sekarang</button>
          </>
        )}

        {loading && (
          <div className="loader">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        )}

        {msg && (
          <p className={msg.includes("berhasil") ? "success" : "error"} style={{ marginTop: 20 }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  )
}
