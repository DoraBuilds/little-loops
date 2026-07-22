import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseChildProfileRepository } from '@/lib/data/supabase-child-profile-repository';
import { SupabaseScheduleRepository } from '@/lib/data/supabase-schedule-repository';
import { cloneSchedules, createCroatiaSummerSchedule, SCHEDULE_DAYS, timeToMinutes, type HouseholdSchedules, type ScheduleDay, type ScheduleItem, type SchedulePlan } from '@/lib/summer-schedule';

const ink='#3d2c1f', mute='#8a7866', blue='#0ea5e9', font="'Fredoka',system-ui,sans-serif";
const input:CSSProperties={width:'100%',boxSizing:'border-box',border:'1.5px solid rgba(14,165,233,.18)',borderRadius:12,padding:'10px 12px',fontFamily:font,fontSize:15,fontWeight:600,color:ink,background:'#fff'};
const button=(background:string,color='#fff'):CSSProperties=>({border:'none',borderRadius:12,padding:'10px 14px',background,color,fontFamily:font,fontSize:14,fontWeight:800,cursor:'pointer'});
const errorMessage=(error:unknown)=>error instanceof Error?error.message:typeof error==='object'&&error!==null&&'message'in error?String(error.message):'Unknown Supabase error.';

interface DraggableTaskProps{entry:ScheduleItem;items:ScheduleItem[];selectedDay:ScheduleDay;taskTarget:ScheduleDay;onUpdateItems:(items:ScheduleItem[])=>void;onSetTaskTarget:(day:ScheduleDay)=>void;onCopyTask:(entry:ScheduleItem)=>void}
function DraggableTask({entry,items,selectedDay,taskTarget,onUpdateItems,onSetTaskTarget,onCopyTask}:DraggableTaskProps){
  const dragControls=useDragControls();
  const patch=(change:Partial<ScheduleItem>)=>onUpdateItems(items.map(item=>item.id===entry.id?{...item,...change}:item));
  return <Reorder.Item value={entry} dragListener={false} dragControls={dragControls} whileDrag={{scale:1.01,boxShadow:'0 14px 28px rgba(14,165,233,.18)',zIndex:10}} style={{display:'grid',gridTemplateColumns:'42px 105px 62px 1fr auto',gap:9,alignItems:'center',padding:11,borderRadius:16,background:'#f8fafc',position:'relative'}}>
    <button type="button" aria-label={`Drag ${entry.title}`} onPointerDown={event=>dragControls.start(event)} style={{width:38,height:62,borderRadius:12,border:'1.5px solid rgba(14,165,233,.14)',background:'#e0f2fe',color:'#0369a1',fontSize:22,fontWeight:900,cursor:'grab',touchAction:'none',fontFamily:font}} title="Drag to move this activity">≡</button>
    <input type="time" value={entry.time} onChange={event=>patch({time:event.target.value})} style={input}/>
    <input value={entry.icon} onChange={event=>patch({icon:event.target.value})} style={{...input,textAlign:'center',fontSize:22,padding:'9px 5px'}}/>
    <div>
      <input value={entry.title} onChange={event=>patch({title:event.target.value})} style={{...input,fontSize:17,fontWeight:800}}/>
      <input value={entry.note??''} onChange={event=>patch({note:event.target.value})} placeholder="Optional note" style={{...input,marginTop:6,fontSize:14}}/>
      <div style={{display:'flex',gap:7,marginTop:7,alignItems:'center',flexWrap:'wrap'}}>
        <select value={taskTarget} onChange={event=>onSetTaskTarget(event.target.value as ScheduleDay)} style={{...input,width:'auto',minWidth:145,padding:'8px 9px',fontSize:13}}>{SCHEDULE_DAYS.filter(day=>day!==selectedDay).map(day=><option key={day} value={day}>Copy task to {day}</option>)}</select>
        <button type="button" onClick={()=>onCopyTask(entry)} style={{...button('#e0f2fe','#0369a1'),padding:'8px 10px',fontSize:13}}>Copy task</button>
      </div>
    </div>
    <button type="button" aria-label={`Delete ${entry.title}`} onClick={()=>onUpdateItems(items.filter(item=>item.id!==entry.id))} style={button('#fee2e2','#b91c1c')}>×</button>
  </Reorder.Item>;
}

