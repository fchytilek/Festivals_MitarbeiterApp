// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('ionicApp', ['ionic']);
var usernameGlobal;

var vergangeneVeranstaltungenGlobal = [];
var gegenwaertigeVidGlobal = null;
var aktuelleVidGlobal = null;

var aktuellerVeranstaltungsNameGlobal;
var aktuelleVeranstaltungBeginnGlobal;
var aktuelleVeranstaltungEndeGlobal;
var globalCheck=false;
var globalPauseIsUpdate = false;
var geleiteterStandGlobal = null;
var standdetails_dataGlobal;
var actionToPerformGlobal;
var arbeitBeginnen_arbeitsBeginnGlobal;
var pauseHinzufuegen_pausenBeginn;
var pauseHinzufuegen_pausenEnde;
var arbeitBeenden_arbeitsEndeGlobal;
var arbeitPlanenHinzufuegen_abrechnungsStatusGlobal;
var arbeitPlanenHinzufuegen_arbeitsBeginnGlobal;
var arbeitPlanenHinzufuegen_arbeitsEndeGlobal;
var arbeitPlanenHinzufuegen_pausenListeGlobal;
var callFromMainMenu = true; //Ist true wenn Arbeitsdetails über MainMenu aufgerufen werden und nicht in den Standoptionen. Das Pause wünschen Formular wird dadurch eingeblendet.
var callToDeleteOrChangeFromOffeneArbeiten = true; //Ist true wenn der call zum löschen von offene Arbeiten ausgeht und false wenn er von ma_details ausgeht. Dadurch wird nach dem löschen wieder offene Arbeiten angezeigt und nicht ma_details
var arbeitPlanenHinzufuegenTitleGlobal = "";

var standdetailsMitarbeiterDataGlobal = [];
var maDetailsDataGlobal = {};
var arbeitDetailsDataGlobal = {};

$(document).ready(function(){
    var pausenId = 1;
     $("#arbeit_planen_hinzufuegen_pausenfeld_add_button").click(function(){
        pausenId++;
        var string = "<tr id=\"arbeit_planen_hinzufuegen_pause_"+pausenId+"_tableRow\">\n\
                       <th>\n\
                            Pause "+pausenId+"</br>\n\
                            <input id=\"arbeit_planen_hinzufuegen_pause_"+pausenId+"_anfang_stunden\" class=\"arbeit_planen_hinzufuegen_pause\" type=\"text\">\n\
                            <input id=\"arbeit_planen_hinzufuegen_pause_"+pausenId+"_anfang_minuten\" class=\"arbeit_planen_hinzufuegen_pause\" type=\"text\"><br>\n\
                            <input id=\"arbeit_planen_hinzufuegen_pause_"+pausenId+"_ende_stunden\" class=\"arbeit_planen_hinzufuegen_pause\" type=\"text\">\n\
                            <input id=\"arbeit_planen_hinzufuegen_pause_"+pausenId+"_ende_minuten\" class=\"arbeit_planen_hinzufuegen_pause\" type=\"text\"><br>\n\
                            <button id=\"arbeit_planen_hinzufuegen_pausenfeld_delete_button_"+pausenId+"\">Diese Pause entfernen</button>\n\
                        </th>\n\
                    </tr>";  
        $("#arbeit_planen_hinzufuegen_pause_table").append(string);
        setOnclick(pausenId);
        function setOnclick(pausenId) {
            $("#arbeit_planen_hinzufuegen_pausenfeld_delete_button_"+pausenId).click(function(){
                $("#arbeit_planen_hinzufuegen_pause_"+pausenId+"_tableRow").html(" ");
            });
        }                
     });

     $("#arbeit_planen_hinzufuegen_pausenfeld_delete_button_1").click(function(){
        $("#arbeit_planen_hinzufuegen_pause_1_tableRow").html(" ");
     });            
});

function correctDateFormat(date) {
    if(date<10){
        var string = "0"+date;
        return string;
    }else {
        return date;
    }
}


function offeneArbeitenAnzeigen(data){
    alert("offene Arbeiten anzeigen");
}

function mitarbeiterHinzufuegen(){
    var vorname = $('#newUser_vorname').val();
    var nachname = $('#newUser_nachname').val();
    var passwort = $('#newUser_passwort').val();

    var test = {vorname: vorname,
                nachname: nachname,
                passwort: passwort};

    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/ma",
        data: test,
        dataType: 'json'
    }).then(function(data) {
        var ergebnis = JSON.parse(data); 
        $('#app_post_test').text("Hinzufuegen-Response: " + ergebnis);               
    });
}

function verifyMitarbeiter(){    
    
    var input = {username: $('#loginUser_username').val(),
                passwort: $('#loginUser_passwort').val()};
    $.ajax({
        
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/ma/login",
        data: input,
        dataType: 'json'
        
    }).then(function(data) {
        
        usernameGlobal = data.username;      
        var helper = 0;  
        var vergangeneVeranstaltungen = [];
        
        for(i in data.veranstaltungsIds) { 
            
            var heutigesDatum = new Date();   
            var veranstaltungsBeginn = new Date(data.veranstaltungsDatum[helper]);
            helper++;
            var veranstaltungsEnde = new Date(data.veranstaltungsDatum[helper]);
            helper++;
            
            if( veranstaltungsBeginn.getTime() <= heutigesDatum.getTime() && heutigesDatum.getTime() <= veranstaltungsEnde ) {
                
                aktuelleVidGlobal = data.veranstaltungsIds[i];
                gegenwaertigeVidGlobal = data.veranstaltungsIds[i];
                aktuellerVeranstaltungsNameGlobal = data.veranstaltungsNamen[i];
                aktuelleVeranstaltungBeginnGlobal = veranstaltungsBeginn;
                aktuelleVeranstaltungEndeGlobal = veranstaltungsEnde;
                
                if( data.geleiteterStand[i] !== null ) {
                    geleiteterStandGlobal = data.geleiteterStand[i];
                }
            } else if( veranstaltungsBeginn.getTime() <= heutigesDatum.getTime() ) {
                
                var veranstaltung = {};
                veranstaltung.vid = data.veranstaltungsIds[i];
                veranstaltung.name = data.veranstaltungsNamen[i];
                veranstaltung.beginn_date = correctDateFormat(veranstaltungsBeginn.getDate());
                veranstaltung.beginn_month = correctDateFormat(veranstaltungsBeginn.getMonth()+1);
                veranstaltung.beginn_year = veranstaltungsBeginn.getFullYear();
                veranstaltung.ende_date = correctDateFormat(veranstaltungsEnde.getDate());
                veranstaltung.ende_month = correctDateFormat(veranstaltungsEnde.getMonth()+1);
                veranstaltung.ende_year = veranstaltungsEnde.getFullYear();
                vergangeneVeranstaltungen.push(veranstaltung);
            }            
        }
        
        vergangeneVeranstaltungenGlobal = vergangeneVeranstaltungen;
        
        setTimeout(function() {
            $('#login_content').scope().verifyMitarbeiter();    
        }, 1);
    });       
}

function eventHinzufuegen(){
    var name = $("#newEvent_name").val();
    var aJahr = $("#newEvent_aJahr").val();
    var aMonat = $("#newEvent_aMonat").val();
    var aTag = $("#newEvent_aTag").val();
    var eJahr = $("#newEvent_eJahr").val();
    var eMonat = $("#newEvent_eMonat").val();
    var eTag = $("#newEvent_eTag").val();
    var username = $("#newEvent_username").val();
    var passwort = $("#newEvent_passwort").val();

    var eventJson = { aJahr: aJahr,
                    aMonat: aMonat,
                    aTag: aTag,
                    eJahr: eJahr,
                    eMonat: eMonat,
                    eTag: eTag,
                    veranstaltungsName: name,
                    username: username,
                    passwort: passwort};   

    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung",
        data: eventJson,
        dataType: 'json'
    }).then(function(data) {
       var ergebnis = JSON.parse(data); 
       $('#newEvent_ausgabe1').text("Hinzufuegen-Response: " + ergebnis);   
    });
}

function ma2Event(){
    var vid = $("#ma2Event_vid").val();
    var username = $("#ma2Event_username").val();            
    var ma2EventJson = {vid: vid,
                        username: username};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/addMitarbeiter",
        data: ma2EventJson,
        dataType: 'json'
    }).then(function(data) {
       var ergebnis = JSON.parse(data); 
       $('#ma2Event_ausgabe1').text("Hinzufuegen-Response: " + ergebnis);   
    });
}

function veranstaltungsDetailsAbrufen(vid) {
    var returner;
    var json = {vid:vid};
    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung",
        data: json,
        dataType: 'json'
    }).then(function(data) {
       returner = data;
       //alert("then");
       return returner;
    });
}

function veranstaltung_aktuell(){
    var liste = $("#veranstaltung_liste");

    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung",
        dataType: 'json'
    }).then(function(data) {
        var str="";
        str=str+"<tr><th>vid</th><th>name</th><th>anfang</th><th>ende</th><th>Staende</th><th>maGesamt</th><th>maAbgeschlossen</th><th>maAusbezahlt</th></tr>";

        for(i in data){
            str=str+"<tr>";
            str=str+"<th>"+data[i].vid+"</th>";
            str=str+"<th>"+data[i].name+"</th>";
            var anfangsDatum_Date = new Date(data[i].anfangsDatum);
            str=str+"<th>"+anfangsDatum_Date+"</th>";
            var endDatum_Date = new Date(data[i].endDatum);
            str=str+"<th>"+endDatum_Date+"</th>";
            str=str+"<th>"+data[i].standliste+"</th>";
            str=str+"<th>"+data[i].mitarbeiterGesamt+"</th>";
            str=str+"<th>"+data[i].mitarbeiterAbgeschlossen+"</th>";
            str=str+"<th>"+data[i].mitarbeiterAusbezahlt+"</th></tr>";
        }
        liste.html(str);
    });
}

