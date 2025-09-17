import React from 'react'
import { Link } from 'react-router-dom'
import { atividadesFallback } from '../data.js'
import { getMetaAtividades } from '../storage.js'

export default function Home(){
  const meta = getMetaAtividades()
  const list = meta.length ? meta : atividadesFallback

  return (
    <section className="card">
      <h2>Atividades publicadas</h2>
      <p className="muted">Abra cada página para visualizar a tabela de atividades.</p>
      <ul>
        {list.map(a => (
          <li key={a.id} style={{margin:'8px 0'}}>
            <Link to={`/atividade/${a.id}`} className="btn">Abrir {a.titulo}</Link>
          </li>
        ))}
      </ul>
      <p className="muted">Área de edição: <Link to="/admin" className="btn">Admin</Link></p>
    </section>
  )
}
