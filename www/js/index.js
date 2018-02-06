/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        app.fillDate('fecha-content');
        $.getJSON('http://weisseamsel.altervista.org/nfcProject/detectionCRUD.php?what=0',function(data){
            jQuery.each(data, function(i,val){
                console.log(JSON.stringify(val));
                app.fillRow(val);
            });
        });
        app.removeLocalStorage();

    },
    removeLocalStorage:function(){
        localStorage.clear();
    },
    fillDate:function(idElement){
        var today = new Date();
        var day   = today.getDate();
        var month = today.getMonth()+1;
        var year  = today.getFullYear();
        var fecha = document.getElementById(idElement);
        fecha.innerHTML= day+"-"+month+"-"+year;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
       
    },
    putStatusColor:function(idElement, status){
        var element = document.getElementById(idElement);
        if(status == 'P' || status == 'p') element.style.backgroundColor = "lightsalmon";
        else if(status == 'A' || status == 'a') element.style.backgroundColor = "lightblue";
        else if(status == 'C' || status == 'c') element.style.backgroundColor =  "lightgreen";
    },

    putPriorityColor:function(idElement, priority){
        var element = document.getElementById(idElement);
        if(priority == 'AA' || priority == 'aa') element.style.backgroundColor = "red";
        else if(priority == "MM3" || priority == 'mm3') element.style.backgroundColor = "yellow";
        else element.style.backgroundColor = "purple";
    },
    sendDefectInformation:function(idDefect){
        var opID = document.getElementById("col_op"+idDefect).textContent;
        var prodID = document.getElementById("col_prod"+idDefect).textContent;
        var frequency = document.getElementById("col_frequency"+idDefect).textContent;
        var analisi = document.getElementById("col_analisi"+idDefect).textContent;
        var gravita = document.getElementById("col_gravita"+idDefect).textContent;
        var frequency_data = frequency.split("/");
        var defect = frequency_data['0'];
        var numberOfProducts = frequency_data['1'];
        localStorage.setItem("gravita",gravita);
        localStorage.setItem("opID",opID);
        localStorage.setItem("prodID",prodID);
        localStorage.setItem("frequency",frequency);
        localStorage.setItem("defect",defect);
        localStorage.setItem("numberOfProducts",numberOfProducts);
        localStorage.setItem("analisi",analisi);
    },

    setLink:function(idElement, idDefect){
        var element = document.getElementById(idElement);

        element.addEventListener('click',function(){
            app.sendDefectInformation(idDefect);
            window.location.href='rilevazione.html'; 
        });
    },

    fillRow: function(data){
        
        var container = document.getElementById('table_container');

        var row     = document.createElement("div");
        row.className   = "row";
        row.id      = "anomaly"+data["detectID"];
        
        var anomaly_code    = document.createElement("div");
        anomaly_code.className  = "col xl7 l7 m7 s7 table-cell center-align full-width no-margin no-padding table-col-1 cell truncate";
        anomaly_code.id     = "col_anomaly"+data["detectID"];
        anomaly_code.innerHTML = data["anomalycode"];

        var priority   = document.createElement("div");
        priority.className = "col xl4 l4 m4 s4 table-cell center-align full-width no-margin no-padding table-col-2 cell";
        priority.id    = "col_priority"+data["detectID"];
        priority.innerHTML = data["severity"];

        var status     = document.createElement("div");
        status.className   = "col xl1 l1 m1 s1 table-cell center-align full-width no-margin no-padding table-col-3 cell";
        status.id      = "col_status"+data["detectID"]; 
        status.innerHTML = data["status"];


        var opID = document.createElement("div");
        opID.className = "hidden";
        opID.id = "col_op"+data["detectID"];
        opID.innerHTML = data["opID"];

        var prodID = document.createElement("div");
        prodID.className = "hidden";
        prodID.id = "col_prod"+data["detectID"];
        prodID.innerHTML = data["prodID"];

        var frequency = document.createElement("div");
        frequency.className = "hidden";
        frequency.id = "col_frequency"+data["detectID"];
        frequency.innerHTML = data["frequency"];

        var analisi = document.createElement("div");
        analisi.className = "hidden";
        analisi.id = "col_analisi"+data["detectID"];
        analisi.innerHTML = data["4M"];

        var gravita = document.createElement("div");
        gravita.className = "hidden";
        gravita.id = "col_gravita"+data["detectID"];
        gravita.innerHTML = data["priority"];

        row.appendChild(opID);
        row.appendChild(prodID);
        row.appendChild(frequency);
        row.appendChild(analisi);
        row.appendChild(gravita);

             
        row.appendChild(anomaly_code);
        row.appendChild(priority);
        row.appendChild(status);

        container.appendChild(row);

        // Putting colors     
        app.putStatusColor(status.id, data["status"]);
        app.putPriorityColor(priority.id, data["severity"]);

        app.setLink(anomaly_code.id, data["defectID"]);
            
    }
   
};

app.initialize();