function mitarbeiterLoeschen() {
    var username=$("#deleteUser_username").val();

    var json={username: username};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/ma/delete",
        data: json,
        dataType: 'json'
    }).then(function(data) {
       var ergebnis = JSON.parse(data); 
       $('#deleteUser_ausgabe1').text("Loeschen-Response: " + ergebnis);   
    });
}

function mitarbeiter_aktuell(){
    var liste = $("#mitarbeiter_liste");

    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/ma",
        dataType: 'json'
    }).then(function(data) {
        var str="";
        str=str+"<tr><th>Vorname</th><th>Nachname</th><th>Username</th><th>Passwort</th><th>Vids</th></tr>";

        for(i in data){
            str=str+"<tr>";
            str=str+"<th>"+data[i].vorname+"</th>";
            str=str+"<th>"+data[i].nachname+"</th>";
            str=str+"<th>"+data[i].username+"</th>";
            str=str+"<th>"+data[i].passwort+"</th>";
            str=str+"<th>";
            for(j in data[i].veranstaltungsIds){
                str=str+data[i].veranstaltungsIds[j]+" ";
            }
            str=str+"</th></tr>";
        }
        liste.html(str);
    });
}

function mitarbeiterUpdaten() {
    var usernameAlt=$("#updateUser_usernameAlt").val();
    var usernameNeu=$("#updateUser_usernameNeu").val();
    var passwortNeu=$("#updateUser_passwortNeu").val();

    var json = {usernameAlt:usernameAlt,
                usernameNeu:usernameNeu,
                passwortNeu:passwortNeu};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/ma/update",
        data: json,
        dataType: 'json'
    }).then(function(data) {
       var ergebnis = JSON.parse(data); 
       $('#updateUser_ausgabe1').text("Update-Response: " + ergebnis);   
    });
}

function standHinzufuegen() {
    var vid=$('#addStand_vid').val();
    var standnummer=$('#addStand_standnummer').val();

    var json={vid:vid,
              standnummer:standnummer};

    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/addStand",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var ergebnis = JSON.parse(data);
        $('#addStand_ausgabe').text("Hinzufuegen-Respone: " + ergebnis);
    });            
}

function standLoeschen() {
    var vid=$('#deleteStand_vid').val();
    var standnummer=$('#deleteStand_standnummer').val();

    var json={vid:vid,
              standnummer:standnummer};

    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/deleteStand",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var ergebnis = JSON.parse(data);
        $('#deleteStand_ausgabe').text("Loeschen-Respone: " + ergebnis);
    });           
}

function standListe_aktuell() {
    var vid=$('#standListe_vid').val();
    var json={vid:vid};

    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/stand",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var str="<tr><th>Standnummer</th><th>Standleiter</th><th>Stellvertreter</th><th>Mitabeiter</th><th>Stunden</th><th>Pausen</th></tr>";

        for(i in data){
            str=str+"<tr>";
            str=str+"<th>"+data[i].standnummer+"</th>";
            str=str+"<th>"+data[i].standleiter+"</th>";
            str=str+"<th>"+data[i].stellvertreter+"</th>";
            str=str+"<th>"+data[i].mitarbeiterListe.length+"</th>";

            var stunden=0;
            var pausen=0;
            for(j in data[i].stundenListe){
                stunden=stunden+data[i].stundenListe[j];
                pausen=pausen+data[i].pausenListe[j];
            }
            str=str+"<th>"+stunden+"</th><th>"+pausen+"</th></tr>"; 
        }
        $('#standListe_liste').html(str);
    });                
}

function standleiterBestimmen(){
    var vid = $('#standleiter_vid').val();
    var standnummer = $('#standleiter_standnummer').val();
    var username = $('#standleiter_username').val();
    var json = {vid:vid,
                standnummer:standnummer,
                username:username};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/stand/standleiter",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var ergebnis = JSON.parse(data);
        $('#standleiter_ausgabe').text("Standleiter-Respone: " + ergebnis);
    });                      
}

function stellvertreterBestimmen(){
    var vid = $('#standleiter_vid').val();
    var standnummer = $('#stellvertreter_standnummer').val();
    var username = $('#stellvertreter_username').val();
    var json = {vid:vid,
                standnummer:standnummer,
                username:username};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/stand/stellvertreter",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var ergebnis = JSON.parse(data);
        $('#stellvertreter_ausgabe').text("Stellvertreter-Respone: " + ergebnis);
    });                
}

function mitarbeiterVerschieben(usernames){
    var json = {vid:aktuelleVidGlobal,
                standnummer:mitarbeiterVerschieben_standnummerGlobal,
                usernames:usernames};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/stand/addMitarbeiter",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data.length == 0) {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Mitarbeiter verschoben");
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-2);            
        } else {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", data[0]);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);     
        }        
    });                
}

function standoptionen_mitarbeiterliste_auslesen(){
    var returner = [];
    var checkboxes = document.getElementsByName("standoptionen_mitarbeiterliste_checkbox");
    for(i in checkboxes) {
        if(checkboxes[i].checked == true){
            returner.push(checkboxes[i].value);
        }
    }
    return returner;
}

function performAction() {
    var usernames = standoptionen_mitarbeiterliste_auslesen();
    if(usernames.length == 0) {
        alert(unescape("Keine Mitarbeiter ausgew%E4hlt"));
    } else {
        switch(actionToPerformGlobal) {
            case "arbeitBeginnen":
                arbeitBeginnen(usernames);
                break; 
            case "pauseHinzufuegen":
                pauseHinzufuegen(usernames);
                break;
            case "arbeitBeenden":
                arbeitBeenden(usernames);
                break;
            case "arbeitPlanen":
                arbeit_planen_hinzufuegen(usernames,true);
                break;
            case "arbeitHinzufuegen":
                arbeit_planen_hinzufuegen(usernames,false);
                break;
            case "mitarbeiterAbschliessen":
                mitarbeiterAbschliessen(usernames);
                break;
            case "mitarbeiterVerschieben":
                mitarbeiterVerschieben(usernames);
                break;
        }
    }
}

function standDetails_aktuell(){
    var json = {vid:aktuelleVidGlobal,
                standnummer:geleiteterStandGlobal};
    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/stand/details",
        data: json,
        dataType: 'json'
    }).then(function(data){
        //alert("then");
        for(i in data) {
            var str="<tr><th>Standnummer</th><th>"+data[i].standnummer+"</th></tr>";
            str=str+"<tr><th>Standleiter</th><th>"+data[i].standleiter+"</th></tr>";
            str=str+"<tr><th>Stellvertreter</th><th>"+data[i].stellvertreter+"</th></tr>";
            str=str+"<tr><th>Mitarbeiter</th><th>Stunden</th><th>Pause</th></tr>";
        }


        for(j in data[i].mitarbeiterListe){
            str=str+"<tr>";
            str=str+"<th>"+data[i].mitarbeiterListe[j]+"</th>";
            str=str+"<th>"+data[i].stundenListe[j]+"</th>";
            str=str+"<th>"+data[i].pausenListe[j]+"</th></tr>";   
        }
        $('#standDetails_liste').html(str);
    });                
}

function arbeitBeginnen(usernames){
    var json = {vid:aktuelleVidGlobal,
                standnummer:geleiteterStandGlobal,
                usernames:usernames,
                arbeitsBeginn:arbeitBeginnen_arbeitsBeginnGlobal
            };

    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/beginnen",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data.length == 0) {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde begonnen");
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-2);            
        } else if(data[0] == "Arbeitsbeginn liegt nicht im Zeitaum der Veranstaltung") {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", data[0]);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);            
        } else {            
            var ausgabe = "Arbeit konnte nicht begonnen werden f&uumlr: <br><br><b>";
            for(i in data) {
                ausgabe += data[i] + "<br>";
            }
            ausgabe += "</b><br>M&oumlgliche Ursachen: <br><br> Ma hat eine offene Arbeit <br> Ma ist abgeschlossen <br> Arbeitsbeginn liegt vor letztem Arbeitsende <br> Ma nicht mehr an diesem Stand";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);               
        }
    });             
}

function pauseHinzufuegen(usernames) {    
    var json = {vid:aktuelleVidGlobal,
                usernames:usernames};
            
    if(!(pauseHinzufuegen_pausenBeginn.getFullYear() == 1993)) {
        json.pausenBeginn = pauseHinzufuegen_pausenBeginn;
    }
    if(!(pauseHinzufuegen_pausenEnde.getFullYear() == 1993)) {
        json.pausenEnde = pauseHinzufuegen_pausenEnde;
    }
     $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/pause",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data.length == 0) {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Pause wurde hinzugef&uumlgt");
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-2);          
        } else if(data[0] == "Pause liegt nicht im Veranstaltungszeitraum" || data[0] == "Pausenende liegt vor Pausenbeginn") {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", data[0]);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);      
        } else {
            var ausgabe = "Pause konnte nicht hinzugef&uumlgt werden f&uumlr: <br><br><b>";
            for(i in data) {
                ausgabe += data[i] + "<br>";
            }
            ausgabe += "</b><br>M&oumlgliche Ursachen: <br><br> Ma hat keine offene Arbeit <br> Pausenbeginn liegt vor Arbeitsbeginn <br> Pausenzeiten &uumlberschneiden sich <br> Pausenbeginn angegeben und Ma ist bereits in Pause <br> Pausenende angegeben und Ma ist nicht in Pause <br> Beides angegeben und Ma ist bereits in Pause";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);   
        }
    });             
}

