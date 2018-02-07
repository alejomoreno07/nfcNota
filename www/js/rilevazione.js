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
    newDefect:true,
    op:0,
    opID:-1,
    prodID:-1,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    setOpID:function(data){
        app.opID = data;
    },
    setProdID:function(data){
        app.prodID = data;
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        app.fillDate('fecha-content');
        app.setNfcEvent('operazione-search',1);
        app.setNfcEvent('product-search',2);
        app.setSubmit('send-btn-div');
        app.getInformation();
        app.setSelectDefect();
    },
    setSelectDefect:function(){
         $.getJSON('http://weisseamsel.altervista.org/nfcProject/defectCRUD.php?what=0',function(data){
            jQuery.each(data, function(i,val){
                var container = document.getElementById("defectSelect");

                var element = document.createElement("option");
                element.value = val['id'];
                element.innerHTML = val['type'];

                container.appendChild(element);
            });
            var defectID = localStorage.getItem("defectID");
            if(defectID != null){
                showForm(1);
                var element = document.getElementById("ansY");
                element.checked = false;
                var ansNo = document.getElementById("ansN");
                ansNo.checked=true;
                document.getElementById("defectSelect").value = defectID;
            }
        });


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
                window.location.href='product.html';   
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
    setOpInformation:function(data){
        var operation_name = 'operation-name';
        var value = data['operation'];
        app.setData(operation_name, value);

        var operation_line = 'operation-line';
            value  = data['line'];
        app.setData(operation_line,value);

        var operation_op = 'operation-op';
            value = data['area'];
        app.setData(operation_op,value);

    }, 
    setProdInformation:function(data){
        var product_name = 'product-name';
        var value = data['code'];
        app.setData(product_name,value);

        var product_pippo = 'product-pippo';
            value = data['description'];
        app.setData(product_pippo,value);
    }, 
    getOpInformation:function(opID){
        $.getJSON("http://weisseamsel.altervista.org/nfcProject/operationsCRUD.php?what=1&opID="+opID,function(data){
                    app.setOpInformation(data);
        });
    },
    getProdInformation:function(prodID){
        $.getJSON('http://weisseamsel.altervista.org/nfcProject/productCRUD.php?what=0',function(data){
            jQuery.each(data, function(i,val){
                if(val["prodID"] == prodID){
                    app.setProdInformation(val);
                }
            });
        });  
    },
    getInformation:function(){
        var opID = localStorage.getItem("opID");
        if(opID != null){
            app.getOpInformation(opID);
        }
        var prodID = localStorage.getItem("prodID");
        if(prodID != null){
            app.getProdInformation(prodID);
        }
    },
    sendInformation:function(){
        var operation_name = document.getElementById('operation-name').value;
        var operation_line = document.getElementById('operation-line').value;
        var operation_op   = document.getElementById('operation-op').value;
        var product_name   = document.getElementById('product-name').value;
        var product_pippo  = document.getElementById('product-pippo').value;
        var fecha = document.getElementById('fecha-content').value;
        localStorage.setItem('operation_name',operation_name);
        localStorage.setItem('operation_line',operation_line);
        localStorage.setItem('operation_op',operation_op);
        localStorage.setItem('product_name',product_name);
        localStorage.setItem('product_pippo',product_pippo);
        localStorage.setItem('fecha',fecha);
        localStorage.setItem('numberPics',1);

        var defectID = -1;

        if(app.newDefect){
            var defect_type = document.getElementById("defect_name").value;
            $.ajax({
                type: 'POST',
                // make sure you respect the same origin policy with this url:
                // http://en.wikipedia.org/wiki/Same_origin_policy
                url: 'http://weisseamsel.altervista.org/nfcProject/defectCRUD.php',
                data: { 
                    'what': 0, 
                    'type': defect_type
                },
                success: function(data){
                    localStorage.setItem("defectID",data);
                    localStorage.setItem("defect_description",defect_type);  
                }
            });

        }else{
            var defecto = document.getElementById("defectSelect");
            var defectID = defecto.options[defecto.selectedIndex].value;
            var defectDescription = defecto.options[defecto.selectedIndex].text;
            localStorage.setItem("defectID",defectID);
            localStorage.setItem("defect_description",defectDescription);
        }

        var opID = "-1";
        $.getJSON("http://weisseamsel.altervista.org/nfcProject/searchOp.php?area="+operation_name+"&line="+operation_line+"&operation="+operation_op,function(data){
            opID = data;
            if(opID != -1 && opID != "-1"){
                localStorage.setItem('opID',opID);
            }else{
                $.ajax({
                    type: 'POST',
                    // make sure you respect the same origin policy with this url:
                    // http://en.wikipedia.org/wiki/Same_origin_policy
                    url: 'http://weisseamsel.altervista.org/nfcProject/operationsCRUD.php',
                    data: { 
                        'what': 0, 
                        'area': operation_name, // <-- the $ sign in the parameter name seems unusual, I would avoid it
                        'line': operation_line,
                        'operation': operation_op 
                    },
                    success: function(data){
                        opID = data;
                        localStorage.setItem('opID',opID);

                    }
                });
            }
        });
        
        var prodID = "-1";
        $.getJSON("http://weisseamsel.altervista.org/nfcProject/searchProduct.php?code="+product_name+"&description="+product_pippo,function(data){
            prodID = data;
            if(prodID != -1 && prodID != "-1"){
                localStorage.setItem('prodID',prodID);
            }else{
                $.ajax({
                    type: 'POST',
                    // make sure you respect the same origin policy with this url:
                    // http://en.wikipedia.org/wiki/Same_origin_policy
                    url: 'http://weisseamsel.altervista.org/nfcProject/productCRUD.php',
                    data: { 
                        'what': 0, 
                        'code': product_name, // <-- the $ sign in the parameter name seems unusual, I would avoid it
                        'description': product_pippo,
                        'value': 1000 
                    },
                    success: function(data){
                        prodID = data;
                        localStorage.setItem('prodID',prodID);

                    }
                });
            }
        });



    },
    fieldsValidation:function(){
        var operation_name = document.getElementById('operation-name').value;
        var operation_line = document.getElementById('operation-line').value;
        var operation_op   = document.getElementById('operation-op').value;
        var product_name   = document.getElementById('product-name').value;
        var product_pippo  = document.getElementById('product-pippo').value;
        var date = document.getElementById('fecha-content').value;
        var defect_selected ='';
        if(app.newDefect){
            defect_selected = document.getElementById("defect_name").value;
        }else{
            var defecto = document.getElementById("defectSelect");
            defect_selected = defecto.options[defecto.selectedIndex].value;
        }
        return operation_name!='' && operation_line!='' && operation_op!='' && product_name!='' && product_pippo!='' && defect_selected!='' && date!='';

    },
    setNewDefect:function(value){
        app.newDefect = value;
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

function showForm(option){
    if(option == 1){
        var element = document.getElementById("defectYes");
        if(app.newDefect == true) element.className+=" hidden";
        var oposite = document.getElementById("defectNo");
        oposite.classList.remove("hidden");
        app.setNewDefect(false);
    }else{
        var element = document.getElementById("defectYes");
        element.classList.remove("hidden");
        var oposite = document.getElementById("defectNo");
        if(app.newDefect == false) oposite.className +=" hidden";
        app.setNewDefect(true);
    }
}
