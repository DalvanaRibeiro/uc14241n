const KEY = 'uc14_241n_state_light'
const AUTH = 'uc14_auth_session'

/* ===== State ===== */
export function getState(){
  try { return JSON.parse(localStorage.getItem(KEY)) || { drafts:{}, published:{}, meta:{ atividades: [] } } }
  catch { return { drafts:{}, published:{}, meta:{ atividades: [] } } }
}
export function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)) }

/* ===== Meta (atividades) ===== */
export function getMetaAtividades(){ return getState().meta.atividades || [] }
export function setMetaAtividades(list){ const s = getState(); s.meta.atividades = list; saveState(s) }
export function addAtividade(titulo, descricao=''){
  const s = getState()
  const current = s.meta.atividades || []
  const maxId = current.reduce((m,a)=> Math.max(m, Number(a.id)||0), 0)
  const novo = { id: maxId + 1, titulo: titulo || `Atividade ${maxId+1}`, descricao: descricao || '' }
  s.meta.atividades = [...current, novo]
  saveState(s)
  return novo
}
export function removeAtividade(id){
  const s = getState()
  s.meta.atividades = (s.meta.atividades || []).filter(a => String(a.id) !== String(id))
  delete s.drafts[String(id)]
  delete s.published[String(id)]
  saveState(s)
}

/* ===== Draft/Publish ===== */
export function getDraft(activityId){ return getState().drafts[activityId] || [] }
export function setDraft(activityId, rows){ const s = getState(); s.drafts[activityId] = rows; saveState(s) }
export function getPublished(activityId){ return getState().published[activityId] || [] }
export function publish(activityId){ const s = getState(); s.published[activityId] = s.drafts[activityId] || []; saveState(s) }

/* ===== Auth (front-end) =====
   - Requer USUÁRIO e SENHA (variáveis VITE_ADMIN_USER e VITE_ADMIN_PASS)
   - Sessão expira em 12h e é vinculada ao usuário
*/
const HOURS_12 = 1000*60*60*12
export function login(user, pass){
  const u = (import.meta.env.VITE_ADMIN_USER || 'defina-o-usuario')
  const p = (import.meta.env.VITE_ADMIN_PASS || 'defina-a-senha')
  if(user === u && pass === p){
    const token = { user, exp: Date.now() + HOURS_12 }
    localStorage.setItem(AUTH, JSON.stringify(token))
    return true
  }
  return false
}
export function isAuthed(){
  try{
    const raw = localStorage.getItem(AUTH)
    if(!raw) return false
    const tok = JSON.parse(raw)
    if(!tok?.user || !tok?.exp) return false
    if(Date.now() > tok.exp) { logout(); return false }
    return true
  }catch{ return false }
}
export function logout(){ localStorage.removeItem(AUTH) }
export function currentUser(){
  try{ const t = JSON.parse(localStorage.getItem(AUTH)); return t?.user || null } catch { return null }
}


/* ===== Atualização de meta por atividade ===== */
export function updateAtividadeMeta(id, patch){
  const s = getState()
  const list = s.meta.atividades || []
  const idx = list.findIndex(a => String(a.id) === String(id))
  if(idx === -1) return
  const prev = list[idx] || {}
  s.meta.atividades[idx] = { ...prev, ...patch }
  saveState(s)
}
