app.controller('testController', function($scope, $state,  $window, $ionicScrollDelegate, $ionicHistory, $ionicViewSwitcher, $ionicPopup, $ionicPopover) {
    $scope.verifyMitarbeiter = function() {
        
        $ionicViewSwitcher.nextDirection('enter');
        if(usernameGlobal == "Exception") {
            $scope.showAlert("Error" , "Username oder Passwort sind falsch!");
            
        } else {
            
            if( aktuelleVidGlobal == null) {
                $state.go('tabs.keineAktuelleVeranstaltung');

            } else {

                $state.go('tabs.liste');

                setTimeout(function(){

                    $( ".ideal_Item" ).css( "height", (($window.innerHeight-93)/4));
                    document.getElementById("liste_arbeitszeiten_einsehen").onclick=function() {
                        callFromMainMenu = true;
                        $scope.ma_details(usernameGlobal); 
                    };
                    if( geleiteterStandGlobal == null ){
                        $('#liste_standoptionenAnzeigen').toggleClass( "item-content", false );
                        $('#liste_standoptionenAnzeigen').css("display", "none");
                    } else {
                        $('#liste_standoptionenAnzeigen').toggleClass( "item-content", true );
                    }
                    
                }, 1);      
            }
        }
  };
    $scope.ma_details = function(username) {
        callToDeleteOrChangeFromOffeneArbeiten = false;
        var json = {
            vid:aktuelleVidGlobal,
            username:username
        };
        $.ajax({
            type: "GET",
            url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/ma_details",
            data: json,
            dataType: 'json'
        }).then(function(data){
            $state.go('tabs.arbeitszeiten');
            globalPauseIsUpdate=false;
            setTimeout(function(){ma_details(data);}, 1);    
        });
    };
    
    $scope.vergangene_ma_Details = function(vid) {
        var json = {
            vid:vid,
            username:usernameGlobal
        };
        
        $.ajax({
            type: "GET",
            url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/ma_details",
            data: json,
            dataType: 'json'
        }).then(function(data){
            
            maDetailsInObjektWandeln(data);
            $state.go('tabs.past_maDetails');
             
        });
    };
    
    $scope.arbeitszeit_details = function(data, i) { 
        $state.go('tabs.arbeitszeiten_details');        
        setTimeout(function(){
            arbeit_details_anzeigen(data, i);
            if(globalPauseIsUpdate==false) {
                $('#pause_wuenschen_ausgabe').toggle(false);
            }
        }, 1);      
    };
    $scope.anreisekosten_angeben_anzeigen = function() {
        var json = {
            vid:aktuelleVidGlobal,
            username:usernameGlobal
        };
        $.ajax({
            type: "GET",
            url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/anreisekosten_status",
            data: json,
            dataType: 'json'
        }).then(function(data){ 
            //alert("then ");            
            $state.go('tabs.anreisekosten_angeben');        
            setTimeout(function(){
                $('#anreisekosten_angeben_selbstGefahren').toggle();
                $('#anreisekosten_angeben_mitGefahren').toggle();
                $('#anreisekosten_angeben_oeffentlich').toggle();
                $('input[name="anreisekosten_angeben_radio"]').bind('change',function(){
                    switch($(this).val()) {
                        case "selbstGefahren":
                            $('#anreisekosten_angeben_selbstGefahren').toggle();
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
                 });
                 $('#anreisekosten_angeben_kilometer').change(function(){
                     //alert("Change");
                    $('#anreisekosten_angeben_selbstGefahren_betrag').val( Math.round(($('#anreisekosten_angeben_kilometer').val()/100*15)).toFixed(2) );
                 });
                 anreisekosten_angeben_aktualisieren(data);
                 
            }, 1);
        });
    };
    $scope.geplante_arbeiten_anzeigen = function() {
        callFromMainMenu = true;
        var json = {
            vid:aktuelleVidGlobal,
            username:usernameGlobal
        };
        $.ajax({
            type: "GET",
            url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/ma_details",
            data: json,
            dataType: 'json'
        }).then(function(data){
            //alert("then");
            globalPauseIsUpdate=false;
            $state.go('tabs.geplante_arbeiten');
            setTimeout(function(){geplante_arbeiten_anzeigen(data);}, 1);    
        });
    };
    $scope.standoptionen_anzeigen = function() {  
        callFromMainMenu = false;
        var json = {vid:aktuelleVidGlobal,
                    standnummer:geleiteterStandGlobal};
        $.ajax({
            type: "GET",
            url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/stand/details",
            data: json,
            dataType: 'json'
        }).then(function(data){
            standdetails_dataGlobal = data;   
            $state.go('tabs.standoptionen_anzeigen');
            standdetailsInObjektWandeln(data[0], true);                
        });
    };
    $scope.standdetails_anzeigen = function() {
        $state.go('tabs.standdetails');
        actionToPerformGlobal = "standdetails";
        setTimeout(function() {                     
            $('#standdetails_standnummer').html(standdetails_dataGlobal[0].standnummer);   
            $('#standdetails_standleiter').html(standdetails_dataGlobal[0].standleiter); 
            $('#standdetails_stellvertreter').html(standdetails_dataGlobal[0].stellvertreter);
            var heightList = $('#standoptionen_standdetails_list').height();
            $( ".standoptionen_standdetails_details" ).css( "height",heightList); 
            $('#standoptionen_standdetails_details').toggle();
            $('#standoptionen_standdetails_list').toggle();
            $('#colorSortButtons').toggle();
           // $( ".standoptionen_mitarbeiterliste" ).css( "height", (($('#standoptionen_mitarbeiterliste_content').height()+2))); 
            setTimeout(function() {
                $('#standoptionen_standdetails_list').scope().changeScrollable(true);
                $('#standoptionen_standdetails_list').scope().resizeScroll();
            },5);
            
            //$('#standoptionen_standdetails_content').html(standdetails_dataGlobal[0].stellvertreter);
            //$('#standoptionen_mitarbeiterliste_content').html(standdetails_dataGlobal[0].standleiter);
        },5);
        
    };
    $scope.resizeScroll = function() {
        $ionicScrollDelegate.resize();
    };
    $scope.standoptionen_mitarbeiterliste_anzeigen = function(standmitarbeiterOnly, data) {
        $state.go('tabs.standoptionen_mitarbeiterliste.liste');
        setTimeout(function() {
            var buttonHeight = $('#standoptionen_mitarbeiterliste_button').height();
            var listHeight = ($window.innerHeight-93-buttonHeight-20);
            $( ".standoptionen_mitarbeiterliste" ).css( "height",listHeight); 
            $( "#standoptionen_mitarbeiterliste_button" ).css( "top", ((listHeight)));            
            
            standdetailsInObjektWandeln(data[0], standmitarbeiterOnly);  
            
            
        },1);
    };
    $scope.arbeit_beginnen_anzeigen = function() {
        $state.go('tabs.arbeitBeginnen');        
    };
    $scope.arbeitBeginnen = function() {
        var dateHelper = new Date();
        var string = dateHelper.getFullYear() + "-" + (dateHelper.getMonth()+1) + "-" + dateHelper.getDate() + " " + $('#arbeitBeginnen_time').val();
        arbeitBeginnen_arbeitsBeginnGlobal = new Date(string);
        actionToPerformGlobal = "arbeitBeginnen";
        setTimeout(function() {
            $('#arbeitBeginnen_list').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
        },1);
    };
    $scope.pause_hinzufuegen_anzeigen = function() {        
        $state.go('tabs.pauseHinzufuegen');  
        setTimeout(function(){
            $('#pauseHinzufuegen_beginn_time').change(function() {
                $('#pauseHinzufuegen_beginn_checkbox')[0].checked=false;
            });  
             $('#pauseHinzufuegen_ende_time').change(function() {
                $('#pauseHinzufuegen_ende_checkbox')[0].checked=false;
            });  
        },1);
    };
    $scope.pauseHinzufuegen = function() {
        var dateHelper = new Date();
        var string = dateHelper.getFullYear() + "-" + (dateHelper.getMonth()+1) + "-" + dateHelper.getDate() + " ";
        if($('#pauseHinzufuegen_beginn_checkbox')[0].checked == false) {
           pauseHinzufuegen_pausenBeginn = new Date((string + $('#pauseHinzufuegen_beginn_time').val()));
         } else {
          pauseHinzufuegen_pausenBeginn = new Date("1993-01-8");
        }
        if($('#pauseHinzufuegen_ende_checkbox')[0].checked == false) {
            pauseHinzufuegen_pausenEnde = new Date(string + $('#pauseHinzufuegen_ende_time').val());
        } else {
          pauseHinzufuegen_pausenEnde =   new Date("1993-01-8");
        }
        actionToPerformGlobal ="pauseHinzufuegen";
        setTimeout(function() {
            $('#pauseHinzufuegen_ende_time').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
        },1);
    };
    $scope.arbeit_beenden_anzeigen = function() {
        $state.go('tabs.arbeitBeenden');
        setTimeout(function() {
            var dateHelper = new Date();
            var akutellesDatum = dateHelper.getFullYear() + "-" + correctDateFormat((dateHelper.getMonth()+1)) + "-" + correctDateFormat(dateHelper.getDate());            
            $('#arbeitBeenden_date').attr('value', akutellesDatum);            
            
            var veranstaltungBeginnDatum = aktuelleVeranstaltungBeginnGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungBeginnGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungBeginnGlobal.getDate());
            $('#arbeitBeenden_date').attr('min', veranstaltungBeginnDatum);
            
            var veranstaltungEndeDatum = aktuelleVeranstaltungEndeGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungEndeGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungEndeGlobal.getDate()); 
            $('#arbeitBeenden_date').attr('max', veranstaltungEndeDatum);           
        },1); 
    };
    $scope.arbeitBeenden = function() {
        var string = $('#arbeitBeenden_date').val() + " " + $('#arbeitBeenden_time').val();
        arbeitBeenden_arbeitsEndeGlobal = new Date(string);
        actionToPerformGlobal = "arbeitBeenden";
        setTimeout(function() {
            $('#arbeitBeenden_list').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
        },1); 
    };
    $scope.arbeit_planen_anzeigen = function() {
        actionToPerformGlobal = "arbeitPlanen";
        arbeitPlanenHinzufuegenTitleGlobal = "Arbeit planen";
        setTimeout(function() {
            $('#liste_content').scope().arbeit_planen_hinzufuegen_anzeigen(true);
        },1);
    };
    $scope.arbeit_hinzufuegen_anzeigen = function() {
        actionToPerformGlobal = "arbeitHinzufuegen";
        arbeitPlanenHinzufuegenTitleGlobal = "Arbeit hinzuf&uumlgen";
        setTimeout(function() {
            $('#liste_content').scope().arbeit_planen_hinzufuegen_anzeigen(false);
        },1);
    };
    $scope.arbeit_planen_hinzufuegen_anzeigen = function(geplant) {
        $state.go('tabs.arbeitPlanen');        
        setTimeout(function() {
            var dateHelper = new Date();
            var akutellesDatum = dateHelper.getFullYear() + "-" + correctDateFormat((dateHelper.getMonth()+1)) + "-" + correctDateFormat(dateHelper.getDate());            
            $('#arbeitPlanenHinzufuegen_beginn_date').attr('value', akutellesDatum);            
            $('#arbeitPlanenHinzufuegen_ende_date').attr('value', akutellesDatum);
            if(geplant == true) {
                $('#arbeitPlanenHinzufuegen_beginn_date').attr('min', akutellesDatum);
                $('#arbeitPlanenHinzufuegen_ende_date').attr('min', akutellesDatum);
            } else {
                var veranstaltungBeginnDatum = aktuelleVeranstaltungBeginnGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungBeginnGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungBeginnGlobal.getDate());
                $('#arbeitPlanenHinzufuegen_beginn_date').attr('min', veranstaltungBeginnDatum);
                $('#arbeitPlanenHinzufuegen_ende_date').attr('min', veranstaltungBeginnDatum);
            }
            var veranstaltungEndeDatum = aktuelleVeranstaltungEndeGlobal.getFullYear() + "-" + correctDateFormat((aktuelleVeranstaltungEndeGlobal.getMonth()+1)) + "-" + correctDateFormat(aktuelleVeranstaltungEndeGlobal.getDate()); 
            $('#arbeitPlanenHinzufuegen_beginn_date').attr('max', veranstaltungEndeDatum);
            $('#arbeitPlanenHinzufuegen_ende_date').attr('max', veranstaltungEndeDatum);            
            $('#arbeitPlanen_list').scope().onclicksFuerPausen();            
            $ionicScrollDelegate.resize();
            
            var string = "";
            for(i in standdetails_dataGlobal[0].abrechnungsStatus) {
                string += "<option value='"+standdetails_dataGlobal[0].abrechnungsStatus[i]+"'>"+standdetails_dataGlobal[0].abrechnungsStatus[i]+"</option>";  
            }           
            $("#arbeit_planen_hinzufuegen_abrechnungsStatus").html(string);
        },1); 
    };
    $scope.onclicksFuerPausen = function() {
        var pausenId = 0;
        $("#arbeit_planen_hinzufuegen_pausenfeld_add_button").click(function(){
            pausenId++;
            var string =   "<div id='arbeit_planen_hinzufuegen_pause_"+pausenId+"_tableRow' style='text-align:center;padding-top:10px'>\n\
                                Pause <i id='arbeit_planen_hinzufuegen_pausenfeld_delete_button_"+pausenId+"' class='icon ion-android-close' style='color:crimson'></i>\n\
                                <div class='row'>\n\
                                    <div class='col'>\n\
                                        Anfang<br>\n\
                                        <input id='arbeit_planen_pause_"+pausenId+"_anfang' class='arbeit_planen_hinzufuegen_pause' type='time' step='900' style='text-align:center;width:100%'>\n\
                                    </div>\n\
                                    <div class='col'>\n\
                                        Ende<br>\n\
                                        <input id='arbeit_planen_pause_"+pausenId+"_ende' class='arbeit_planen_hinzufuegen_pause' type='time' step='900' style='text-align:center;width:100%'>\n\
                                    </div>\n\
                                </div>\n\
                            </div>";  
            $("#arbeit_planen_hinzufuegen_pause_table").append(string);                
            setOnclick(pausenId);
            $ionicScrollDelegate.resize();
            function setOnclick(pausenId) {
                $("#arbeit_planen_hinzufuegen_pausenfeld_delete_button_"+pausenId).click(function(){
                    $("#arbeit_planen_hinzufuegen_pause_"+pausenId+"_tableRow").html(" ");
                    $("#arbeit_planen_hinzufuegen_pause_"+pausenId+"_tableRow").hide();
                    $ionicScrollDelegate.resize();
                });
            }                
         });
             
    };
    $scope.arbeit_planen_hinzufuegen = function() {
        arbeitPlanenHinzufuegen_abrechnungsStatusGlobal = $("#arbeit_planen_hinzufuegen_abrechnungsStatus").val();        
        arbeitPlanenHinzufuegen_arbeitsBeginnGlobal = new Date($('#arbeitPlanenHinzufuegen_beginn_date').val() +" "+ $('#arbeitPlanenHinzufuegen_beginn_time').val());
        arbeitPlanenHinzufuegen_arbeitsEndeGlobal = new Date($('#arbeitPlanenHinzufuegen_ende_date').val() +" "+ $('#arbeitPlanenHinzufuegen_ende_time').val());
        var pausen = document.getElementsByClassName("arbeit_planen_hinzufuegen_pause");
        var pausenListe = [];
        for(i=0;i<pausen.length;i++){
            var pause_anfang = pausen[i].value;
            i++;
            var pause_ende = pausen[i].value;           
            var pause_anfang_Date = new Date($('#arbeitPlanenHinzufuegen_beginn_date').val() + " " + pause_anfang);
            //alert($('#arbeitPlanenHinzufuegen_beginn_date').val());
            //alert(pause_anfang);
            //alert(pause_anfang_Date);
            var pause_ende_Date = new Date($('#arbeitPlanenHinzufuegen_beginn_date').val() +" " + pause_ende);
            //alert(pause_ende_Date);
            pausenListe.push(pause_anfang_Date,pause_ende_Date);  
        }
        arbeitPlanenHinzufuegen_pausenListeGlobal = pausenListe;
        setTimeout(function() {
            $('#arbeitPlanen_list').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
        },1);
    };
    $scope.mitarbeiterAbschliessen = function(){
        actionToPerformGlobal = "mitarbeiterAbschliessen";
        setTimeout(function() {
            $('#liste_content').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
        },1);        
    };
    $scope.mitarbeiter_verschieben_anzeigen = function () {
        $state.go('tabs.mitarbeiterVerschieben');
    };
    $scope.mitarbeiterVerschieben = function() {
        actionToPerformGlobal = "mitarbeiterVerschieben";
        mitarbeiterVerschieben_standnummerGlobal = $('#mitarbeiterVerschieben_standnummer').val();        
        if(mitarbeiterVerschieben_standnummerGlobal == geleiteterStandGlobal){
            var json = {vid:aktuelleVidGlobal};
            $.ajax({
                type: "GET",
                url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung",
                data: json,
                dataType: 'json'
            }).then(function(data) {
                setTimeout(function() {
                    $('#liste_content').scope().standoptionen_mitarbeiterliste_anzeigen(false, data);
                },1);  
            });
        } else {
            setTimeout(function() {
                $('#liste_content').scope().standoptionen_mitarbeiterliste_anzeigen(true, standdetails_dataGlobal);
            },1);  
        }
    };
    $scope.betreiber_optionen_anzeigen = function() {
        $state.go('betreiberoptionen');
    };
    $scope.changeScrollable = function(boolean) {
        $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(boolean);
    };  
    $scope.resizeScroll = function() {
        $ionicScrollDelegate.resize();
    };
    $scope.historyGoBack = function(count) {
        $ionicHistory.goBack(count);
    };
    $scope.offene_arbeiten_anzeigen = function() {
        callToDeleteOrChangeFromOffeneArbeiten = true;
        var json = { vid:aktuelleVidGlobal,
                     standnummer:geleiteterStandGlobal };
        $.ajax({
                type: "GET",
                url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/offeneArbeiten",
                data: json,
                dataType: 'json'
            }).then(function(data) {
                $state.go('tabs.offeneArbeiten');
                setTimeout(function() {
                    offene_arbeiten_anzeigen(data);
                },1);  
            });
        
    };    
    $scope.logout = function() {
        usernameGlobal = "";
        
        vergangeneVeranstaltungenGlobal = [];
        gegenwaertigeVidGlobal = null;
        aktuelleVidGlobal  = null;
        
        aktuellerVeranstaltungsNameGlobal = null;
        aktuelleVeranstaltungBeginnGlobal = null;
        aktuelleVeranstaltungEndeGlobal = null;
        globalCheck = null;
        globalPauseIsUpdate = false;
        geleiteterStandGlobal = null;
        standdetails_dataGlobal = null;
        actionToPerformGlobal = null;
        arbeitBeginnen_arbeitsBeginnGlobal = null;
        pauseHinzufuegen_pausenBeginn = null;
        pauseHinzufuegen_pausenEnde = null;
        arbeitBeenden_arbeitsEndeGlobal = null;
        arbeitPlanenHinzufuegen_abrechnungsStatusGlobal = null;
        arbeitPlanenHinzufuegen_arbeitsBeginnGlobal = null;
        arbeitPlanenHinzufuegen_arbeitsEndeGlobal = null;
        arbeitPlanenHinzufuegen_pausenListeGlobal = null;
        callFromMainMenu  = null;
        callToDeleteOrChangeFromOffeneArbeiten  = null;
        
        standdetailsMitarbeiterDataGlobal = [];
        maDetailsDataGlobal = {};
        $state.go("login");        
    };    
    
    $scope.doRefresh = function() {
        if(actionToPerformGlobal === "mitarbeiterVerschieben" && mitarbeiterVerschieben_standnummerGlobal == geleiteterStandGlobal) {
            
            var json = {vid:aktuelleVidGlobal};
            
            $.ajax({
                type: "GET",
                url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung",
                data: json,
                dataType: 'json'
            }).then(function(data) {
                
                standdetailsInObjektWandeln(data[0], false);
                $scope.$broadcast('scroll.refreshComplete');  
            });            
        } else {  
            
            var json = {
                vid:aktuelleVidGlobal,
                standnummer:geleiteterStandGlobal
            };
            
            $.ajax({
                type: "GET",
                url: "http://tomcat01lab.cs.univie.ac.at:31740/mitarbeiterService/veranstaltung/stand/details",
                data: json,
                dataType: 'json'
            }).then(function(data){
                
                standdetails_dataGlobal = data;
                standdetailsInObjektWandeln(data[0], true);
                $scope.$broadcast('scroll.refreshComplete');               
            });            
        }        
    };
    
    $scope.showAlert = function(title, text) {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: text
        });
    };
    $scope.showConfirmArbeitLoeschen = function(arbeitsbeginn, username, isArbeitAktiv) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Arbeit l&oumlschen',
          template: 'Soll die Arbeit wirklich gel&oumlscht werden?',
          cancelText: 'Nein',
          cancelType: 'button-assertive',
          okText: 'Ja',
          okType: 'button-balanced'
        });

        confirmPopup.then(function(res) {
          if(res) {
            arbeit_loeschen(arbeitsbeginn, username, isArbeitAktiv);
          }
        });
    };
    $scope.aktuellerVeranstaltungsName = aktuellerVeranstaltungsNameGlobal;
    $scope.dev_width = $window.innerWidth;
    $scope.dev_height = $window.innerHeight;
    $scope.kilometer = 0;
    $scope.kilometer2 = function() { return $scope.kilometer;};
    $scope.arbeitsbeginn;
    $scope.arbeitsende; 
    $scope.arbeitPlanenHinzufuegenTitle = function(){
        return arbeitPlanenHinzufuegenTitleGlobal;
    };
    $scope.standdetailsMitarbeiterData = function() { return standdetailsMitarbeiterDataGlobal;};
    $scope.predicate = 'mitarbeitername';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : true;
        $scope.predicate = predicate;        
    }; 
    $scope.vergangeneVeranstaltungen = function() { return vergangeneVeranstaltungenGlobal; };
    $scope.maDetailsData = function() {return maDetailsDataGlobal; };
    $scope.arbeitDetailsData = function() {return arbeitDetailsDataGlobal};   
    $scope.vergangeneArbeitDetailsAnzeigen = function(arbeitstag, arbeit) {
        arbeitDetailsDataGlobal = $scope.maDetailsData().arbeitstage[arbeitstag].arbeiten[arbeit];       
        $state.go('tabs.past_arbeitszeiten_details');
    };
    $scope.getWindowHeight = function() {
        return $window.innerHeight;
    };
})

.run(function($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
   // var loginContentHeight = $('#login_content').height();
    //$('#login_content').css('margin-top', ($window.innerHeight-93-loginContentHeight)/2 );    
  });
});