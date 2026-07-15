import { useEffect, useMemo, useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot } from '@/lib/mascots';
import { cloneSummerSchedule, DEFAULT_SUMMER_SCHEDULE, getTodaySummerDay, loadSummerSchedule, saveSummerSchedule, SUMMER_DAYS, timeToMinutes, type SummerDay, type SummerSchedule, type SummerScheduleItem } from '@/lib/summer-schedule';
import type { Child } from '@/lib/types';

interface ScheduleTabProps { kid: Child }
const INK='#3d2c1f', MUTE='#8a7866', BLUE='#0ea5e9';

export const ScheduleTab=({kid}:ScheduleTabProps)=>{
  const [selectedDay,setSelectedDay]=useState<SummerDay>(()=>getTodaySummerDay());
  const [schedule,setSchedule]=useState<SummerSchedule>(()=>loadSummerSchedule());
  const [draft,setDraft]=useState<SummerSchedule>(()=>loadSummerSchedule());
  const [editing,setEditing]=useState(false);
  const [now,setNow]=useState(()=>new Date());
  const mascot=getMascot(kid.mascotId??kid.avatarAnimal);
  const today=getTodaySummerDay(now);
  const items=schedule[selectedDay];

  useEffect(()=>{const timer=window.setInterval(()=>setNow(new Date()),60000);return()=>window.clearInterval(timer);},[]);
  const timing=useMemo(()=>{if(selectedDay!==today||[0,6].includes(now.getDay()))return{currentIndex:-1,nextIndex:-1};const minutes=now.getHours()*60+now.getMinutes();const nextIndex=items.findIndex(entry=>timeToMinutes(entry.time)>minutes);return{currentIndex:nextIndex===0?-1:nextIndex===-1?items.length-1:nextIndex-1,nextIndex};},[items,now,selectedDay,today]);
  const current=timing.currentIndex>=0?items[timing.currentIndex]:null;
  const next=timing.nextIndex>=0?items[timing.nextIndex]:null;

  const updateEntry=(id:string,patch:Partial<SummerScheduleItem>)=>setDraft(prev=>({...prev,[selectedDay]:prev[selectedDay].map(entry=>entry.id===id?{...entry,...patch}:entry)}));
  const removeEntry=(id:string)=>setDraft(prev=>({...prev,[selectedDay]:prev[selectedDay].filter(entry=>entry.id!==id)}));
  const addEntry=()=>setDraft(prev=>({...prev,[selectedDay]:[...prev[selectedDay],{id:`custom-${Date.now()}`,time:'15:00',title:'New activity',icon:'⭐'}]}));
  const save=()=>{const cleaned=cloneSummerSchedule(draft);SUMMER_DAYS.forEach(day=>cleaned[day].sort((a,b)=>timeToMinutes(a.time)-timeToMinutes(b.time)));saveSummerSchedule(cleaned);setSchedule(cleaned);setDraft(cloneSummerSchedule(cleaned));setEditing(false);};
  const cancel=()=>{setDraft(cloneSummerSchedule(schedule));setEditing(false);};
  const reset=()=>{if(!window.confirm('Reset the whole summer schedule to the original plan?'))return;const fresh=cloneSummerSchedule(DEFAULT_SUMMER_SCHEDULE);saveSummerSchedule(fresh);setSchedule(fresh);setDraft(cloneSummerSchedule(fresh));};

  return <div style={{height:'100%',overflowY:'auto',paddingBottom:88,background:'linear-gradient(180deg,#fff9f0 0%,#e0f2fe 100%)',fontFamily:"'Fredoka',system-ui,sans-serif",color:INK}}>
    <PainterlyBanner label={`${mascot.emoji} ${kid.name}'s`} title="Summer Schedule" palette="purple" />
    <div style={{padding:'0 14px 20px'}}>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginBottom:10}}>
        {!editing?<button type="button" onClick={()=>{setDraft(cloneSummerSchedule(schedule));setEditing(true);}} style={buttonStyle(BLUE)}>✏️ Parent edit</button>:<><button type="button" onClick={cancel} style={buttonStyle('#fff',INK)}>Cancel</button><button type="button" onClick={save} style={buttonStyle(BLUE)}>Save changes</button></>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6}}>{SUMMER_DAYS.map(day=><button key={day} type="button" onClick={()=>setSelectedDay(day)} style={{border:day===selectedDay?`2px solid ${BLUE}`:'1.5px solid rgba(14,165,233,.14)',background:day===selectedDay?'#e0f2fe':'#fff',borderRadius:14,padding:'9px 2px 7px',fontFamily:'inherit',color:day===selectedDay?'#0369a1':MUTE,cursor:'pointer'}}><div style={{fontSize:10,fontWeight:800}}>{day.slice(0,3).toUpperCase()}</div><div style={{fontSize:12,height:14,marginTop:2}}>{day===today&&now.getDay()>=1&&now.getDay()<=5?'●':'·'}</div></button>)}</div>

      {editing?<div style={{marginTop:14,background:'#fff',borderRadius:22,padding:14,border:'1.5px solid rgba(14,165,233,.12)',boxShadow:'0 5px 16px rgba(14,165,233,.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginBottom:12}}><div><div style={{fontSize:18,fontWeight:800}}>Edit {selectedDay}</div><div style={{fontSize:12,color:MUTE}}>Changes appear in the child timetable after saving.</div></div><button type="button" onClick={addEntry} style={buttonStyle(BLUE)}>+ Activity</button></div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>{draft[selectedDay].map(entry=><div key={entry.id} style={{display:'grid',gridTemplateColumns:'86px 58px 1fr auto',gap:7,alignItems:'center',background:'#f8fafc',borderRadius:14,padding:8}}>
          <input aria-label="Time" type="time" value={entry.time} onChange={e=>updateEntry(entry.id,{time:e.target.value})} style={inputStyle}/>
          <input aria-label="Emoji" value={entry.icon} onChange={e=>updateEntry(entry.id,{icon:e.target.value})} style={{...inputStyle,textAlign:'center',fontSize:20,padding:'7px 4px'}}/>
          <div style={{display:'flex',flexDirection:'column',gap:5}}><input aria-label="Activity" value={entry.title} onChange={e=>updateEntry(entry.id,{title:e.target.value})} style={inputStyle}/><input aria-label="Note" placeholder="Optional note" value={entry.note??''} onChange={e=>updateEntry(entry.id,{note:e.target.value})} style={{...inputStyle,fontSize:12}}/></div>
          <button type="button" aria-label={`Delete ${entry.title}`} onClick={()=>removeEntry(entry.id)} style={{border:'none',background:'#fee2e2',color:'#b91c1c',borderRadius:10,width:34,height:34,cursor:'pointer'}}>×</button>
        </div>)}</div>
        <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:14}}><button type="button" onClick={reset} style={buttonStyle('#fff1f2','#be123c')}>Reset all</button><button type="button" onClick={save} style={buttonStyle(BLUE)}>Save schedule</button></div>
      </div>:<>
        {selectedDay===today&&now.getDay()>=1&&now.getDay()<=5&&<div style={{marginTop:12,borderRadius:18,background:'linear-gradient(135deg,#0ea5e9,#38bdf8)',color:'#fff',padding:'12px 14px',display:'flex',alignItems:'center',gap:12,boxShadow:'0 6px 16px rgba(14,165,233,.2)'}}><div style={{fontSize:28}}>{current?.icon??'☀️'}</div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:800,opacity:.78,letterSpacing:'.1em'}}>{current?'NOW':'COMING UP'}</div><div style={{fontSize:16,fontWeight:700}}>{current?.title??next?.title??'Enjoy your morning'}</div>{next&&<div style={{fontSize:11,opacity:.82}}>Next: {next.title} at {next.time}</div>}</div></div>}
        <div style={{marginTop:14,background:'#fff',borderRadius:22,padding:'12px 10px',border:'1.5px solid rgba(14,165,233,.1)',boxShadow:'0 5px 16px rgba(14,165,233,.08)'}}><div style={{padding:'0 8px 9px',fontSize:11,fontWeight:800,color:'#0369a1',letterSpacing:'.1em',textTransform:'uppercase'}}>{selectedDay}'s timetable</div><div style={{display:'flex',flexDirection:'column',gap:7}}>{items.map((entry,index)=>{const active=index===timing.currentIndex;return <div key={entry.id} style={{display:'grid',gridTemplateColumns:'54px 1fr',gap:8,alignItems:'stretch'}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:active?'#0369a1':MUTE}}>{entry.time}</div><div style={{borderRadius:15,padding:'10px 12px',background:active?'#bae6fd':index%2===0?'#f0f9ff':'#fff9f0',border:active?`2px solid ${BLUE}`:'1.5px solid rgba(180,120,80,.06)',display:'flex',alignItems:'center',gap:10}}><div style={{fontSize:23,width:30,textAlign:'center'}}>{entry.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{entry.title}</div>{entry.note&&<div style={{fontSize:10,color:MUTE,marginTop:2}}>{entry.note}</div>}</div>{active&&<div style={{borderRadius:99,background:BLUE,color:'#fff',padding:'3px 7px',fontSize:9,fontWeight:800}}>NOW</div>}</div></div>})}</div></div>
      </>}
    </div>
  </div>;
};

const inputStyle:React.CSSProperties={width:'100%',boxSizing:'border-box',border:'1.5px solid rgba(14,165,233,.16)',borderRadius:10,padding:'8px 9px',fontFamily:"'Fredoka',system-ui,sans-serif",color:INK,background:'#fff'};
const buttonStyle=(background:string,color='#fff'):React.CSSProperties=>({border:'none',background,color,borderRadius:12,padding:'9px 12px',fontFamily:"'Fredoka',system-ui,sans-serif",fontSize:12,fontWeight:800,cursor:'pointer'});