export default function SchedulesPage(){
  const navigate=useNavigate();
  const {household,householdStatus,status:authStatus}=useAuth();
  const [children,setChildren]=useState<Array<{id:string;name:string}>>([]);
  const [schedules,setSchedules]=useState<HouseholdSchedules>([]);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [selectedDay,setSelectedDay]=useState<ScheduleDay>('Monday');
  const [copyTarget,setCopyTarget]=useState<ScheduleDay>('Tuesday');
  const [taskCopyTargets,setTaskCopyTargets]=useState<Record<string,ScheduleDay>>({});
  const [status,setStatus]=useState<'loading'|'idle'|'saving'|'saved'|'error'>('loading');
  const [error,setError]=useState<string|null>(null);
  const [childWarning,setChildWarning]=useState<string|null>(null);
  const selected=useMemo(()=>schedules.find(schedule=>schedule.id===selectedId)??null,[schedules,selectedId]);

  useEffect(()=>{
    if(authStatus==='loading'||householdStatus==='idle'||householdStatus==='loading'){setStatus('loading');return;}
    const supabase=getSupabaseClient();
    if(!household||!supabase){setError('Your signed-in household could not be loaded. Please return to the app and sign in again.');setStatus('error');return;}
    let cancelled=false;setStatus('loading');setError(null);setChildWarning(null);
    const scheduleRepo=new SupabaseScheduleRepository(supabase),childRepo=new SupabaseChildProfileRepository(supabase);
    void scheduleRepo.load(household.id).then(loaded=>{if(cancelled)return;setSchedules(loaded);setSelectedId(loaded[0]?.id??null);setStatus('idle');}).catch(loadError=>{if(cancelled)return;console.error('Could not load schedules',loadError);setError(errorMessage(loadError));setStatus('error');});
    void childRepo.listByHousehold(household.id).then(profiles=>{if(cancelled)return;setChildren(profiles.map(child=>({id:child.id,name:child.name})));}).catch(childError=>{if(cancelled)return;console.error('Could not load child profiles for schedules',childError);setChildWarning(`Schedules loaded, but child assignments are temporarily unavailable: ${errorMessage(childError)}`);});
    return()=>{cancelled=true;};
  },[authStatus,household,householdStatus]);

  useEffect(()=>{setCopyTarget(SCHEDULE_DAYS.find(day=>day!==selectedDay)??'Monday');setTaskCopyTargets({});},[selectedDay]);
  const updatePlan=(patch:Partial<SchedulePlan>)=>setSchedules(previous=>previous.map(schedule=>schedule.id===selectedId?{...schedule,...patch}:schedule));
  const updateItems=(items:ScheduleItem[])=>{if(selected)updatePlan({days:{...selected.days,[selectedDay]:items}});};
  const createPlan=()=>{const plan=createCroatiaSummerSchedule(children.map(child=>child.id));setSchedules(previous=>[...previous,plan]);setSelectedId(plan.id);};
  const addItem=()=>updateItems([...(selected?.days[selectedDay]??[]),{id:crypto.randomUUID(),time:'15:00',title:'New activity',icon:'⭐'}]);
  const reorderItems=(reordered:ScheduleItem[])=>{const originalTimes=(selected?.days[selectedDay]??[]).map(item=>item.time).sort((a,b)=>timeToMinutes(a)-timeToMinutes(b));updateItems(reordered.map((item,index)=>({...item,time:originalTimes[index]??item.time})));};
  const copyDay=()=>{if(!selected||copyTarget===selectedDay)return;updatePlan({days:{...selected.days,[copyTarget]:(selected.days[selectedDay]??[]).map(item=>({...item,id:crypto.randomUUID()}))}});setSelectedDay(copyTarget);};
  const copyTask=(entry:ScheduleItem)=>{if(!selected)return;const target=taskCopyTargets[entry.id]??SCHEDULE_DAYS.find(day=>day!==selectedDay)??'Monday';if(target===selectedDay)return;const targetItems=[...(selected.days[target]??[]),{...entry,id:crypto.randomUUID()}].sort((a,b)=>timeToMinutes(a.time)-timeToMinutes(b.time));updatePlan({days:{...selected.days,[target]:targetItems}});};
  const save=async()=>{const supabase=getSupabaseClient();if(!household||!supabase)return;setStatus('saving');setError(null);const cleaned=cloneSchedules(schedules).map(schedule=>({...schedule,days:Object.fromEntries(Object.entries(schedule.days).map(([day,items])=>[day,(items??[]).slice().sort((a,b)=>timeToMinutes(a.time)-timeToMinutes(b.time))]))}));try{await new SupabaseScheduleRepository(supabase).save(household.id,cleaned);setSchedules(cleaned);setStatus('saved');window.setTimeout(()=>setStatus('idle'),1500);}catch(saveError){console.error('Could not save schedules',saveError);setError(errorMessage(saveError));setStatus('error');}};
  const createDisabled=status==='loading'||status==='error',dayItems=selected?.days[selectedDay]??[];

  return <div style={{minHeight:'100vh',background:'#fff9f0',fontFamily:font,color:ink,padding:'22px 16px'}}><div style={{maxWidth:1100,margin:'0 auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,marginBottom:20,flexWrap:'wrap'}}><div><button onClick={()=>navigate('/')} style={{...button('#fff',ink),border:'1.5px solid rgba(0,0,0,.08)',marginBottom:10}}>← Back</button><div style={{fontSize:13,fontWeight:800,color:blue,textTransform:'uppercase',letterSpacing:'.1em'}}>Parent settings</div><h1 style={{margin:'4px 0 0',fontSize:36,lineHeight:1.05}}>Schedules</h1><p style={{margin:'8px 0 0',color:mute,fontSize:16,lineHeight:1.4}}>Create reusable plans, assign them to children, and choose which one is active.</p></div><button onClick={createPlan} disabled={createDisabled} style={{...button(blue),opacity:createDisabled?0.55:1}}>+ Create schedule</button></div>
    {childWarning&&<div style={{padding:14,borderRadius:14,background:'#fef3c7',color:'#92400e',marginBottom:14,fontSize:14}}>{childWarning}</div>}
    {status==='loading'?<div style={{fontSize:16}}>Loading…</div>:status==='error'?<div style={{padding:16,borderRadius:14,background:'#fee2e2',color:'#b91c1c',fontSize:15}}><strong>Could not load or save schedules.</strong><div style={{marginTop:6,fontSize:14}}>{error}</div><button onClick={()=>window.location.reload()} style={{...button('#fff','#b91c1c'),marginTop:10}}>Try again</button></div>:<div style={{display:'grid',gridTemplateColumns:'minmax(220px,280px) minmax(0,1fr)',gap:16}}>
      <aside style={{background:'#fff',borderRadius:20,padding:14,border:'1.5px solid rgba(0,0,0,.07)',height:'fit-content'}}>{schedules.length===0?<div style={{padding:14,color:mute,fontSize:15}}>No schedules yet.</div>:schedules.map(schedule=><button key={schedule.id} onClick={()=>setSelectedId(schedule.id)} style={{width:'100%',textAlign:'left',padding:12,marginBottom:8,borderRadius:14,border:schedule.id===selectedId?`2px solid ${blue}`:'1.5px solid rgba(0,0,0,.07)',background:schedule.id===selectedId?'#e0f2fe':'#fff',fontFamily:font,cursor:'pointer'}}><div style={{fontWeight:800,fontSize:17}}>{schedule.name}</div><div style={{fontSize:13,color:mute,marginTop:3}}>{schedule.active?'Active':'Inactive'} · {schedule.childIds.length===0?'All children':`${schedule.childIds.length} assigned`}</div></button>)}</aside>
      <main>{!selected?<div style={{background:'#fff',borderRadius:20,padding:28,textAlign:'center',color:mute,fontSize:16}}>Create or select a schedule.</div>:<div style={{background:'#fff',borderRadius:20,padding:18,border:'1.5px solid rgba(0,0,0,.07)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'start'}}><div><input value={selected.name} onChange={event=>updatePlan({name:event.target.value})} style={{...input,fontSize:20,fontWeight:800}}/><input value={selected.description??''} onChange={event=>updatePlan({description:event.target.value})} placeholder="Description" style={{...input,marginTop:7}}/></div><label style={{display:'flex',gap:7,alignItems:'center',fontWeight:800,fontSize:15}}><input type="checkbox" checked={selected.active} onChange={event=>{const checked=event.target.checked;setSchedules(previous=>previous.map(schedule=>({...schedule,active:schedule.id===selected.id?checked:checked?false:schedule.active})));}} style={{width:18,height:18}}/>Active</label></div>
        <div style={{marginTop:16,fontWeight:800,fontSize:16}}>Applies to</div><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>{children.map(child=><label key={child.id} style={{padding:'8px 11px',borderRadius:99,background:selected.childIds.includes(child.id)?'#e0f2fe':'#f5ede2',cursor:'pointer',fontSize:14,fontWeight:700}}><input type="checkbox" checked={selected.childIds.includes(child.id)} onChange={event=>updatePlan({childIds:event.target.checked?[...selected.childIds,child.id]:selected.childIds.filter(id=>id!==child.id)})} style={{width:16,height:16,marginRight:5}}/>{child.name}</label>)}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginTop:18}}>{SCHEDULE_DAYS.map(day=><button key={day} onClick={()=>setSelectedDay(day)} style={{...button(day===selectedDay?blue:'#f0f9ff',day===selectedDay?'#fff':'#0369a1'),padding:'9px 3px',fontSize:13}}>{day.slice(0,3)}</button>)}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginTop:18,flexWrap:'wrap'}}><div><h2 style={{margin:0,fontSize:24}}>{selectedDay}</h2><div style={{color:mute,fontSize:13,marginTop:2}}>Drag activities by the ≡ handle. Time slots stay in place.</div></div><div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}><select value={copyTarget} onChange={event=>setCopyTarget(event.target.value as ScheduleDay)} style={{...input,width:'auto',minWidth:145}}>{SCHEDULE_DAYS.filter(day=>day!==selectedDay).map(day=><option key={day} value={day}>Copy to {day}</option>)}</select><button onClick={copyDay} style={button('#e0f2fe','#0369a1')}>Copy day</button><button onClick={addItem} style={button(blue)}>+ Activity</button></div></div>
        <Reorder.Group axis="y" values={dayItems} onReorder={reorderItems} style={{display:'flex',flexDirection:'column',gap:10,marginTop:12,padding:0,listStyle:'none'}}>{dayItems.map(entry=><DraggableTask key={entry.id} entry={entry} items={dayItems} selectedDay={selectedDay} taskTarget={taskCopyTargets[entry.id]??SCHEDULE_DAYS.find(day=>day!==selectedDay)??'Monday'} onUpdateItems={updateItems} onSetTaskTarget={day=>setTaskCopyTargets(previous=>({...previous,[entry.id]:day}))} onCopyTask={copyTask}/>)}</Reorder.Group>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:10,marginTop:18}}><span style={{fontSize:14,color:status==='saved'?'#15803d':mute}}>{status==='saving'?'Saving…':status==='saved'?'Saved to cloud':''}</span><button onClick={()=>void save()} style={button(blue)}>Save schedules</button></div>
      </div>}</main>
    </div>}
  </div></div>;
}