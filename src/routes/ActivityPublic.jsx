import React from 'react'
import { useParams } from 'react-router-dom'
import { estudantes, atividadesFallback } from '../data.js'
import { getPublished, getMetaAtividades } from '../storage.js'

export default function ActivityPublic(){
  const { id } = useParams()
  const activityId = String(id)
  const metaList = getMetaAtividades()
  const meta = (metaList.length ? metaList : atividadesFallback).find(a => String(a.id) === activityId) || { titulo: `Atividade ${activityId}` }

  const rows = getPublished(activityId)
  const viewRows = rows.length ? rows : estudantes.map(nome => ({
    nome, entregue: '', observacoes: ''
  }))

  return (
    <section className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <h2>{meta.titulo}</h2>
          <p className="muted">Página pública (somente leitura)</p>
        </div>
      </div>

      <div className="card" style={{marginTop:'14px'}}>
        <div className="row">
          <div style={{flex:'1 1 240px'}}>
            <div className="muted">Descrição da atividade</div>
            <div>{meta.descricao || '—'}</div>
          </div>
          <div style={{flex:'1 1 240px'}}>
            <div className="muted">Link de entrega</div>
            {meta.link ? <a href={meta.link} target="_blank" rel="noreferrer">{meta.link}</a> : <div>—</div>}
          </div>
          <div style={{flex:'1 1 160px'}}>
            <div className="muted">Data de abertura</div>
            <div>{meta.abertura || '—'}</div>
          </div>
          <div style={{flex:'1 1 160px'}}>
            <div className="muted">Data de encerramento</div>
            <div>{meta.encerramento || '—'}</div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Entregue</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {viewRows.map((r,i)=>(
              <tr key={i}>
                <td>{r.nome}</td>
                <td>{r.entregue || '—'}</td>
                <td>{r.observacoes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
