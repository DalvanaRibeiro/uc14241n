import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthed } from '../storage.js'

export default function AdminLogin(){
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    if(login(user, pass)){ nav('/admin') } else { setErr('Usuário ou senha incorretos.') }
  }
  if(isAuthed()){ nav('/admin') }

  return (
    <section className="card" style={{maxWidth:520, margin:'24px auto'}}>
      <h2>Login administrativo</h2>
      <p className="muted"></p>
      <form onSubmit={submit}>
        <input className="input" placeholder="Usuário" value={user} onChange={e=>setUser(e.target.value)} />
        <input className="input" type="password" placeholder="Senha" value={pass} onChange={e=>setPass(e.target.value)} />
        {err ? <p style={{color:'#b91c1c', marginTop:8}}>{err}</p> : null}
        <div className="row" style={{marginTop:12}}>
          <button className="btn primary" type="submit">Entrar</button>
        </div>
      </form>
    </section>
  )
}
