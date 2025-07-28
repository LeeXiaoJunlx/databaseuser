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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #00c6ff, #0072ff)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        .card {
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }
        input {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        button {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #0072ff;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s ease;
        }
        button:hover {
          background: #005fd1;
        }
        .loader {
          margin: 20px auto;
          display: flex;
          justify-content: center;
          gap: 6px;
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
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="card">
        <img src="https://ui-avatars.com/api/?name=Token&background=0072ff&color=fff" width="60" style={{ borderRadius: "50%", marginBottom: 15 }} />
        <h2 style={{ marginBottom: 20 }}>Verifikasi WhatsApp</h2>

        {step === "token" && (
          <>
            <input placeholder="Masukkan Token" value={token} onChange={e => setToken(e.target.value)} />
            <button onClick={() => {
              if (!token) return setMsg("Isi token dulu!");
              setStep("number");
              setMsg("");
            }}>Lanjut</button>
          </>
        )}

        {step === "number" && (
          <>
            <input placeholder="Nomor WhatsApp (62xxxx)" value={number} onChange={e => setNumber(e.target.value)} />
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

        {msg && <p style={{ marginTop: 15, fontSize: 14, color: "#555" }}>{msg}</p>}
      </div>
    </div>
  )
}
