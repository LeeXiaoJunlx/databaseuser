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
        html, body, .bg {
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
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          padding: 40px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          text-align: center;
          width: 100%;
          max-width: 400px;
          z-index: 1;
          animation: fadeIn 0.5s ease;
        }
        h1 {
          color: #fff;
          font-size: 24px;
          margin-bottom: 30px;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 13px 15px;
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
          padding: 13px;
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
          background: #f1f1f1;
        }
        .msg {
          margin-top: 20px;
          font-size: 13px;
          color: #ccc;
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg::before, .bg::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          z-index: 0;
        }
        .bg::before {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #1b1b46, transparent 70%);
          top: -150px;
          left: -150px;
        }
        .bg::after {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #262652, transparent 70%);
          bottom: -150px;
          right: -150px;
        }
        @media (max-width: 480px) {
          .card {
            padding: 30px 20px;
            max-width: 90%;
          }
          h1 {
            font-size: 20px;
          }
          button {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="card">
        <h1>Hello User 👋</h1>
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
