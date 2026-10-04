const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'midas2024secret';
app.use(cors());
app.use(express.json());
let state = {tradingEnabled:true,riskMultiplier:1,openTrades:0,maxTrades:3,dailyPnLPct:0,equity:0,balance:0,positions:[],signals:[],plans:[],history:[],lastEvent:''};
let commands=[];
function checkKey(req,res,next){if(req.headers['x-api-key']!==API_KEY)return res.status(401).send('bad key');next();}
app.post('/api/status',checkKey,(req,res)=>{Object.assign(state,req.body);if(req.body.event)state.lastEvent=req.body.event;res.send('ok');});
app.post('/api/dashboard',checkKey,(req,res)=>{state.equity=req.body.equity||state.equity;state.balance=req.body.balance||state.balance;state.signals=req.body.signals||state.signals;state.plans=req.body.plans||state.plans;state.history=req.body.history||state.history;res.send('ok');});
app.get('/api/dashboard/full',checkKey,(req,res)=>{res.json(state);});
app.get('/api/commands/pending',checkKey,(req,res)=>{res.json(commands);commands=[];});
app.post('/api/commands',checkKey,(req,res)=>{commands.push(req.body);res.json({ok:true});});
app.get('/',(req,res)=>res.send('Midas Edge Bridge ONLINE'));
app.listen(PORT,()=>console.log('Bridge running'));
