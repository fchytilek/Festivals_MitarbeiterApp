app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'testController'
    })    
    .state("tabs", {
      url: '/tabs',
      abstract: true,
      templateUrl: 'tabs.html'
    })
    .state('tabs.liste', {
      url: "/liste",
      views: {
        'home-tab': {
          templateUrl: "liste.html",
          controller: 'testController'
        }
      }
    })
    .state('tabs.keineAktuelleVeranstaltung', {
        url: '/keineVeranstaltung',
       views: {
        'home-tab': {
          templateUrl: "keineAktuelleVeranstaltung.html",
          controller: 'testController'
        }
      }
    }) 
    .state('tabs.arbeitszeiten', {
      url: "/arbeitszeiten",
      views: {
        'home-tab': {
          templateUrl: "liste/arbeitszeiten.html",
          controller: 'testController'
        }
      }
    })
    .state('tabs.arbeitszeiten_details', {
      url: "/arbeitszeiten_details",
      views: {
        'home-tab': {
          templateUrl: "liste/arbeitszeiten_details.html",
          controller: 'testController'
        }
      }
    })
    .state('tabs.anreisekosten_angeben', {
      url: "/anreisekosten_angeben",
      views: {
        'home-tab': {
          templateUrl: "liste/anreisekosten_angeben.html",
          controller: 'testController'
        }
      }
    })
    .state('tabs.geplante_arbeiten', {
        url: "/geplante_arbeiten",
        views: {
            'home-tab': {
                templateUrl: "liste/geplante_arbeiten.html",
                controller: 'testController'
            }
        }
    })
    .state('tabs.pause_wuenschen', {
        url: "/pause_wuenschen",
        views: {
            'home-tab': {
                templateUrl: "liste/pause_wuenschen.html",
                controller: 'testController'
            }
        }
    })
    .state('tabs.past', {
      url: "/past",
      views: {
        'past-tab': {
          templateUrl: "past.html",
          controller: 'testController'
        }
      }
    })
    .state('tabs.past_maDetails', {
        url: "/pastMaDetails",
        views: {
          'past-tab': {
            templateUrl: "past/maDetails.html",
            controller: 'testController'
          }
        }
    })
    .state('tabs.past_arbeitszeiten_details', {
        url: "/pastArbeitDetails",
        views: {
          'past-tab': {
            templateUrl: "past/arbeitDetails.html",
            controller: 'testController'
          }
        }
    })
    .state('tabs.future', {
        url: "/future",
        views: {
            'future-tab': {
                templateUrl: "future.html",
                controller: 'testController'
            }
        }
    })
    .state('tabs.standoptionen_anzeigen', {
        url: "/standoptionen",
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen.html',
                controller: 'testController'
            }
        }
    })
    .state('tabs.standdetails', {
        url: "/standdetails",   
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen/standdetails.html',
                controller: 'testController'
            }            
        }
    })
    /*.state('tabs.standdetails.details', {
        url: "/details",
        views: {
            /*'standoptionen_standdetails_view': {
                templateUrl: 'liste/standoptionen/standdetails/details.html',
                controller: 'testController'
            },
            'standoptionen_mitarbeiterliste_view': {
                templateUrl: 'liste/standoptionen/mitarbeiterliste/liste.html',
                controller: 'testController'
            }
        }
    })*/
    .state('tabs.standoptionen_mitarbeiterliste', {
        url:"/mitarbeiterliste",
        abstract:true,
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen/mitarbeiterliste.html',
                controller: 'testController'
            }
        }
    })
    .state('tabs.standoptionen_mitarbeiterliste.liste', {
        url:"/liste",
        views: {
            'standoptionen_mitarbeiterliste_view': {
                templateUrl: 'liste/standoptionen/mitarbeiterliste/liste.html',
                controller: 'testController'
            }
        }
    })
    .state('tabs.arbeitBeginnen', {
        url: '/arbeitBeginnen',
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen/arbeitBeginnen.html',
                controller: 'testController'
            }
        }
    })
    .state('tabs.pauseHinzufuegen', {
       url: '/pauseHinzufuegen',
       views: {
           'home-tab': {
               templateUrl: 'liste/standoptionen/pauseHinzufuegen.html',
               controller: 'testController'
           }
       } 
    })
    .state('tabs.arbeitBeenden', {
        url: '/arbeitBeenden',
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen/arbeitBeenden.html',
                controller: 'testController'
            }
        }
    })
    .state('tabs.arbeitPlanen', {
       url: '/arbeitPlanen',
       views: {
           'home-tab': {
                templateUrl: 'liste/standoptionen/arbeitPlanen.html',
                controller: 'testController'
            }
       } 
    })
    .state('tabs.mitarbeiterVerschieben', {
        url: '/mitarbeiterVerschieben',
        views: {
            'home-tab': {
                templateUrl: 'liste/standoptionen/mitarbeiterVerschieben.html',
                controller: 'testController'
            }
        }
    })
    .state('betreiberoptionen', {
       url: '/betreiberoptionen',
       templateUrl: 'betreiberoptionen/abrechnung.html',
       controller: 'testController'          
    })
    .state('tabs.offeneArbeiten', {
       url: '/offeneArbeiten',
       views: {
           'home-tab': {
                templateUrl: 'liste/standoptionen/offeneArbeiten.html',
                controller: 'testController'
           }
       }      
    });
    
    $ionicConfigProvider.navBar.alignTitle("center");
});