function arbeitBeenden(usernames) {
    var json = {vid:aktuelleVidGlobal,
                usernames:usernames,
                arbeitsEnde:arbeitBeenden_arbeitsEndeGlobal};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/beenden",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data.length == 0) {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde beendet");
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-2);          
        } else if(data[0] == "Arbeitsende liegt nicht im Veranstaltungszeitraum") {
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", data[0]);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);            
        } else {
            var ausgabe = "Arbeit konnte nicht beendet werden f&uumlr: <br><br><b>";
            for(i in data) {
                ausgabe += data[i] + "<br>";
            }
            ausgabe += "</b><br>M&oumlgliche Ursachen: <br><br> Ma hat keine offene Arbeit <br> Arbeitsende liegt vor Arbeitsbeginn <br>";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);               
        }
    });             
}

function mitarbeiterAbschliessen(usernames) {
    var json = {vid:aktuelleVidGlobal,
                usernames:usernames};
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/abschliessen",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data.length == 0){
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Mitarbeiter abgeschlossen");
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);    
        } else {
            var ausgabe = "Folgende Mitarbeiter konnten nicht abgeschlossen werden: <br><br><b>";
            for(i in data) {
                ausgabe += data[i] + "<br>";
            }
            ausgabe += "</b><br>M&oumlgliche Ursachen: <br><br> Ma hat eine offene Arbeit <br> Ma ist bereits abgeschlossen <br>";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);        
        }
    });             
}

function abrechnung_aktuell() {
    var vid = $('#abrechnung_vid').val();
    var json = {vid:vid};
    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/abrechnung",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var string = "<tr><th>Mitarbeitername</th><th>gehaltGesamt</th><th>anreisekosten</th><th>anreiseKommentar</th><th>auszahlungsBetrag</th></tr>";
        for(i in data){
            string += "<tr><th>" + data[i].mitarbeiterName + "</th>";
            string += "<th>" + data[i].gehaltGesamt + "</th>";
            string += "<th>" + data[i].anreisekosten + "</th>";
            string += "<th>" + data[i].anreiseKommentar + "</th>";
            string += "<th>" + data[i].auszahlungsBetrag + "</th></tr>";
            string += "<tr><th>Arbeiten</th></tr>";
            string += "<tr><th>Standnummer</th><th>arbeitsbeginn</th><th>arbeitsende</th><th>arbeitszeit</th><th>pausenzeit</th><th>pausenListe</th><th>abrechnungsStatus</th><th>gehalt</th></tr>";
           for(j in data[i].standnummer) {
                string += "<tr><th>" + data[i].standnummer[j] + "</th>";
                var arbeitsbeginn = new Date(data[i].arbeitsbeginn[j]);
                string += "<th>" + arbeitsbeginn.getDate() + ". " + (arbeitsbeginn.getMonth()+1) + ". " + arbeitsbeginn.getFullYear() + "</br>";
                string += arbeitsbeginn.getHours() + " : " + arbeitsbeginn.getMinutes() + " Uhr </th>";
                var arbeitsende = new Date(data[i].arbeitsende[j]);
                string += "<th>" + arbeitsende.getDate() + ". " + (arbeitsende.getMonth()+1) + ". " + arbeitsende.getFullYear() + "</br>";
                string += arbeitsende.getHours() + " : " + arbeitsende.getMinutes() + " Uhr </th>";
                string += "<th>" + data[i].arbeitszeit[j] + "</th>";
                string += "<th>" + data[i].pausenzeit[j] + "</th>";
                string += "<th>";
                var count = 0;
                for(k in data[i].pausenListe[j].innereListe) {
                    var pause = new Date(data[i].pausenListe[j].innereListe[k]);        

                    if(count%2==0) {
                        string += pause.getHours() + ":" + pause.getMinutes();
                    } else {
                        string += " - " + pause.getHours() + ":" + pause.getMinutes() + "</br>";
                    }
                    count++;                           
                }
                string += "</th>";
                string += "<th>" + data[i].abrechnungsStatus[j] + "</th>";
                string += "<th>" + data[i].gehalt[j] + "</th></tr>";
            }
         }
        $('#abrechnung_liste').html(string);
    }); 
}

function ma_details(data) {     
         
        var string ="";               
        if(data.mitarbeiterName=="Exception") {
            string = "<tr><th>Exception</th></tr>";
        } else {
            var weekday = new Array(7);
            weekday[0]=  "Sonntag";
            weekday[1] = "Montag";
            weekday[2] = "Dienstag";
            weekday[3] = "Mittwoch";
            weekday[4] = "Donnerstag";
            weekday[5] = "Freitag";
            weekday[6] = "Samstag";
            
            var idCountHelp = 0;
            var countHelp = 0;
            if(data.arbeitsbeginn.length > 0) {
                var tagLetzterArbeit = data.arbeitsbeginn[0];
            }     
            for(j in data.standnummer) {
                var arbeitsbeginn = new Date(data.arbeitsbeginn[j]);
                var arbeitsende = new Date(data.arbeitsende[j]);
                if(countHelp === 0 || arbeitsbeginn.getDate() !== tagLetzterArbeit.getDate() ) {
                    countHelp++;
                    tagLetzterArbeit = arbeitsbeginn;
                    string += "<div class='item item-divider'>Tag "+ countHelp + " - " + weekday[arbeitsbeginn.getDay()] + " - " + correctDateFormat(arbeitsbeginn.getDate()) + "." + correctDateFormat((arbeitsbeginn.getMonth()+1)) + "." + arbeitsbeginn.getFullYear() + "</div>";
                }
                string += "<div class='item'><div id='arbeit_details_anzeigen_"+idCountHelp+"' class='row' style='text-align:center;'>\n\
                                <div class='col' style='position:relative;max-width:20%'>";
                if(data.geplant[j]===false){
                    string += "<i style='color:Chartreuse;font-size:60px;display:block;' class='ion-checkmark-round'></i>";
                } else {
                    string += "<i style='font-size:60px;display:block;' class='ion-clipboard'></i>";
                }
                string +=        "</div>\n\
                                <div class='col' style='max-width:80%'>"
                                    + correctDateFormat(arbeitsbeginn.getHours()) + ":" + correctDateFormat(arbeitsbeginn.getMinutes()) + " - "
                                    + correctDateFormat(arbeitsende.getHours()) + ":" + correctDateFormat(arbeitsende.getMinutes()) + "<br>"
                                    + data.arbeitszeit[j] + " h Arbeitszeit <br>"
                                    + data.pausenzeit[j] + " h Pause" + 
                                "</div>\n\
                                <div class='col col-center' style='max-width:20%'><b>"
                                    + data.gehalt[j] + " &#8364 </b>" +
                                "</div>\n\
                            </div>\n\
                        </div>";
                idCountHelp++;                
            }
            string += " <div class='item item-divider'>\n\
                            Gesamt\n\
                        </div>\n\
                        <div class='item'>\n\
                            <div class='row'>\n\
                                <div class='col col-66' style='padding-left:3%';>\n\
                                    Gehalt :\n\
                                </div>\n\
                                <div class='col co-33 ' style='text-align:center'>"
                                    + data.gehaltGesamt + " &#8364 </b>" +
                                "</div>\n\
                            </div>\n\
                            <div class='row'>\n\
                                <div class='col col-66' style='padding-left:3%';>\n\
                                    Anreisekosten :\n\
                                </div>\n\
                                <div class='col co-33 ' style='text-align:center'>"
                                   + data.anreisekosten + " &#8364 </b>" +
                                "</div>\n\
                            </div>\n\
                            <div class='row'>\n\
                                <div class='col col-66' style='padding-left:3%';>\n\
                                    Anreisekommentar :\n\
                                </div>\n\
                                <div class='col co-33 ' style='text-align:center'>"
                                    + data.anreiseKommentar +
                                "</div>\n\
                            </div>\n\
                            <div class='row'>\n\
                                <div class='col col-66' style='padding-left:3%';>\n\
                                    <b>Auszahlungsbetrag :\n\
                                </div>\n\
                                <div class='col co-33 ' style='text-align:center'>"
                                   + data.auszahlungsBetrag + " &#8364 </b>" +
                                "</div>\n\
                            </div>\n\
                        </div>";
        }
        $("#arbeitszeiten_card").html(string);
        
        function setOnClick2(data, i) {
            var id = "arbeit_details_anzeigen_"+i;
            document.getElementById(id).onclick=function() {
                setTimeout(function() {
                    $("#arbeitszeiten_card").scope().arbeitszeit_details(data,i);    
                }, 1);            
            };
        }
        
        for(j in data.standnummer) {
            setOnClick2(data,j);
        }
         
        /*Extra Funktionsdeklaration ist notwendig um i als Value und nicht als Referenz zu übergeben, da sonst
        //die onclick funktion nicht funktioniert
        function setOnclick(data,i,vid,username){
            var deleteId = "arbeit_loeschen_button_"+i;
            document.getElementById(deleteId).onclick=function(){arbeit_loeschen(data,i,vid,username);};
            var id = "arbeit_bearbeiten_anzeigen_button_"+i;
            var pausenWunschId = "pause_wuenschen_button_"+i;
            var check = !!document.getElementById(id);
            if(check) {
                document.getElementById(id).onclick=function(){arbeit_bearbeiten_anzeigen(data,i,vid,username);};
            } else {
                document.getElementById(pausenWunschId).onclick=function() {pause_wuenschen_anzeigen(data,i,vid,username);};
            }
        };
        for(i in data.standnummer) {                   
           setOnclick(data,i,vid,username);
        }*/
}   

