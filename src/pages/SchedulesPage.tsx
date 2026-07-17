import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseChildProfileRepository } from '@/lib/data/supabase-child-profile-repository';
import { SupabaseScheduleRepository } from '@/lib/data/supabase-schedule-repository';
import { cloneSchedules, createCroatiaSummerSchedule, SCHEDULE_DAYS, timeToMinutes, type HouseholdSchedules, type ScheduleDay, type ScheduleItem, type SchedulePlan } from '@/lib/summer-schedule';

const ink='#3d2c1f', mute='#8a7866', blue='#0ea5e9';
const input:CSSProperties={width:'100%',boxSizing:'border-box',border:'1.5px solid rgba(14,165,233,.18)',borderRadius:12,padding:'9px 10px',fontFamily:"'Fredoka',system-ui,sans-serif",fontSize:14,color:ink,background:'#fff'};
const button=(background:string,color='#fff'):CSSProperties=>({border:'none',borderRadius:12,padding:'10px 14px',background,color,fontFamily:"'Fredoka',system-ui,sans-serif",fontWeight:800,cursor:'pointer'});
const errorMessage=(error:unknown)=>error instanceof Error?error.message:typeof error==='object'&&error!==null&&'message'in error?String(error.message):'Unknown Supabase error.';

export default function SchedulesPage(){
  const navigate=useNavigate();
  const { household, householdStatus, status:authStatus }=useAuth();
  const [children,setChildren]=useState<Array<{id:string;name:string}>>([]);
  const [schedules,setSchedules]=useState<HouseholdSchedules>([]);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [selectedDay,setSelectedDay]=useState<ScheduleDay>('Monday');
  const [status,setStatus]=useState<'loading'|'idle'|'saving'|'saved'|'error'>('loading');
  const [error,setError]=useState<string|null>(null);
  const [childWarning,setChildWarning]=useState<string|null>(null);
  const selected=useMemo(()=>schedules.find(schedule=>schedule.id===selectedId)??null,[schedules,selectedId]);

  useEffect(()=>{
    if(authStatus==='loading'||householdStatus==='idle'||householdStatus==='loading'){setStatus('loading');return;}
    const supabase=getSupabaseClient();
    if(!household||!supabase){setError('Your signed-in household could not be loaded. Please return to the app and sign in again.');setStatus('error');return;}
    let cancelled=false;
    setStatus('loading');setError(null);setChildWarning(null);
    const scheduleRepo=new SupabaseScheduleRepository(supabase);
    const childRepo=new SupabaseChildProfileRepository(supabase);
    void scheduleRepo.load(household.id).then(loaded=>{
      if(cancelled)return;
      setSchedules(loaded);setSelectedId(loaded[0]?.id??null);setStatus('idle');
    }).catch(loadError=>{
      if(cancelled)return;
      console.error('Could not load schedules',loadError);
      setError(errorMessage(loadError));setStatus('error');
    });
    void childRepo.listByHousehold(household.id).then(profiles=>{
      if(cancelled)return;
      setChildren(profiles.map(child=>({id:child.id,name:child.name})));
    }).catch(childError=>{
      if(cancelled)return;
      console.error('Could not load child profiles for schedules',childError);
      setChildWarning(`Schedules loaded, but child assignments are temporarily unavailable: ${errorMessage(childError)}`);
    });
    return()=>{cancelled=true;};
  },[authStatus,household,householdStatus]);

  const updatePlan=(patch:Partial<SchedulePlan>)=>setSchedules(prev=>prev.map(schedule=>schedule.id===selectedId?{...schedule,...patch}:schedule));
  const updateItems=(items:ScheduleItem[])=>{if(!selected)return;updatePlan({days:{...selected.days,[selectedDay]:items}});};
  const createPlan=()=>{const plan=createCroatiaSummerSchedule(children.map(child=>child.id));setSchedules(prev=>[...prev,plan]);setSelectedId(plan.id);};
  const addItem=()=>updateItems([...(selected?.days[selectedDay]??[]),{id:crypto.randomUUID(),time:'15:00',title:'New activity',icon:'⭐'}]);
  const save=async()=>{const supabase=getSupabaseClient();if(!household||!supabase)return;setStatus('saving');setError(null);const cleaned=cloneSchedules(schedules).map(schedule=>({...schedule,days:Object.fromEntries(Object.entries(schedule.days).map(([day,items])=>[day,(items??[]).slice().sort((a,b)=>timeToMinutes(a.time)-timeToMinutes(b.time))]))}));try{await new SupabaseScheduleRepository(supabase).save(household.id,cleaned);setSchedules(cleaned);setStatus('saved');window.setTimeout(()=>setStatus('idle'),1500);}catch(saveError){console.error('Could not save schedules',saveError);setError(errorMessage(saveError));setStatus('error');}};

  return <div style={{minHeight:'100vh',background:'#fff9f0',fontFamily:"'Fredoka',system-ui,sans-serif",color:ink,padding:'24px 16px'}}><div style={{maxWidth:1100,margin:'0 auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:20}}><div><button onClick={()=>navigate('/')} style={{...button('#fff',ink),border:'1px solid rgba(0,0,0,.08)',marginBottom:10}}>← Back</button><div style={{fontSize:13,fontWeight:800,color:blue,textTransform:'uppercase',letterSpacing:'.12em'}}>Parent settings</div><h1 style={{margin:'4px 0 0',fontSize:36}}>Schedules</h1><p style={{margin:'6px 0 0',color:mute}}>Create reusable plans, assign them to children, and choose which one is active.</p></div><button onClick={createPlan} disabled={status==='loading'||status==='error'} style={{...button(blue),opacity:status==='loading'||status==='error'?.55:1}}>+ Create schedule</button></div>
    {childWarning&&<div style={{padding:14,borderRadius:14,background:'#fef3c7',color:'#92400e',marginBottom:14}}>{childWarning}</div>}
    {status==='loading'?<div>Loading…</div>:status==='error'?<div style={{padding:16,borderRadius:14,background:'#fee2e2',color:'#b91c1c'}}><strong>Could not load or save schedules.</strong><div style={{marginTop:6,fontSize:14}}>{error}</div><button onClick={()=>window.location.reload()} style={{...button('#fff','#b91c1c'),marginTop:12}}>Try again</button></div>:<div style={{display:'grid',gridTemplateColumns:'minmax(220px,300px) minmax(0,1fr)',gap:18}}>
      <aside style={{background:'#fff',borderRadius:22,padding:14,border:'1px solid rgba(0,0,0,.07)',height:'fit-content'}}>{schedules.length===0?<div style={{padding:16,color:mute}}>No schedules yet.</div>:schedules.map(schedule=><button key={schedule.id} onClick={()=>setSelectedId(schedule.id)} style={{width:'100%',textAlign:'left',padding:12,marginBottom:7,borderRadius:14,border:schedule.id===selectedId?`2px solid ${blue}`:'1px solid rgba(0,0,0,.07)',background:schedule.id===selectedId?'#e0f2fe':'#fff',fontFamily:'inherit',cursor:'pointer'}}><div style={{fontWeight:800}}>{schedule.name}</div><div style={{fontSize:12,color:mute,marginTop:3}}>{schedule.active?'Active':'Inactive'} · {schedule.childIds.length===0?'All children':`${schedule.childIds.length} assigned`}</div></button>)}</aside>
      <main>{!selected?<div style={{background:'#fff',borderRadius:22,padding:28,textAlign:'center',color:mute}}>Create or select a schedule.</div>:<div style={{background:'#fff',borderRadius:22,padding:18,border:'1px solid rgba(0,0,0,.07)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'start'}}><div><input value={selected.name} onChange={e=>updatePlan({name:e.target.value})} style={{...input,fontSize:22,fontWeight:800}}/><input value={selected.description??''} onChange={e=>updatePlan({description:e.target.value})} placeholder="Description" style={{...input,marginTop:8}}/></div><label style={{display:'flex',gap:7,alignItems:'center',fontWeight:700}}><input type="checkbox" checked={selected.active} onChange={e=>{const checked=e.target.checked;setSchedules(prev=>prev.map(schedule=>({...schedule,active:schedule.id===selected.id?checked:checked?false:schedule.active})));}}/> Active</label></div>
        <div style={{marginTop:16,fontWeight:800}}>Applies to</div><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>{children.map(child=><label key={child.id} style={{padding:'8px 11px',borderRadius:99,background:selected.childIds.includes(child.id)?'#e0f2fe':'#f5ede2',cursor:'pointer'}}><input type="checkbox" checked={selected.childIds.includes(child.id)} onChange={e=>updatePlan({childIds:e.target.checked?[...selected.childIds,child.id]:selected.childIds.filter(id=>id!==child.id)})}/> {child.name}</label>)}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:5,marginTop:18}}>{SCHEDULE_DAYS.map(day=><button key={day} onClick={()=>setSelectedDay(day)} style={{...button(day===selectedDay?blue:'#f0f9ff',day===selectedDay?'#fff':'#0369a1'),padding:'9px 2px',fontSize:11}}>{day.slice(0,3)}</button>)}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}><h2 style={{margin:0}}>{selectedDay}</h2><button onClick={addItem} style={button(blue)}>+ Activity</button></div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10}}>{(selected.days[selectedDay]??[]).map(entry=><div key={entry.id} style={{display:'grid',gridTemplateColumns:'90px 60px 1fr auto',gap:8,alignItems:'center',padding:9,borderRadius:14,background:'#f8fafc'}}><input type="time" value={entry.time} onChange={e=>updateItems((selected.days[selectedDay]??[]).map(item=>item.id===entry.id?{...item,time:e.target.value}:item))} style={input}/><input value={entry.icon} onChange={e=>updateItems((selected.days[selectedDay]??[]).map(item=>item.id===entry.id?{...item,icon:e.target.value}:item))} style={{...input,textAlign:'center',fontSize:20}}/><div><input value={entry.title} onChange={e=>updateItems((selected.days[selectedDay]??[]).map(item=>item.id===entry.id?{...item,title:e.target.value}:item))} style={input}/><input value={entry.note??''} onChange={e=>updateItems((selected.days[selectedDay]??[]).map(item=>item.id===entry.id?{...item,note:e.target.value}:item))} placeholder="Optional note" style={{...input,marginTop:5,fontSize:12}}/></div><button onClick={()=>updateItems((selected.days[selectedDay]??[]).filter(item=>item.id!==entry.id))} style={button('#fee2e2','#b91c1c')}>×</button></div>)}</div>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:10,marginTop:18}}><span style={{fontSize:13,color:status==='saved'?'#15803d':mute}}>{status==='saving'?'Saving…':status==='saved'?'Saved to cloud':''}</span><button onClick={()=>void save()} style={button(blue)}>Save schedules</button></div>
      </div>}</main>
    </div>}
  </div></div>;
}
