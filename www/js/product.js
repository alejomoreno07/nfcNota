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

var localStorage = window.localStorage;



var app = {
    // Application Constructor
    op:0,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        app.fillDate('fecha-content');
        app.getInformation();
        app.setSubmit('send-btn-div');
    },
    operation_enable: function(){
        app.operation.click=true;
    },
    onNfc: function(nfcEvent){
        // Operation
        if(app.op == 1){
            var tag = nfcEvent.tag,
            ndefMessage = tag.ndefMessage;
            app.fillData(ndefMessage,'operation-name',0);
            app.fillData(ndefMessage,'operation-line',1);
            app.fillData(ndefMessage,'operation-op',2);
            app.noOperation;
        }
        // Product
        else if(app.op == 2){
            var tag = nfcEvent.tag,
            ndefMessage = tag.ndefMessage;
            app.fillData(ndefMessage,'product-name',0);
            app.fillData(ndefMessage,'product-pippo',1);
            app.noOperation;
        }
        
    },
    fillDate:function(idElement){
        var today = new Date();
        var day   = today.getDate();
        var month = today.getMonth()+1;
        var year  = today.getFullYear();
        var fecha = document.getElementById(idElement);
        fecha.innerHTML= day+"-"+month+"-"+year;
    },
    setSubmit:function(idElement){
        var element = document.getElementById(idElement);

        element.addEventListener('click',function(){
            
            if(app.fieldsValidation()){
                app.sendInformation();
                window.location.href='photo.html';   
            }else{
                alert('All the fields must be filled in order to proceed.');
            }

        });
    },
    setData:function(idElement, data){
        var element = document.getElementById(idElement);
        element.value = data;
        element.nextElementSibling.className ="active";
    },
    setPossibleData:function(idElement, data){
        var element = document.getElementById(idElement);
        if(data != null){
            element.value = data;
            element.nextElementSibling.className = "active";
        }
    },
    setPossibleChecked:function(idElement, data){
        if(data != null && data != 1){
            var idName = idElement + data;
            var element = document.getElementById(idName);
            element.checked = true;
        }else{
            var defaultName = idElement + "1";
            var defaultElement = document.getElementById(defaultName);
            defaultElement.checked = true;
        }
        
    },
    setFecha:function(date){
        var element = document.getElementById("fecha-content");
        var fecha = date.split("-");
        var day = fecha['2'];
        var month = fecha['1'];
        var year = fecha['0'];
        element.innerHTML = day+"/"+month+"/"+year;
    },
    getInformation:function(){
        var gravita = localStorage.getItem("gravita");
        var defect = localStorage.getItem("defect");
        var product_number = localStorage.getItem("numberOfProducts");
        var name  = localStorage.getItem("product_name");
        var pippo = localStorage.getItem("product_pippo");
        var date = localStorage.getItem("fecha");

        app.setFecha(date);
        
        app.setData('product-name',name);
        app.setData('product-pippo',pippo);

        if(gravita != null){
            app.setPossibleChecked('op',gravita);
            //localStorage.removeItem("gravita"); 
        }else{  
            gravita = localStorage.getItem("severity");
            app.setPossibleChecked('op',gravita);    
        }
        if(defect != null){
            app.setPossibleData('defect_number', defect);
            localStorage.removeItem("defect");
        }else{
            defect = localStorage.getItem("defect_number");
            app.setPossibleData('defect_number', defect);
        }
        if(product_number != null){
            app.setPossibleData('product_number',product_number);
            localStorage.removeItem("numberOfProducts");   
        }else{
            product_number = localStorage.getItem("product_number");
            app.setPossibleData('product_number',product_number);
        }
                    
    },
    sendInformation:function(){
        var defect_number  = document.getElementById('defect_number').value;
        var product_number = document.getElementById('product_number').value;
        var severity       = $("input[name=severity]:checked").next().text();
        var frequency = defect_number+"/"+product_number;
        localStorage.setItem('frequency',frequency);
        localStorage.setItem('defect_number',defect_number);
        localStorage.setItem('product_number',product_number);
        localStorage.setItem('severity',severity);
    },
    fieldsValidation:function(){
        var defect_number = document.getElementById('defect_number').value;
        var product_number = document.getElementById('product_number').value;
        return defect_number!='' && product_number!='';

    },
    setNfcEvent:function(idElement,op){
        var element=document.getElementById(idElement);
        element.addEventListener('click',function(){
            app.op = op;
            nfc.addNdefListener(
                app.onNfc,
                function () { // success callback
                },
                function (error) { // error callback
                    alert("Error adding NDEF listener " + JSON.stringify(error));
                }
            );

        });
    },
    noOperation:function(){
        app.op=0;
    },
    fillData:function(ndefMessage,idElement,indexPayload){
        var element = document.getElementById(idElement);
        element.value = nfc.bytesToString(ndefMessage[indexPayload].payload).substring(3);
        element.nextElementSibling.className ="active";
    },

    display: function(message){
        app.clear();
        var label = document.createTextNode(message);
        var linebreak = document.createElement("br");
        messageDiv.appendChild(linebreak);
        messageDiv.appendChild(label);
    }

   
};

app.initialize();