function geplante_arbeiten_anzeigen(data) {
    var string ="";               
    if(data.mitarbeiterName==="Exception") {
        string = "<tr><th>Exception</th></tr>";
    } else {
        
        var weekday = new Array(7);
        weekday[0]=  "Sonntag";
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";

        var countHelp = 0;
        if(data.arbeitsbeginn.length > 0) {
            var tagLetzterArbeit = data.arbeitsbeginn[0];
        }     
        for(j in data.standnummer) {
            if(data.geplant[j]===true){        
                var arbeitsbeginn = new Date(data.arbeitsbeginn[j]);
                var arbeitsende = new Date(data.arbeitsende[j]);                
                if(countHelp === 0 || arbeitsbeginn.getDate() !== tagLetzterArbeit.getDate() ) {
                    countHelp++;
                    tagLetzterArbeit = arbeitsbeginn;
                    string += "<div class='item item-divider'>Tag "+ countHelp + " - " + weekday[arbeitsbeginn.getDay()] + " - " + correctDateFormat(arbeitsbeginn.getDate()) + "." + correctDateFormat((arbeitsbeginn.getMonth()+1)) + "." + arbeitsbeginn.getFullYear() + "</div>";
                }
                string += " <div class='item'>\n\
                                <div id='arbeit_details_anzeigen_"+j+"' class='row' style='text-align:center;'>\n\
                                    <div class='col' style='position:relative;max-width:20%'>\n\
                                        <i style='font-size:60px;display:block;' class='ion-clipboard'></i>\n\
                                    </div>\n\
                                    <div class='col' style='max-width:80%'>"
                                        + correctDateFormat(arbeitsbeginn.getHours()) + ":" + correctDateFormat(arbeitsbeginn.getMinutes()) + " - "
                                        + correctDateFormat(arbeitsende.getHours()) + ":" + correctDateFormat(arbeitsende.getMinutes()) + "<br>"
                                        + data.arbeitszeit[j] + " h Arbeitszeit <br>"
                                        + data.pausenzeit[j] + " h Pause" + 
                                    "</div>\n\
                                    <div class='col col-center' style='max-width:20%'><b>"
                                        + data.gehalt[j] + " &#8364 </b>" +
                                    "</div>\n\
                                </div>\n\
                            </div>";
            }
        }
    }
    
    if(string == "") {
        string += "<div class='item'>Es gibt im Moment keine geplanten Arbeiten f&uumlr Sie.</div>";
    }
    $("#geplante_arbeiten_card").html(string);
    
    function setOnClick2(data, i) {
        var id = "arbeit_details_anzeigen_"+i;
        document.getElementById(id).onclick=function() {
            setTimeout(function() {
                angular.element(document.getElementById("geplante_arbeiten_card")).scope().arbeitszeit_details(data,i);    
            }, 1);            
        };
    }
    
    for(j in data.standnummer) {
        if(data.geplant[j]===true){
            setOnClick2(data,j);
        }
    }
}

function arbeit_details_anzeigen(data,i) {
    var weekday = new Array(7);
    weekday[0]=  "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";
    
    var arbeitsbeginn = new Date(data.arbeitsbeginn[i]);
    var arbeitsende = new Date(data.arbeitsende[i]);
    var string = "<div class='item item-divider'>" + weekday[arbeitsbeginn.getDay()] + " - " + correctDateFormat(arbeitsbeginn.getDate()) + "." + correctDateFormat((arbeitsbeginn.getMonth()+1)) + "." + arbeitsbeginn.getFullYear() + "</div>\n\
    <div class='item'>\n\
        <div class='row' >\n\
            <div class='col col-10' style='text-align:center'>\n\
                <i class='icon ion-ios-people'></i>\n\
            </div>\n\
            <div class='col' style='text-align:left'>\n\
                Rolle\n\
            </div>\n\
            <div class='col' style='text-align:center'>"
                + data.abrechnungsStatus[i] +
            "</div>\n\
        </div>\n\
        <div class='row' >\n\
            <div class='col col-10' style='text-align:center'>\n\
                <i class='icon ion-ios-home'></i>\n\
            </div>\n\
            <div class='col' >\n\
                Standnummer\n\
            </div>\n\
            <div class='col' style='text-align:center'>"
                + data.standnummer[i] +
            "</div>\n\
        </div>\n\
        <div class='row'>\n\
            <div class='col col-10' style='text-align:center'>\n\
                <i class='icon ion-ios-play'></i>\n\
            </div>\n\
            <div class='col'>"
               + correctDateFormat(arbeitsbeginn.getHours()) + ":" + correctDateFormat(arbeitsbeginn.getMinutes()) + " - " + correctDateFormat(arbeitsende.getHours()) + ":" + correctDateFormat(arbeitsende.getMinutes()) +                             
            "</div>\n\
            <div class='col' style='text-align:center'>"
                + data.arbeitszeit[i] + " h" + 
            "</div>\n\
        </div>";
    
    var pausenListe = data.pausenListe[i].innereListe;    
    for(k in pausenListe) {
        var pause = new Date(pausenListe[k]);       
        if(k%2==0) {
            string += " <div class='row'>\n\
                            <div class='col col-10' style='text-align:center'>\n\
                                <i class='icon ion-ios-pause' ></i>\n\
                            </div>\n\
                            <div class='col'>"
                                + correctDateFormat(pause.getHours()) + ":" + correctDateFormat(pause.getMinutes()) + " - ";
        } else {
            string += correctDateFormat(pause.getHours()) + ":" + correctDateFormat(pause.getMinutes()) + 
                            "</div>\n\
                            <div class='col'style='text-align:center'>";
            if(k==(pausenListe.length-1)) {
                string += data.pausenzeit[i] + " h";
            }            
            string +=      "</div>\n\
                        </div>";
        }                          
    }
    string += " <div class='row'>\n\
                    <div class='col col-10' style='text-align:center'>\n\
                        <i class='icon ion-beer' ></i>\n\
                    </div>\n\
                    <div class='col'>\n\
                        Gesamt\n\
                    </div>\n\
                    <div class='col' style='text-align:center'>"
                        + (data.arbeitszeit[i]-data.pausenzeit[i]) +
                    " h</div>\n\
                </div>";
    string += " <div class='row'>\n\
                    <div class='col col-10' style='text-align:center'>\n\
                        <i class='icon ion-social-euro' ></i>\n\
                    </div>\n\
                    <div class='col'>\n\
                        Gehalt\n\
                    </div>\n\
                    <div class='col' style='text-align:center'>"
                        + data.gehalt[i] +
                    " &#8364 </div>\n\
                </div>";
    var wunschListe = data.pausenWunschListe[i].innereListe;
    for(k in wunschListe) {
        var pause = new Date(wunschListe[k]);       
        if(k%2==0) {
            string += " <div class='row'>\n\
                            <div class='col col-10' style='text-align:center'>\n\
                                <i class='icon ion-ios-pause-outline' ></i>\n\
                            </div>\n\
                            <div class='col'>"
                                + correctDateFormat(pause.getHours()) + ":" + correctDateFormat(pause.getMinutes()) + " - ";
        } else {
            string += correctDateFormat(pause.getHours()) + ":" + correctDateFormat(pause.getMinutes()) + 
                            "</div>\n\
                            <div class='col' style='text-align:center'>\n\
                                Gew&uumlnscht\n\
                            </div>\n\
                        </div>";
        }                          
    } 
    string += "</div>";
    if(callFromMainMenu == false) {
        string += "<div class='item'><button id='change_btn' class='button button-block button-energized'>Bearbeiten</button><br>";
        string += "<button id='delete_btn' class='button button-block button-assertive'>L&oumlschen</button></div>";
    }
    
    $("#arbeitszeiten_details_content").html(string);
    
    if(data.geplant[i]===true && globalPauseIsUpdate===false && callFromMainMenu == true) {
        setTimeout(function() {
            pause_wuenschen_anzeigen(data,i);    
        }, 1);  
    }else if(globalPauseIsUpdate===false) {
        $('#pause_wuenschen_content').toggle();
    }
    
    document.getElementById("delete_btn").onclick = function(){
        setTimeout(function() {
            var isArbeitAktiv = true; //Teilt dem Webservice mit ob die zu löschende Arbeit die aktive ist. Bei gleichem Arbeitsbeginn von aktiver und geplanter Arbeit kommt es sonst zum Fehler
            if(data.aktiv == true && data.geplant[i] == false) {
                for(k in data.geplant){
                    if(data.geplant[k] === false && k > i) {
                        isArbeitAktiv = false;
                    }
                }
            } else { isArbeitAktiv = false;}
            $("#arbeitszeiten_details_content").scope().showConfirmArbeitLoeschen(arbeitsbeginn, data.username, isArbeitAktiv);
        },1);
    };
    
    document.getElementById("change_btn").onclick = function(){
        setTimeout(function() {
            arbeit_bearbeiten_anzeigen(data, i, aktuelleVidGlobal, data.username);
        },1);
    };
}

