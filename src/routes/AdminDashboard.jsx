import React, { useEffect, useState } from 'react'
import { Navigate, Link, useSearchParams } from 'react-router-dom'
import { estudantes, atividadesFallback } from '../data.js'
import { isAuthed, getDraft, setDraft, publish, getMetaAtividades, setMetaAtividades, addAtividade, removeAtividade, updateAtividadeMeta } from '../storage.js'
import { exportCSV } from '../utils.js'

function ActivityPicker({ value, onChange }){
  const meta = getMetaAtividades()
  const list = meta.length ? meta : atividadesFallback
  return (
    <div className="row" style={{marginTop:8}}>
      {list.map(a => (
        <button key={a.id}
          className={"btn " + (String(value)===String(a.id) ? "primary" : "ghost")}
          onClick={()=>onChange(String(a.id))}>
          {a.titulo}
        </button>
      ))}
    </div>
  )
}

function CreateActivityForm({ onCreated }){
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')

  function create(){
    if(!titulo.trim()){ alert('Informe um título para a atividade.'); return }
    const novo = addAtividade(titulo.trim(), descricao.trim())
    setTitulo(''); setDescricao(''); onCreated?.(String(novo.id))
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>➕ Nova atividade</h3>
      <div className="row">
        <input className="input" placeholder="Título da atividade" value={titulo} onChange={e=>setTitulo(e.target.value)} />
        <input className="input" placeholder="Descrição (opcional)" value={descricao} onChange={e=>setDescricao(e.target.value)} />
        <button className="btn success" onClick={create}>Criar atividade</button>
      </div>
      <p className="muted" style={{marginTop:'8px'}}>A atividade será adicionada ao menu e poderá ser editada e publicada.</p>
    </div>
  )
}

function Editor({ activityId }){
  const metaList = getMetaAtividades()
  const list = metaList.length ? metaList : atividadesFallback
  const meta = list.find(a => String(a.id) === String(activityId)) || { id: activityId, titulo: `Atividade ${activityId}`, descricao: '' }

  const [rows, setRows] = useState(() => {
    const initial = getDraft(activityId)
    return initial.length ? initial : estudantes.map(nome => ({
      nome, entregue: '', observacoes: ''
    }))
  })

  // Simplified header fields (saved directly in meta)
  const [descricao, setDescricao] = useState(meta.descricao || '')
  const [link, setLink] = useState(meta.link || '')
  const [abertura, setAbertura] = useState(meta.abertura || '')
  const [encerramento, setEncerramento] = useState(meta.encerramento || '')

  useEffect(()=>{
    // Persist meta on change (immediate)
    updateAtividadeMeta(activityId, { descricao, link, abertura, encerramento })
  }, [descricao, link, abertura, encerramento])

  function updateRow(i, field, value){ setRows(prev => prev.map((r,idx)=> idx===i ? { ...r, [field]: value } : r)) }
  function save(){ setDraft(activityId, rows); alert('Rascunho salvo.'); }
  function publishNow(){ setDraft(activityId, rows); publish(activityId); alert('Publicado! A página pública foi atualizada.'); }
  function exportCSVNow(){ exportCSV(`UC14_241N_${meta.titulo.replaceAll(' ','_')}.csv`, [
    ['Nome','Entregue','Observações'],
    ...rows.map(r => [r.nome, r.entregue, r.observacoes])
  ])}
  function remove(){ if(confirm('Remover esta atividade? Isso apagará rascunho/publicado desta atividade.')){ removeAtividade(activityId); window.location.href='/admin' } }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:'space-between', alignItems:'flex-start'}}>
        <div>
          <h2 style={{margin:'0 0 4px'}}>{meta.titulo}</h2>
          <p className="muted">Preencha e <strong>Salvar rascunho</strong>. Use <strong>Publicar</strong> para enviar à página pública.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={save}>💾 Salvar rascunho</button>
          <button className="btn primary" onClick={publishNow}>🚀 Publicar</button>
          <button className="btn" onClick={exportCSVNow}>⬇️ Exportar CSV</button>
          <Link to={`/atividade/${activityId}`} className="btn ghost">👁️ Ver público</Link>
          <button className="btn danger" onClick={remove}>🗑️ Remover</button>
        </div>
      </div>

      {/* Header simplified fields */}
      <div className="card" style={{marginTop:'14px'}}>
        <div className="row">
          <div style={{flex:'1 1 240px'}}>
            <label className="muted">Descrição da atividade</label>
            <input className="input" value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Descrição..." />
          </div>
          <div style={{flex:'1 1 240px'}}>
            <label className="muted">Link de entrega</label>
            <input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://..." />
          </div>
          <div style={{flex:'1 1 160px'}}>
            <label className="muted">Data de abertura</label>
            <input className="input" type="date" value={abertura} onChange={e=>setAbertura(e.target.value)} />
          </div>
          <div style={{flex:'1 1 160px'}}>
            <label className="muted">Data de encerramento</label>
            <input className="input" type="date" value={encerramento} onChange={e=>setEncerramento(e.target.value)} />
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
            {rows.map((r, i)=>(
              <tr key={i}>
                <td>{r.nome}</td>
                <td>
                  <select className="input" value={r.entregue} onChange={e=>updateRow(i,'entregue', e.target.value)}>
                    <option value="">—</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Não">Não</option>
                  </select>
                </td>
                <td><input className="input" value={r.observacoes} onChange={e=>updateRow(i,'observacoes', e.target.value)} placeholder="Observações" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function AdminDashboard(){
  if(!isAuthed()){ return <Navigate to="/admin/login" replace /> }
  const [sp, setSp] = useSearchParams()
  const meta = getMetaAtividades()
  useEffect(()=>{ if(!meta.length){ setMetaAtividades(atividadesFallback) } }, [])

  const current = sp.get('atividade') || String((meta.length ? meta[0].id : 1))

  return (
    <section>
      <div className="card">
        <h2 style={{marginTop:0}}>Administração</h2>
        <p className="muted">Crie atividades, edite e publique. Os campos acima da tabela são exibidos na página pública.</p>
        <CreateActivityForm onCreated={(id)=> setSp({ atividade: id })} />
        <h3 style={{margin:'8px 0 0'}}>Atividades</h3>
        <ActivityPicker value={current} onChange={(id)=> setSp({ atividade: id })} />
      </div>
      <Editor activityId={current} />
    </section>
  )
}
