import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './routes/Home.jsx'
import ActivityPublic from './routes/ActivityPublic.jsx'
import AdminLogin from './routes/AdminLogin.jsx'
import AdminDashboard from './routes/AdminDashboard.jsx'
import { logout, isAuthed, getMetaAtividades, currentUser } from './storage.js'
import { atividadesFallback } from './data.js'

function NavLinks(){
  const meta = getMetaAtividades()
  const list = meta.length ? meta : atividadesFallback
  return (
    <nav className="nav">
      <NavLink to="/" end>Início</NavLink>
      {list.map(a => <NavLink key={a.id} to={`/atividade/${a.id}`}>{a.titulo}</NavLink>)}
      <NavLink to="/admin">Admin</NavLink>
    </nav>
  )
}

export default function App(){
  const nav = useNavigate()
  const user = currentUser()
  return (
    <div>
      <header className="header">
        <div className="container row" style={{justifyContent:'space-between'}}>
          <div>
            <h1>Unidade Curricular 14 (turma 241N)</h1>
            <p>Publicar e testar aplicações Web • Professora Dalvana Ribeiro</p>
            <NavLinks />
          </div>
          <div className="row" style={{alignItems:'baseline'}}>
            {user ? <span className="muted">Logada: <strong>{user}</strong></span> : null}
            {isAuthed() ? <button className="btn ghost" onClick={()=>{logout(); nav('/')}}>Sair</button> : null}
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/atividade/:id" element={<ActivityPublic/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
        </Routes>
        <footer>UC14 • 241N • DLR</footer>
      </main>
    </div>
  )
}
