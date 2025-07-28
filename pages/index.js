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
    <div className="bg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        * {
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        body, html, .bg {
          margin: 0;
          padding: 0;
          height: 100vh;
          background: #0e0e2c;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 40px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          text-align: center;
          width: 100%;
          max-width: 380px;
        }
        h1 {
          color: #fff;
          font-size: 28px;
          margin-bottom: 30px;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 12px 14px;
          margin-top: 15px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 14px;
        }
        input::placeholder {
          color: #ccc;
        }
        button {
          width: 100%;
          margin-top: 25px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: white;
          color: #0e0e2c;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        button:hover {
          background: #eee;
        }
        .msg {
          margin-top: 20px;
          font-size: 14px;
          color: #ddd;
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
          background: white;
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
        .bg::before {
          content: '';
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, #1b1b46, transparent 70%);
          top: -100px;
          left: -100px;
          z-index: 0;
        }
        .bg::after {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #262652, transparent 70%);
          bottom: -100px;
          right: -100px;
          z-index: 0;
        }
      `}</style>

      <div className="card">
        <h1>Verifikasi</h1>

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

        {msg && <div className="msg">{msg}</div>}
      </div>
    </div>
  )
}