function arbeit_bearbeiten_anzeigen(data, index, vid, username) {
    
    var weekday = new Array(7);
    weekday[0]=  "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";
    
    var arbeitsbeginn = new Date(data.arbeitsbeginn[index]);
    var arbeitsende = new Date(data.arbeitsende[index]);
    var string = "  <div class='item item-divider'>" + weekday[arbeitsbeginn.getDay()] + " - " + arbeitsbeginn.getDate() + "." + (arbeitsbeginn.getMonth()+1) + "." + arbeitsbeginn.getFullYear() + "</div>\n\
                    <label class='item item-input item-select'>\n\
                        <div class='input-label'>\n\
                            Rolle\n\
                        </div>\n\
                        <select id='arbeit_bearbeiten_abrechnungsStatus' style='width:100%;text-align:center' /></select>\n\
                    </label>\n\
                    <label class='item item-input'>\n\
                        <span class='input-label'>Standnummer</span>\n\
                        <input value='"+data.standnummer[index]+"' id='arbeit_bearbeiten_standnummer' type='number' style='width:100%;text-align:center' />\n\
                    </label>\n\
                    <div class='item'>\n\
                        <div class='row'>\n\
                           <div class='col' style='text-align:center'>\n\
                                Beginn\n\
                           </div>\n\
                        </div>\n\
                        <div class='row'>\n\
                            <div class='col' style='text-align:center'>\n\
                                <input id='arbeit_bearbeiten_anfang_date' type='date' style='width:100%;text-align:center' />\n\
                            </div>\n\
                            <div class='col' style='text-align:center'>\n\
                                <input id='arbeit_bearbeiten_anfang_time' type='time' style='width:100%;text-align:center' value='"+correctDateFormat(arbeitsbeginn.getHours())+":"+correctDateFormat(arbeitsbeginn.getMinutes())+"' />\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                    <div class='item'>\n\
                        <div class='row'>\n\
                           <div class='col' style='text-align:center'>\n\
                                Ende\n\
                           </div>\n\
                        </div>\n\
                        <div class='row'>\n\
                            <div class='col' style='text-align:center'>\n\
                                <input id='arbeit_bearbeiten_ende_date' type='date' style='width:100%;text-align:center' />\n\
                            </div>\n\
                            <div class='col' style='text-align:center'>\n\
                                <input id='arbeit_bearbeiten_ende_time' type='time' style='width:100%;text-align:center' value='"+correctDateFormat(arbeitsende.getHours())+":"+correctDateFormat(arbeitsende.getMinutes())+"' />\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                    <div class='item' id='arbeit_bearbeiten_geplant_input_item'>\n\
                        <div class='row'>\n\
                            <div class='col' style='text-align:left'>\n\
                                Geplant\n\
                            </div>\n\
                            <div class='col' style='text-align:right'>\n\
                                <label class='checkbox checkbox-calm' style='padding:0px !important;width:100%'>\n\
                                    <input id='arbeit_bearbeiten_geplant' type='checkbox' style='display:inline-block'>\n\
                                </label>\n\
                            </div>\n\
                        </div>\n\
                    </div>";
    
    string += " <div id='arbeit_bearbeiten_pause_table'>";
    var pausenId=0;
    for(k in data.pausenListe[index].innereListe) {
        var pause = new Date(data.pausenListe[index].innereListe[k]);        
        
        if(k%2==0) {
            string += " <div id='arbeit_bearbeiten_pause_"+((k/2)+1)+"_tableRow' style='text-align:center;padding-top:10px'>\n\
                            Pause <i id='arbeit_bearbeiten_pausenfeld_delete_button_"+((k/2)+1)+"' style='color:crimson' class='icon ion-android-close'></i>\n\
                            <div class='row'>\n\
                                <div class='col'>\n\
                                    Anfang<br>\n\
                                    <input id='arbeit_bearbeiten_pause_"+((k/2)+1)+"_anfang' class='arbeit_bearbeiten_pause' type='time' step='900' style='text-align:center;width:100%' value='"+correctDateFormat(pause.getHours())+":"+correctDateFormat(pause.getMinutes())+"'>\n\
                                </div>\n\
                                <div class='col'>\n\
                                    Ende<br>";           
        } else {
            string += "             <input id='arbeit_bearbeiten_pause_"+((k/2)+0.5)+"_ende' class='arbeit_bearbeiten_pause' type='time' step='900' style='text-align:center;width:100%' value='"+correctDateFormat(pause.getHours())+":"+correctDateFormat(pause.getMinutes())+"'>\n\
                                </div>\n\
                            </div>\n\
                        </div>";                
        } 
        pausenId=k;
    }
    
    if(pausenId!==0) {
        pausenId=(pausenId/2)+0.5;
    }
    
    string += "</div><div id='arbeit_bearbeiten_pausenfeld_add_button' class='item' style='text-align:center'>\n\
                    <i class='icon ion-android-add' style='color:LimeGreen'></i> Pause\n\
                </div>";
    
    string += "<div class='item'><button id='arbeit_bearbeiten_button' class='button button-block button-calm'>Arbeit bearbeiten</button></div>";
    
    $('#arbeitszeiten_details_content').html(string);
    setTimeout(function() {
        $('#arbeitszeiten_details_card').scope().resizeScroll();
    },1);
    document.getElementById("arbeit_bearbeiten_pausenfeld_add_button").onclick=function(){
        pausenId++;
        var helpString = "<div id='arbeit_bearbeiten_pause_"+pausenId+"_tableRow' style='text-align:center;padding-top:10px'>\n\
                            Pause <i id='arbeit_bearbeiten_pausenfeld_delete_button_"+pausenId+"' style='color:crimson' class='icon ion-android-close'></i>\n\
                            <div class='row'>\n\
                                <div class='col'>\n\
                                    Anfang<br>\n\
                                    <input id='arbeit_bearbeiten_pause_"+pausenId+"_anfang' class='arbeit_bearbeiten_pause' type='time' step='900' style='text-align:center;width:100%' >\n\
                                </div>\n\
                                <div class='col'>\n\
                                    Ende<br>\n\
                                    <input id='arbeit_bearbeiten_pause_"+pausenId+"_ende' class='arbeit_bearbeiten_pause' type='time' step='900' style='text-align:center;width:100%' >\n\
                                </div>\n\
                            </div>\n\
                        </div>";
        $('#arbeit_bearbeiten_pause_table').append(helpString);
        setTimeout(function() {
            $('#arbeitszeiten_details_card').scope().resizeScroll();
        },1);
        setOnclick(pausenId);
    };
    
    var arbeitsbeginnHelper = arbeitsbeginn.getFullYear()+"-"+correctDateFormat((arbeitsbeginn.getMonth()+1))+"-"+correctDateFormat(arbeitsbeginn.getDate());   
    var arbeitsendeHelper = arbeitsende.getFullYear()+"-"+correctDateFormat((arbeitsende.getMonth()+1))+"-"+correctDateFormat(arbeitsende.getDate());
    $('#arbeit_bearbeiten_anfang_date').attr('value', arbeitsbeginnHelper);       
    $('#arbeit_bearbeiten_ende_date').attr('value', arbeitsendeHelper);  

    var veranstaltungBeginnDatum = aktuelleVeranstaltungBeginnGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungBeginnGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungBeginnGlobal.getDate());
    $('#arbeit_bearbeiten_anfang_date').attr('min', veranstaltungBeginnDatum);
    $('#arbeit_bearbeiten_ende_date').attr('min', veranstaltungBeginnDatum);

    var veranstaltungEndeDatum = aktuelleVeranstaltungEndeGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungEndeGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungEndeGlobal.getDate()); 
    $('#arbeit_bearbeiten_anfang_date').attr('max', veranstaltungEndeDatum);  
    $('#arbeit_bearbeiten_ende_date').attr('max', veranstaltungEndeDatum);  
            
    $('#arbeit_bearbeiten_geplant').attr('checked', data.geplant[index]);
    if(data.geplant[index] === false) {
        $('#arbeit_bearbeiten_geplant_input_item').hide();
    }
    
    var string2 = "";
    for(i in standdetails_dataGlobal[0].abrechnungsStatus) {
        string2 += "<option value='"+standdetails_dataGlobal[0].abrechnungsStatus[i]+"'>"+standdetails_dataGlobal[0].abrechnungsStatus[i]+"</option>";  
    }           
    $("#arbeit_bearbeiten_abrechnungsStatus").html(string2);
    $("#arbeit_bearbeiten_abrechnungsStatus").val(data.abrechnungsStatus[index]);
    var i = 1;
    while(i<=pausenId){
        setOnclick(i);         
        i++;
    }
    function setOnclick(i) {
        document.getElementById("arbeit_bearbeiten_pausenfeld_delete_button_"+i).onclick=function() {
            $("#arbeit_bearbeiten_pause_"+i+"_tableRow").html(" ");     
            $("#arbeit_bearbeiten_pause_"+i+"_tableRow").hide();
            setTimeout(function() {
                $('#arbeitszeiten_details_card').scope().resizeScroll();
            },1);
        };
    }
    
    document.getElementById("arbeit_bearbeiten_button").onclick=function(){arbeit_bearbeiten(username,vid,arbeitsbeginn);};
}

function arbeit_bearbeiten(username, vid, arbeitsBeginn_alt) {
    var standnummer = $('#arbeit_bearbeiten_standnummer').val();
    var abrechnungsStatus = $('#arbeit_bearbeiten_abrechnungsStatus').val();
    var arbeitsBeginn = new Date($('#arbeit_bearbeiten_anfang_date').val() +" "+ $('#arbeit_bearbeiten_anfang_time').val());
    var arbeitsEnde = new Date($('#arbeit_bearbeiten_ende_date').val() +" "+ $('#arbeit_bearbeiten_ende_time').val());
    var geplant = $('#arbeit_bearbeiten_geplant')[0].checked;
    alert(geplant);
    var pausenListe = [];     
    var pausen = document.getElementsByClassName("arbeit_bearbeiten_pause");
    for(i=0;i<pausen.length;i++){            
        pausenListe.push(new Date($('#arbeit_bearbeiten_anfang_date').val() +" "+ pausen[i].value));       
    }    
    
    var json = {
        vid:vid,
        username:username,
        standnummer:standnummer,
        abrechnungsStatus:abrechnungsStatus,
        arbeitsBeginn:arbeitsBeginn,
        arbeitsEnde:arbeitsEnde,
        arbeitsBeginn_alt:arbeitsBeginn_alt,
        pausenListe:pausenListe,
        geplant:geplant
    };
    
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/bearbeiten",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data[0] == "Arbeit wurde bearbeitet"){
            if(callToDeleteOrChangeFromOffeneArbeiten == true) {
                $("#arbeitszeiten_details_content").scope().offene_arbeiten_anzeigen();
                $('#arbeitszeiten_details_content').scope().showAlert("Success", "Arbeit wurde bearbeitet");
            } else {
                $("#arbeitszeiten_details_content").scope().ma_details(username); 
                $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde bearbeitet");
            }
            
        } else {
            var ausgabe = "Arbeit wurde nicht bearbeitet! <br><br>" + data[0];            
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);  
        }        
    });
}  

