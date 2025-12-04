import jwt from 'jsonwebtoken'


const SECRET_KEY = process.env.JWT_SECRET

if(!SECRET_KEY) {
  throw new Error("Missing JWT_SECRET environment variable")
}

export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}

export  function verifyToken (req,res) {
    const token = req.headers.authorization?.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    console.log(decoded,"decoded")
    return decoded
  } catch (error) {
    throw new Error("invalid or expire token ")
  }
}

