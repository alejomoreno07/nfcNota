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
        //app.fillDate('fecha-content');
        app.getInformation();
        app.setSubmit('send-btn-div');
    
    },
    getPriorityLevel:function(number){
        if(number >= 250) return "AA";
        else if(number >= 200 && number < 250) return "A";
        else if(number >= 150 && number < 200) return "M";
        else if(number >= 100 && number < 150) return "B";
        else return "BB";
    },
    fillDate:function(idElement){
        var today = new Date();
        var day   = today.getDate();
        var month = today.getMonth()+1;
        var year  = today.getFullYear();
        var fecha = document.getElementById(idElement);
        fecha.innerHTML= day+"-"+month+"-"+year;
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
        var name  = localStorage.getItem("product_name");
        var pippo = localStorage.getItem("product_pippo");
        var date = localStorage.getItem("fecha");
        var defect_number = localStorage.getItem("defect_number");
        var product_number = localStorage.getItem("product_number");
        var severity = localStorage.getItem("severity");
        var defect_type = localStorage.getItem("defect_description");

        var priority_number = Math.ceil((defect_number/product_number)*severity*50);
        var priority_level = app.getPriorityLevel(priority_number);
        app.setPriority('priority_number','priority_level',priority_number,priority_level);
        app.setFecha(date);
        app.setData('defect_name',defect_type);
        app.setData('product-name',name);
        app.setData('product-pippo',pippo);
        var anomaly_code = localStorage.getItem("anomalycode");
        if(anomaly_code == null){
            $.getJSON("http://weisseamsel.altervista.org/nfcProject/detectnumb.php",function(data){
                var opID = localStorage.getItem("opID");
                var prodID = localStorage.getItem("prodID");
                var defectID = localStorage.getItem("defectID");
                var numero = data + 1;
                var anomalycode ="O"+opID+"P"+prodID+"D"+defectID+"N"+numero;
                localStorage.setItem("anomalycode", anomalycode);
                app.setData('anomaly_code',anomalycode);
             });    
        }
        else{
            app.setData('anomaly_code',anomaly_code);
        }
        

    },
    setPriority:function(idElement, idElementLevel, priority_number, priority_level){
        var element = document.getElementById(idElement);
        element.value = priority_number;
            element = document.getElementById(idElementLevel);
        element.value = priority_level;
        
    },
    setData:function(idElement, data){
        var element = document.getElementById(idElement);
        element.value = data;
        element.nextElementSibling.className ="active";
    },
    sendInformation:function(){
        var priority_number = document.getElementById('priority_number').value;
        var analisi       = $("input[name=4M]:checked").next().text();
        localStorage.setItem('priority_number',priority_number);
        localStorage.setItem('4M',analisi);
    },
    postInfo:function(){
            var opID = localStorage.getItem("opID");
            var prodID = localStorage.getItem("prodID");
            var defectID = localStorage.getItem("defectID");
            var frequency = localStorage.getItem("frequency");
            var severity = localStorage.getItem("priority_number");
            var picID = 1;
            var analisi = localStorage.getItem("4M");
            var status = "";
            var anomalycode = localStorage.getItem("anomalycode");
            var fecha = localStorage.getItem("fecha");
            var priority = localStorage.getItem("severity");
            $.ajax({
                type: 'POST',
                // make sure you respect the same origin policy with this url:
                // http://en.wikipedia.org/wiki/Same_origin_policy
                url: 'http://weisseamsel.altervista.org/nfcProject/detectionCRUD.php',
                data: { 
                    'what': 0, 
                    'opID': opID, // <-- the $ sign in the parameter name seems unusual, I would avoid it
                    'prodID': prodID,
                    'defectID': defectID,
                    'frequency':frequency,
                    'severity': priority,
                    'picID': picID,
                    '4M':analisi,
                    'status': status,
                    'anomalycode': anomalycode,
                    'date':fecha,
                    'priority':severity
                },
                success: function(){
                    window.location.href='index.html';   
                }
            });
           
        
    },
    setSubmit:function(idElement){
        var element = document.getElementById(idElement);

        element.addEventListener('click',function(){
            
            if(app.fieldsValidation()){
                app.sendInformation();
                app.postInfo();
                //window.location.href='index.html';   
            }else{
                alert('All the fields must be filled in order to proceed.');
            }

        });
    },

    fieldsValidation:function(){
       
        return true;

    },
   
   
};

app.initialize();