function arbeit_planen_hinzufuegen(usernames, boolean) {
    var json = {        
        vid:aktuelleVidGlobal,
        usernames:usernames,
        standnummer:geleiteterStandGlobal,
        abrechnungsStatus:arbeitPlanenHinzufuegen_abrechnungsStatusGlobal,
        geplant:boolean,
        arbeitsBeginn:arbeitPlanenHinzufuegen_arbeitsBeginnGlobal,
        arbeitsEnde:arbeitPlanenHinzufuegen_arbeitsEndeGlobal,
        pausenListe:arbeitPlanenHinzufuegen_pausenListeGlobal            
    };
    //alert("after");
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/planen_hinzufuegen",
        data: json,
        dataType: 'json'
    }).then(function(data){
        if(data[0]=="Es hat alles geklappt") {
            
            if(boolean == true) {
                $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde geplant");
            } else {
                $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde hinzugef&uumlgt");
            }            
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-2);        
        } else if(data[0]=="Pausenbeginn liegt nicht im Bereich der Arbeit " || data[0]=="Pausenbeginn liegt vor Ende der letzen Pause" 
                || data[0]=="Pausenende muss zwischen Pausenbeginn und Arbeitsende liegen" || data[0]=="Arbeitsbeginn oder Arbeitsende liegen nicht innerhalb der Veranstaltungszeit"
                || data[0]=="Arbeitsbeginn muss vor Arbeitsende liegen"  || data[0]=="Kein Stand mit passender Standnummer gefunden"  || data[0]=="Ungueltiger Abrechnungsstatus fuer diese Veranstaltung") {
            
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", data[0]);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);     
        } else {
            var ausgabe;        
            if(boolean == true) {
                ausgabe = "Arbeit konnte nicht geplant werden f&uumlr: <br><br><b>";
            } else {
                ausgabe = "Arbeit konnte nicht hinzugef&uumlgt werden f&uumlr: <br><br><b>";
            }
            for(i in data) {
                ausgabe += data[i] + "<br>";
            }
            ausgabe += "</b><br>M&oumlgliche Ursachen: <br> Ma ist abgeschlossen <br> Arbeit &uumlberschneidet sich mit anderer Arbeit";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);              
        }         
    });
}

function arbeit_loeschen(arbeitsBeginn, username, isArbeitAktiv) {
    var json = {
       vid:aktuelleVidGlobal,
       username:username,
       arbeitsBeginn:arbeitsBeginn,
       isArbeitAktiv:isArbeitAktiv
    };
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/loeschen",
        data: json,
        dataType: 'json'
    }).then(function(data){
       var boolean = JSON.parse(data);
       if(boolean) { 
           if(callToDeleteOrChangeFromOffeneArbeiten == true) {
                $("#arbeitszeiten_details_content").scope().offene_arbeiten_anzeigen(); 
                $('#arbeitszeiten_details_content').scope().showAlert("Success", "Arbeit wurde gel&oumlscht");
            } else {
                $("#arbeitszeiten_details_content").scope().ma_details(username); 
                $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Success", "Arbeit wurde gel&oumlscht");    
            }                    
       } else {
            var ausgabe = "Arbeit konnte nicht gel&oumlscht werden <br><br>";            
            ausgabe += "M&oumlgliche Ursache: <br><br> Ma ist bereits abgeschlossen";
            $('#standoptionen_mitarbeiterliste_content').scope().showAlert("Error", ausgabe);      
            $('#standoptionen_mitarbeiterliste_content').scope().historyGoBack(-1);  
       }          
    });        
}

function pause_wuenschen_anzeigen(data, index) {
    
    var arbeitsbeginn = new Date(data.arbeitsbeginn[index]);
    var arbeitsende = new Date(data.arbeitsende[index]);
     
    $('#pauseWuenschen_anfang_time').attr('min', correctDateFormat(arbeitsbeginn.getHours()) +":"+ correctDateFormat(arbeitsbeginn.getMinutes()) );    
    $('#pauseWuenschen_ende_time').attr('min', correctDateFormat(arbeitsbeginn.getHours()) +":"+ correctDateFormat(arbeitsbeginn.getMinutes()));    
    
    $('#pauseWuenschen_anfang_time').attr('max', correctDateFormat(arbeitsende.getHours()) +":"+ correctDateFormat(arbeitsende.getMinutes()) );    
    $('#pauseWuenschen_ende_time').attr('max', correctDateFormat(arbeitsende.getHours()) +":"+ correctDateFormat(arbeitsende.getMinutes()));  
    
    $('#pause_wuenschen_button2').click(function(){
        pause_wuenschen(data, index);
    });
}

function pause_wuenschen(data, i) {
    
    var arbeitsBeginn = new Date(data.arbeitsbeginn[i]);
    var pausenBeginn = new Date(arbeitsBeginn.getFullYear()+"-"+correctDateFormat(arbeitsBeginn.getMonth()+1)+"-"+correctDateFormat(arbeitsBeginn.getDate())+" "+ $("#pauseWuenschen_anfang_time").val());
    var pausenEnde = new Date(arbeitsBeginn.getFullYear()+"-"+correctDateFormat(arbeitsBeginn.getMonth()+1)+"-"+correctDateFormat(arbeitsBeginn.getDate())+" "+ $("#pauseWuenschen_ende_time").val());
    
    var json = {
        vid:aktuelleVidGlobal,
        username:usernameGlobal,
        arbeitsBeginn:arbeitsBeginn,
        pausenBeginn:pausenBeginn,
        pausenEnde:pausenEnde
    };
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/arbeit/pause_wuenschen",
        data: json,
        dataType: 'json'
    }).then(function(data){        
       if(data[0]==="Es hat alles geklappt"){          
           $('#arbeitszeiten_details_card').scope().showAlert("Success", "Pause wurde gew&uumlnscht");
           $('#arbeitszeiten_details_card').scope().historyGoBack(-2);        
        } else {
            $('#arbeitszeiten_details_card').scope().showAlert("Error", data[0]);            
        }
    });        
}

function anreisekosten_angeben_anzeigen() {
    var vid = $("#anreisekosten_angeben_vid").val();
    var username = $("#anreisekosten_angeben_username").val();

    var json = {
        vid:vid,
        username:username
    };
    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/anreisekosten_status",
        data: json,
        dataType: 'json'
    }).then(function(data){  
         anreisekosten_angeben_aktualisieren(data);
    });    
}

function anreisekosten_angeben() {
    var radioButtons = document.getElementsByName("anreisekosten_angeben_radio");
    var checkedRadio;
    for ( var i = 0; i < radioButtons.length; i++) {
        if(radioButtons[i].checked) {                
            checkedRadio = radioButtons[i].value;
            break;
        }
}
    if(checkedRadio == undefined) {
        $("#anreisekosten_angeben_ausgabe").html("<i style='color:red' class='icon ion-close-round'></i>Anreiseart ausw&aumlhlen");
    } else {

        var anreiseKommentar = $("#anreisekosten_angeben_kommentar").val();
        var kilometer;
        var selbstGefahrenBetrag;
        var abreiseOrt;
        var extraKosten;
        var mitgefahrenBei;
        var oeffentlichArt;
        var oeffentlichBetrag;
        var eingabeCheck = true;
        if(checkedRadio === "selbstGefahren") {
            kilometer = $("#anreisekosten_angeben_kilometer").val();
            selbstGefahrenBetrag = $("#anreisekosten_angeben_selbstGefahren_betrag").val();
            abreiseOrt = $("#anreisekosten_angeben_abreiseOrt").val();
            extraKosten = $("#anreisekosten_angeben_extraKosten").val();
            if(kilometer === "" || selbstGefahrenBetrag === "" || abreiseOrt === "" || extraKosten === ""){                    
                eingabeCheck = false;
            }
        } else if(checkedRadio === "mitGefahren") {
             mitgefahrenBei = $("#anreisekosten_angeben_mitgefahrenBei").val();
             if(mitgefahrenBei === ""){                    
                eingabeCheck = false;
            }
        } else if(checkedRadio === "oeffentlich") {
             oeffentlichArt = $("#anreisekosten_angeben_select").val();
             oeffentlichBetrag = $("#anreisekosten_angeben_oeffentlich_betrag").val();
             if(oeffentlichArt === "" || oeffentlichBetrag === ""){                    
                eingabeCheck = false;
            }
        }
        if(!eingabeCheck) {
            $("#anreisekosten_angeben_ausgabe").html("<i style='color:red' class='icon ion-close-round'></i>Alle Felder ausf&uumlllen");
        } else {
            var json = {
                vid:aktuelleVidGlobal,
                username:usernameGlobal,
                anreiseKommentar:anreiseKommentar,
                anreiseArt:checkedRadio,
                kilometer:kilometer,
                selbstGefahrenBetrag:selbstGefahrenBetrag,
                abreiseOrt:abreiseOrt,
                extraKosten:extraKosten,
                mitgefahrenBei:mitgefahrenBei,
                oeffentlichArt:oeffentlichArt,
                oeffentlichBetrag:oeffentlichBetrag
            };            
            var help = JSON.stringify(json);
            $.ajax({
                type: "POST",
                url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/anreisekosten_angeben",
                data: json,
                dataType: 'json'
            }).then(function(data){
                anreisekosten_angeben_aktualisieren(data);
            }); 
        }            
    }
}

