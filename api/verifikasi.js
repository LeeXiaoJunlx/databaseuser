import { Octokit } from "octokit"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const { token, number } = req.body
  const owner = process.env.GITHUB_USERNAME
  const repo = process.env.GITHUB_REPO
  const { token, number, recaptchaToken } = req.body

const validateCaptcha = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`
})

const captchaResult = await validateCaptcha.json()
if (!captchaResult.success) {
  return res.status(400).json({ success: false, message: "Verifikasi CAPTCHA gagal!" })
}

  try {
    // Ambil token.json
    const tokenFile = await octokit.request('GET /repos/{owner}/{repo}/contents/public/token.json', { owner, repo })
    const tokenData = JSON.parse(Buffer.from(tokenFile.data.content, 'base64').toString())

    const index = tokenData.findIndex(t => t.token === token && !t.used)
    if (index === -1) return res.status(400).json({ success: false, message: "Token tidak valid atau sudah digunakan" })

    // Tandai token sebagai digunakan
    tokenData[index].used = true

    // Ambil verified.json
    const verifiedFile = await octokit.request('GET /repos/{owner}/{repo}/contents/public/verified.json', { owner, repo })
    const verifiedData = JSON.parse(Buffer.from(verifiedFile.data.content, 'base64').toString())

    verifiedData.push({ token, number, timestamp: new Date().toISOString() })

    // Encode dan upload ulang
    const encode = data => Buffer.from(JSON.stringify(data, null, 2)).toString("base64")

    await octokit.request('PUT /repos/{owner}/{repo}/contents/public/token.json', {
      owner, repo,
      message: `Gunakan token ${token}`,
      content: encode(tokenData),
      sha: tokenFile.data.sha
    })

    await octokit.request('PUT /repos/{owner}/{repo}/contents/public/verified.json', {
      owner, repo,
      message: `Verifikasi nomor ${number}`,
      content: encode(verifiedData),
      sha: verifiedFile.data.sha
    })

    return res.status(200).json({ success: true, message: "Verifikasi berhasil" })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Gagal menyimpan ke GitHub" })
  }
}
