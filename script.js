let heartChart;
let bpChart;
let tempChart;

document.getElementById("csvFile").addEventListener("change", function(event){

let file = event.target.files[0];
let reader = new FileReader();

reader.onload = function(e){

let rows = e.target.result.trim().split("\n");

let timestamps=[];
let heart=[];
let bp=[];
let temp=[];

let heartColors=[];
let bpColors=[];
let tempColors=[];

let alerts=document.getElementById("alerts");
alerts.innerHTML="";

let risk=0;

for(let i=1;i<rows.length;i++){

let data=rows[i].split(",");

let time=data[0];
let hr=parseFloat(data[1]);
let pressure=parseFloat(data[2]);
let temperature=parseFloat(data[3]);

timestamps.push(time);
heart.push(hr);
bp.push(pressure);
temp.push(temperature);

/* HEART RATE */

if(hr<50 || hr>120){
heartColors.push("red");
alerts.innerHTML += "<li>"+time+" ⚠ Heart Rate Critical: "+hr+"</li>";
risk+=20;
}
else{
heartColors.push("green");
}

/* BLOOD PRESSURE */

if(pressure<80 || pressure>160){
bpColors.push("red");
alerts.innerHTML += "<li>"+time+" ⚠ Blood Pressure Critical: "+pressure+"</li>";
risk+=20;
}
else{
bpColors.push("green");
}

/* TEMPERATURE */

if(temperature<35 || temperature>38.5){
tempColors.push("red");
alerts.innerHTML += "<li>"+time+" ⚠ Temperature Critical: "+temperature+"</li>";
risk+=20;
}
else{
tempColors.push("green");
}

}

/* PATIENT STATUS */

let status=document.getElementById("status");

if(alerts.innerHTML===""){
status.innerHTML="🟢 Patient Stable";
status.style.color="green";
}
else{
status.innerHTML="🔴 Patient Critical";
status.style.color="red";
}

/* AI RISK SCORE */

let riskBox=document.getElementById("riskScore");

if(risk==0){
riskBox.innerHTML="🟢 Risk Score: 10% (Stable)";
riskBox.style.color="green";
}
else if(risk<40){
riskBox.innerHTML="🟡 Risk Score: "+risk+"% (Moderate Risk)";
riskBox.style.color="orange";
}
else{
riskBox.innerHTML="🔴 Risk Score: "+risk+"% (High Risk)";
riskBox.style.color="red";
}

/* DESTROY OLD CHARTS */

if(heartChart) heartChart.destroy();
if(bpChart) bpChart.destroy();
if(tempChart) tempChart.destroy();

/* CREATE CHARTS */

heartChart=createChart("heartChart","Heart Rate",timestamps,heart,heartColors);
bpChart=createChart("bpChart","Blood Pressure",timestamps,bp,bpColors);
tempChart=createChart("tempChart","Temperature",timestamps,temp,tempColors);

};

reader.readAsText(file);

});


function createChart(id,label,labels,data,colors){

return new Chart(document.getElementById(id),{

type:'line',

data:{
labels:labels,
datasets:[{
label:label,
data:data,
borderColor:"#3498db",
pointBackgroundColor:colors,
pointRadius:6,
fill:false,
tension:0.2
}]
},

options:{
responsive:true,
plugins:{
legend:{display:true}
}
}

});

}