function anreisekosten_angeben_aktualisieren(data) {
    if(!data.anreisekostenAngegeben) {
        var ausgabe = "<i style='color:red' class='icon ";
        if(data.anreisekostenBestaetigt) {
            ausgabe += "ion-close-round'></i>Es ist ein Fehler passiert";           
        } else {
            ausgabe += "ion-close-round'></i>Keine Anreise angegeben";   
        }
        $("#anreisekosten_angeben_ausgabe").html(ausgabe);
    } else {
        function setRadio(radioToSet) {
            //alert("setRadio: " + radioToSet);
            var radioButtons = document.getElementsByName("anreisekosten_angeben_radio");
            for ( var i = 0; i < radioButtons.length; i++) {
                if(radioButtons[i].value === radioToSet) { 
                    //alert("found one ");
                    radioButtons[i].checked = true;
                    break;
                }
            }
            switch(radioToSet) {
                case "selbstGefahren":
                    $('#anreisekosten_angeben_selbstGefahren').toggle(true);
                    $('#anreisekosten_angeben_mitGefahren').toggle(false);
                    $('#anreisekosten_angeben_oeffentlich').toggle(false);
                    break;
                case "mitGefahren":
                    $('#anreisekosten_angeben_selbstGefahren').toggle(false);
                    $('#anreisekosten_angeben_mitGefahren').toggle(true);
                    $('#anreisekosten_angeben_oeffentlich').toggle(false);
                    break;
                case "oeffentlich":
                    $('#anreisekosten_angeben_selbstGefahren').toggle(false);
                    $('#anreisekosten_angeben_mitGefahren').toggle(false);
                    $('#anreisekosten_angeben_oeffentlich').toggle(true);
                    break;
            }              
        }
        function selectElement(valueToSelect) {    
            var element = document.getElementById('anreisekosten_angeben_select');
            element.value = valueToSelect;
        }       
        if(data.anreiseArt == "selbstGefahren") {
            setRadio("selbstGefahren");
            $("#anreisekosten_angeben_kilometer").val(data.kilometer);
            $('#anreisekosten_angeben_selbstGefahren_betrag').val( Math.round((data.kilometer/100*15)).toFixed(2) );
            $("#anreisekosten_angeben_abreiseOrt").val(data.abreiseOrt);
            $("#anreisekosten_angeben_extraKosten").val(data.extraKosten);
            $("#anreisekosten_angeben_mitgefahrenBei").val("");
            $("#anreisekosten_angeben_oeffentlich_betrag").val("");
        } else if(data.anreiseArt == "mitGefahren") {
            setRadio("mitGefahren");
            $("#anreisekosten_angeben_mitgefahrenBei").val(data.mitgefahrenBei);
            $("#anreisekosten_angeben_kilometer").val("");
            $("#anreisekosten_angeben_selbstGefahren_betrag").val("");
            $("#anreisekosten_angeben_abreiseOrt").val("");
            $("#anreisekosten_angeben_extraKosten").val("");                
            $("#anreisekosten_angeben_oeffentlich_betrag").val("");
        } else if(data.anreiseArt == "oeffentlich") {
            setRadio("oeffentlich");
            selectElement(data.oeffentlichArt);                                 
            $("#anreisekosten_angeben_oeffentlich_betrag").val(data.anreiseKosten);
            $("#anreisekosten_angeben_mitgefahrenBei").val("");
            $("#anreisekosten_angeben_kilometer").val("");
            $("#anreisekosten_angeben_selbstGefahren_betrag").val("");
            $("#anreisekosten_angeben_abreiseOrt").val("");
            $("#anreisekosten_angeben_extraKosten").val("");     
        }
        if(!data.anreisekostenBestaetigt) {
           var ausgabe = "<i class='icon ion-clipboard'></i>Anreisekosten angegeben";    
            $("#anreisekosten_angeben_ausgabe").html(ausgabe);
        } else {
            $("#anreise_angebeben_button").hide();
            var ausgabe = "<i style='color:Chartreuse' class='icon ion-checkmark-round'></i>Anreisekosten best&aumltigt";    
            $("#anreisekosten_angeben_ausgabe").html(ausgabe);
        }
    }       
}

function anreisekosten_bestaetigen_liste_abrufen() {
    var vid = $("#anreisekosten_bestaetigen_liste_abrufen_vid").val();
    var json = {
        vid:vid
    };

    $.ajax({
        type: "GET",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/anreisekosten_liste_abrufen",
        data: json,
        dataType: 'json'
    }).then(function(data){
        var table = $("#anreisekosten_bestaetigen_liste_abrufen_ausgabe");
        function setOnClick(id) {
             document.getElementById(id).onclick=function(){anreisekosten_bestaetigen_liste_element_anzeigen(data[i],vid);};     
        }
        for(i in data) {
           var string = "<tr><th id=\"anreisekosten_bestaetigen_liste_abrufen_ausgabe_"+i+"\">"+data[i].mitarbeiterName+"</th></tr>";
           table.html("");
           table.append(string);
           var id = "anreisekosten_bestaetigen_liste_abrufen_ausgabe_"+i;
           setOnClick(id);
       }
    });
}

function anreisekosten_bestaetigen_liste_element_anzeigen(data,vid) {
    var table = $("#anreisekosten_bestaetigen_liste_abrufen_ausgabe");
    var string = "<tr><th>Name: "+data.mitarbeiterName+"</th><th>Anreiseart: "+data.anreiseArt+"</th></tr>";
    if(data.anreiseArt === "selbstGefahren") {
        string += "<tr><th>Kilometer: "+data.kilometer+"</th><th>AbreiseOrt: "+data.abreiseOrt+"</th></tr>";
        string += "<tr><th>Betrag: "+data.anreiseKosten+"</th><th>Extrakosten: "+data.extraKosten+"</th></tr>";
        string += "<tr><th colspan=\"2\">Kommentar: "+data.anreiseKommentar+"</th></tr>";
    } else if(data.anreiseArt === "mitGefahren") {
        string += "<tr><th colspan=\"2\">Mitrgefahren Bei: "+data.mitgefahrenBei+"</th></tr>";
        string += "<tr><th colspan=\"2\">Kommentar: "+data.anreiseKommentar+"</th></tr>";
    } else if(data.anreiseArt === "oeffentlich") {
        string += "<tr><th>Oeffentlich Art:  "+data.oeffentlichArt+"</th><th>Betrag: "+data.anreiseKosten+"</th></tr>";
        string += "<tr><th colspan=\"2\">Kommentar: "+data.anreiseKommentar+"</th></tr>";
    }
    string += "<tr><th><button id=\"anreisekosten_bestaetigen_liste_abrufen_besteatigen_button\">Bestaetigen</button></th><th><button id=\"anreisekosten_bestaetigen_liste_abrufen_loeschen_button\">Loeschen</button></th></tr>";
    table.html(string);
    document.getElementById("anreisekosten_bestaetigen_liste_abrufen_besteatigen_button").onclick=function() {anreisekosten_bestaetigen_und_loeschen(true,vid, data.username);};
    document.getElementById("anreisekosten_bestaetigen_liste_abrufen_loeschen_button").onclick=function() {anreisekosten_bestaetigen_und_loeschen(false,vid, data.username);};
}

function anreisekosten_bestaetigen_und_loeschen(bool,vid, username) {
    var json = {
        bestaetigen:bool,
        vid:vid,
        username:username
    };
    $.ajax({
        type: "POST",
        url: "http://tomcat01lab.cs.univie.ac.at:31740/MitarbeiterApp/veranstaltung/anreisekosten_bestaetigen_loeschen",
        data: json,
        dataType: 'json'
    }).then(function(data){
        //alert("then function");
        var erfolgreich = JSON.parse(data[0]);
        var bestaetigt = JSON.parse(data[1]);           
        var table = $("#anreisekosten_bestaetigen_liste_abrufen_ausgabe");
        var string = "";
        if(erfolgreich){
            if(bestaetigt) {
                string += "Anreise wurde bestaetigt";
            } else {
                string += "Anreise wurde geloescht";
            }
        } else {
            string += "Es ist ein Fehler aufgetreten";
        }
        table.html("<tr><th>"+string+"</th></tr");
    });   
}

function offene_arbeiten_anzeigen(data) {
     var string ="";               
    if(data.length == 0) {
        string += "<div class='item'><div class='row' style='text-align:center;'><div class='col'>";
        string += "Es gibt keine offenen Arbeiten an diesem Stand</div></div></div>";
    } else {      
        for(i in data) {
            string += "<div class='item item-divider'>"+ data[i].mitarbeiterName +"</div>";        
            var idCountHelp = 0;
            
            for(j in data[i].standnummer) {
                var arbeitsbeginn = new Date(data[i].arbeitsbeginn[j]);
                var arbeitsende = new Date(data[i].arbeitsende[j]);

                string += "<div class='item'><div id='arbeit_details_anzeigen_"+i+""+j+"' class='row' style='text-align:center;'>\n\
                                <div class='col' style='position:relative;max-width:20%'>";
                if(data[i].geplant[j]===false){
                    string += "<i style='color:Chartreuse;font-size:60px;display:block;' class='ion-checkmark-round'></i>";
                } else {
                    string += "<i style='font-size:60px;display:block;' class='ion-clipboard'></i>";
                }
                string +=        "</div>\n\
                                <div class='col' style='max-width:80%'>"
                                    + correctDateFormat(arbeitsbeginn.getHours()) + ":" + correctDateFormat(arbeitsbeginn.getMinutes()) + " - "
                                    + correctDateFormat(arbeitsende.getHours()) + ":" + correctDateFormat(arbeitsende.getMinutes()) + "<br>"
                                    + data[i].arbeitszeit[j] + " h Arbeitszeit <br>"
                                    + data[i].pausenzeit[j] + " h Pause" + 
                                "</div>\n\
                                <div class='col col-center' style='max-width:20%'><b>"
                                    + data[i].gehalt[j] + " &#8364 </b>" +
                                "</div>\n\
                            </div>\n\
                        </div>";
                idCountHelp++;                
            }                       
        }    
    }
    $('#offeneArbeiten_list').html(string);
    function setOnClick(data, i, j) {
        var id = "arbeit_details_anzeigen_"+i+""+j;
        document.getElementById(id).onclick=function() {
            setTimeout(function() {
                $("#offeneArbeiten_list").scope().arbeitszeit_details(data[i],j);    
            }, 1);            
        };
    }
    for(i in data) {
        for(j in data[i].standnummer) {
                    setOnClick(data,i,j);
        }
    }
}

