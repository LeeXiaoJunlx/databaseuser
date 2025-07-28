import { useState } from "react"

export default function Home() {
  const [step, setStep] = useState("token")
  const [token, setToken] = useState("")
  const [number, setNumber] = useState("")
  const [msg, setMsg] = useState("")

  const submit = async () => {
    if (!token || !number) return setMsg("Isi token dan nomor!")

    setMsg("Memverifikasi...")
    const res = await fetch("/api/verifikasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, number })
    })
    const data = await res.json()
    setMsg(data.message)
    if (data.success) setStep("done")
  }

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Verifikasi WhatsApp</h2>
      <input placeholder="Token 16 karakter" value={token} onChange={e => setToken(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }} />
      {step !== "token" || (
        <button onClick={() => setStep("number")} style={{ padding: 10, width: "100%" }}>Lanjut</button>
      )}
      {step === "number" && (
        <>
          <input placeholder="Nomor 628xxx" value={number} onChange={e => setNumber(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 10 }} />
          <button onClick={submit} style={{ padding: 10, width: "100%", marginTop: 10 }}>Verifikasi</button>
        </>
      )}
      <p>{msg}</p>
    </div>
  )
}