function standdetailsInObjektWandeln(data, standmitarbeiterOnly){
    
    var standdetailsDataArray = [];    
    var mitarbeiterListeNamen;
    var mitarbeiterListeStundenGesamt;
    var mitarbeiterListeStundenAktuell;
    var mitarbeiterListePausen;
    var mitarbeiterListeUsernames;
    var mitarbeiterListeNaechsterArbeitsbeginn;
    var pauseGewuenscht;
    var istInPause;
    var istAbgeschlossen;
    
    if(standmitarbeiterOnly === true) {
        
        mitarbeiterListeNamen = data.mitarbeiterListe;
        mitarbeiterListeStundenGesamt = data.stundenListeGesamt;
        mitarbeiterListeStundenAktuell = data.stundenListeAktuellerTag;
        mitarbeiterListePausen = data.pausenListe;
        mitarbeiterListeUsernames = data.mitarbeiterUsernameListe;
        mitarbeiterListeNaechsterArbeitsbeginn = data.naechsterArbeitsbeginn;
        pauseGewuenscht = data.pauseGewuenscht;
        istInPause = data.istInPause;
        istAbgeschlossen = data.istAbgeschlossen;
    } else {
        
        mitarbeiterListeNamen = data.mitarbeiterGesamtName;
        mitarbeiterListeUsernames = data.mitarbeiterGesamtUserame; 
    }
    
    for(i in mitarbeiterListeNamen) {
        
        var mitarbeiter = {};
        mitarbeiter.mitarbeitername = mitarbeiterListeNamen[i];
        mitarbeiter.username = mitarbeiterListeUsernames[i];
        
        if(standmitarbeiterOnly === true) {
            
            mitarbeiter.stundenGesamt = mitarbeiterListeStundenGesamt[i];
            mitarbeiter.stundenAktuell = mitarbeiterListeStundenAktuell[i];
            mitarbeiter.pausen = mitarbeiterListePausen[i];

            mitarbeiter.naechsteArbeit = mitarbeiterListeNaechsterArbeitsbeginn[i];
            mitarbeiter.pauseGewuenscht = pauseGewuenscht[i];
            mitarbeiter.istInPause = istInPause[i];
            mitarbeiter.istAbgeschlossen = istAbgeschlossen[i];
            mitarbeiter.backgroundColor = standoptionen_mitarbeiterliste_getBackgroundColor(pauseGewuenscht[i], istInPause[i], istAbgeschlossen[i]); //<- Listen müssen bei GET Veranstalugn gleich heißen !
        }
        standdetailsDataArray.push(mitarbeiter);        
    }
    
    standdetailsMitarbeiterDataGlobal = standdetailsDataArray;   
    
}

function standdetailsButtonMehrWeniger() {
    $('#standoptionen_standdetails_details').toggle();
    $('#standoptionen_standdetails_list').toggle();
    $('#colorSortButtons').toggle();
    $('#icon-minus').toggle();
    $('#icon-plus').toggle();
    setTimeout(function() {
        $('#arbeitszeiten_details_card').scope().resizeScroll();
    },1);
    var button = $('#standdetailsButtonMehrWeniger');    
    if($('#icon-minus').css("display") === "none")  {
        button.css("background-color", "lightgreen");
    } else {
        button.css("background-color", "#ff6666");
    }
    
    
}

function standoptionen_mitarbeiterliste_getBackgroundColor(pauseGewuenscht, istInPause, istAbgeschlossen) {
    
    var returner ="";
    
    if(istAbgeschlossen === true) {
            
        returner = "lightgreen";
    } else if(istInPause === true) { 

        returner = "lightgrey";
    } else if(pauseGewuenscht === true) { 

        returner = "lightyellow";
    }
    
    return returner;
}

function maDetailsInObjektWandeln(data) {
    
    var weekday = new Array(7);
        weekday[0]=  "Sonntag";
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";
        
    var maDetailsData = {};
    maDetailsData.arbeitstage = [];
    
    maDetailsData.gehaltGesamt = data.gehaltGesamt;
    maDetailsData.anreisekosten = data.anreisekosten;
    maDetailsData.anreisekommentar = data.anreiseKommentar;
    maDetailsData.auszahlungsbetrag = data.auszahlungsBetrag;
    
    var arbeitstag = {};  
    arbeitstag.arbeiten = []; 
    
    if(data.arbeitsbeginn.length > 0) {
        
        var arbeitsbeginn = new Date(data.arbeitsbeginn[0]);
        var tagLetzterArbeit = arbeitsbeginn;        
        
        arbeitstag.weekday = weekday[arbeitsbeginn.getDay()];
        arbeitstag.date = correctDateFormat(arbeitsbeginn.getDate());
        arbeitstag.month = correctDateFormat(arbeitsbeginn.getMonth()+1);
        arbeitstag.year = arbeitsbeginn.getFullYear();
        
    }    
    
    for(i in data.standnummer) {
        
        var arbeitsbeginn = new Date(data.arbeitsbeginn[i]);
        var arbeitsende = new Date(data.arbeitsende[i]);
        
        //Arbeit betrifft einen neuen Tag: Alten Tag pushen, neuen Tag erstellen, Generelle Daten für den Tag setzen, tagLetzterArbeit aktualisieren
        if(arbeitsbeginn.getDate() !== tagLetzterArbeit.getDate()) { 
            
            tagLetzterArbeit = arbeitsbeginn;
            maDetailsData.arbeitstage.push(arbeitstag);            
            arbeitstag = {};  
            arbeitstag.arbeiten = [];    
            
            arbeitstag.weekday = weekday[arbeitsbeginn.getDay()];
            arbeitstag.date = correctDateFormat(arbeitsbeginn.getDate());
            arbeitstag.month = correctDateFormat(arbeitsbeginn.getMonth());
            arbeitstag.year = arbeitsbeginn.getFullYear();      
        }
                
        var arbeit = {};
        arbeit.arbeitszeit = data.arbeitszeit[i];
        arbeit.pausenzeit = data.pausenzeit[i];
        arbeit.gehalt = data.gehalt[i];
        arbeit.abrechnungsstatus = data.abrechnungsStatus[i];
        arbeit.standnummer = data.standnummer[i];
        arbeit.weekday = weekday[arbeitsbeginn.getDay()];
        
        arbeit.beginn_year = arbeitsbeginn.getFullYear();
        arbeit.beginn_month = correctDateFormat(arbeitsbeginn.getMonth()+1);
        arbeit.beginn_date = correctDateFormat(arbeitsbeginn.getDate());
        arbeit.beginn_hour = correctDateFormat(arbeitsbeginn.getHours());
        arbeit.beginn_minute = correctDateFormat(arbeitsbeginn.getMinutes());
        
        arbeit.ende_year = arbeitsende.getFullYear();
        arbeit.ende_month = correctDateFormat(arbeitsende.getMonth()+1);
        arbeit.ende_date = correctDateFormat(arbeitsende.getDate());
        arbeit.ende_hour = correctDateFormat(arbeitsende.getHours());
        arbeit.ende_minute = correctDateFormat(arbeitsende.getMinutes());
        
        arbeit.pausenliste = [];
        var pauseObjekt = {};
        var pausenListe = data.pausenListe[i].innereListe;    
        
        for(k in pausenListe) {            
        
            var pause = new Date(pausenListe[k]); 
            
            if( k%2 == 0 ) {  
                
                pauseObjekt = {};                      
                pauseObjekt.beginn_hour = correctDateFormat(pause.getHours());
                pauseObjekt.beginn_minute = correctDateFormat(pause.getMinutes());    
            } else {    
                
                pauseObjekt.ende_hour = correctDateFormat(pause.getHours());
                pauseObjekt.ende_minute = correctDateFormat(pause.getMinutes());  
                
                if( k == (pausenListe.length-1) ) {
                    pauseObjekt.pausenzeit = data.pausenzeit[i];
                } 
                
                arbeit.pausenliste.push(pauseObjekt);
            }                       
        }                          
    
        arbeit.pausenwunschliste = [];
        var pausenwunschObjekt = {};
        var wunschListe = data.pausenWunschListe[i].innereListe;
        
        for(k in wunschListe) {            
        
            var pause = new Date(wunschListe[k]);  
        
            if(k%2==0) {  
                
                pausenwunschObjekt = {};                      
                pausenwunschObjekt.beginn_hour = correctDateFormat(pause.getHours());
                pausenwunschObjekt.beginn_minute = correctDateFormat(pause.getMinutes());  
            } else { 
                
                pausenwunschObjekt.ende_hour = correctDateFormat(pause.getHours());
                pausenwunschObjekt.ende_minute = correctDateFormat(pause.getMinutes());
                arbeit.pausenwunschliste.push(pausenwunschObjekt);
           }           
        }
        
        if(data.geplant[0] === false){
            
            arbeit.icon_style = 'color:Chartreuse;font-size:60px;display:block;';
            arbeit.icon_class = 'ion-checkmark-round';
        } else {
            
            arbeit.icon_style = 'font-size:60px;display:block;';
            arbeit.icon_class = 'ion-clipboard';
        }          
        
        arbeitstag.arbeiten.push(arbeit);
        
        //Es ist die letzte Arbeit
        if( i+1 == data.standnummer.length ) {            
            maDetailsData.arbeitstage.push(arbeitstag);
        }
    }
    
    maDetailsDataGlobal = maDetailsData;
}