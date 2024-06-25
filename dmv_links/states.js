var states = {
  AK: {
    state: "Alaska",
    latitude: 61.385,
    longitude: -152.2683,
    link: "http://doa.alaska.gov/dmv/home.htm/",
    state: "failed,removed"
  },
  AL: {
    state: "Alabama",
    latitude: 32.799,
    longitude: -86.8073,
    link: "http://revenue.alabama.gov/eservices/",
    state: "failed,404"
  },
  AR: {
    state: "Arkansas",
    latitude: 34.9513,
    longitude: -92.3809,
    link: "http://www.dfa.arkansas.gov/Pages/onlineServices.aspx/",
    state: "failed,404"
  },
  AZ: {
    state: "Arizona",
    latitude: 33.7712,
    longitude: -111.3877,
    link: "https://www.azdot.gov/mvd/onlineservices",
    state: "failed, https://azdot.gov/mvd"

  },
  CA: {
    state: "California",
    latitude: 36.17,
    longitude: -119.7462,
    link: "https://www.dmv.ca.gov/portal/dmv/detail/online/onlinesvcs",
    state: "valid"
  },
  CO: {
    state: "Colorado",
    latitude: 39.0646,
    longitude: -105.3272,
    link: "https://www.colorado.gov/pacific/dmv/online-services",
    state: "valid"
  },
  CT: {
    state: "Connecticut",
    latitude: 41.5834,
    longitude: -72.7622,
    link: "http://www.ct.gov/dmv/cwp/view.asp?a=803&q=569496",
    state: "failed, 403 looks like new link is https://portal.ct.gov/dmv?language=en_US"
  },
  DC: {
    state: "District of Columbia",
    latitude: 38.9072,
    longitude: -77.0369,
    link: "http://dmv.dc.gov/service/dmv-online-services",
    state: "valid"
  },
  DE: {
    state: "Delaware",
    latitude: 39.3498,
    longitude: -75.5148,
    link: "https://services.dmv.de.gov/services/online_svcs.shtml",
    state: "valid"
  },
  FL: {
    state: "Florida",
    latitude: 27.8333,
    longitude: -81.717,
    link: "http://www.flhsmv.gov/html/online.html",
    state: "failed, 404"
  },
  GA: {
    state: "Georgia",
    latitude: 32.9866,
    longitude: -83.6487,
    link: "https://dor.georgia.gov/online-services",
    state: "valid"
  },
  HI: {
    state: "Hawaii",
    latitude: 21.1098,
    longitude: -157.5311,
    link: "https://portal.ehawaii.gov/home/online-services/#onlineApps",
    state: "valid"
  },
  IA: {
    state: "Iowa",
    latitude: 42.0046,
    longitude: -93.214,
    link: "http://www.iowadot.gov/onlineservices.html#/onlineservices",
    state: "failed"
  },
  ID: {
    state: "Idaho",
    latitude: 44.2394,
    longitude: -114.5103,
    link: "http://itd.idaho.gov/dmv/online_services.html",
    state: "failed, 404"
  },
  IL: {
    state: "Illinois",
    latitude: 40.3363,
    longitude: -89.0022,
    link: "http://www.cyberdriveillinois.com/services/eservices.html",
    state: "failed, 403 + looks that a new address https://www.ilsos.gov/online_services/home.html"
  },
  IN: {
    state: "Indiana",
    latitude: 39.8647,
    longitude: -86.2604,
    link: "http://www.in.gov/bmv/2967.htm",
    state: "failed, 404"
  },
  KS: {
    state: "Kansas",
    latitude: 38.5111,
    longitude: -96.8005,
    link: "http://www.ksrevenue.org/eservices.html",
    state: "failed"
  },
  KY: {
    state: "Kentucky",
    latitude: 37.669,
    longitude: -84.6514,
    link: "http://kentucky.gov/Services/Pages/default.aspx",
    state: "failed, 403"
  },
  LA: {
    state: "Louisiana",
    latitude: 31.1801,
    longitude: -91.8749,
    link: "http://www.expresslane.org/Pages/default.aspx",
    state: "valid"
  },
  MA: {
    state: "Massachusetts",
    latitude: 42.2373,
    longitude: -71.5314,
    link: "https://www.massrmv.com/OnlineBranch.aspx",
    state: "failed"
  },
  MD: {
    state: "Maryland",
    latitude: 39.0724,
    longitude: -76.7902,
    link: "http://www.mva.maryland.gov/online-services/",
    state: "failed, domain is correct but the was link changed"
  },
  ME: {
    state: "Maine",
    latitude: 44.6074,
    longitude: -69.3977,
    link: "http://www.maine.gov/portal/online_services/categories/vehicles.html",
    state: "valid"
  },
  MI: {
    state: "Michigan",
    latitude: 43.3504,
    longitude: -84.5603,
    link: "https://onlineservices.michigan.gov/ExpressSOS/",
    state: "failed, looks like the link changed to https://www.michigan.gov/sos/faqs/resources/online-services"
  },
  MN: {
    state: "Minnesota",
    latitude: 45.7326,
    longitude: -93.9196,
    link: "https://dps.mn.gov/divisions/dvs/online-self-services/Pages/default.aspx",
    state: "failed, unauthorised request"
  },
  MO: {
    state: "Missouri",
    latitude: 38.4623,
    longitude: -92.302,
    link: "http://dor.mo.gov/online.php",
    state: "valid"
  },
  MS: {
    state: "Mississippi",
    latitude: 32.7673,
    longitude: -89.6812,
    link: "http://www.dps.state.ms.us/",
    state: "failed, 302 redirected to https://www.dps.ms.gov/"
  },
  MT: {
    state: "Montana",
    latitude: 46.9048,
    longitude: -110.3261,
    link: "https://dojmt.gov/driving/",
    state: "failed, 403"
  },
  NC: {
    state: "North Carolina",
    latitude: 35.6411,
    longitude: -79.8431,
    link: "https://www.ncdot.gov/dmv/online/",
    state: "failed, 403"
  },
  ND: {
    state: "North Dakota",
    latitude: 47.5362,
    longitude: -99.793,
    link: "https://www.dot.nd.gov/divisions/driverslicense/driver.htm#onlineservices",
    state: "valid"
  },
  NE: {
    state: "Nebraska",
    latitude: 41.1289,
    longitude: -98.2883,
    link: "http://www.clickdmv.ne.gov/",
    state: ""
  },
  NH: {
    state: "New Hampshire",
    latitude: 43.4108,
    longitude: -71.5653,
    link: "http://www.nh.gov/safety/divisions/dmv/online-services/",
    state: "valid"
  },
  NJ: {
    state: "New Jersey",
    latitude: 40.314,
    longitude: -74.5089,
    link: "http://www.state.nj.us/mvc/About/MyMVC.htm",
    state: "failed, 404"
  },
  NM: {
    state: "New Mexico",
    latitude: 34.8375,
    longitude: -106.2371,
    link: "https://eservices.mvd.newmexico.gov/eTapestry/_/#4",
    state: "valid"
  },
  NV: {
    state: "Nevada",
    latitude: 38.4199,
    longitude: -117.1219,
    link: "http://www.dmvnv.com/onlineservices.htm",
    state: "valid"
  },
  NY: {
    state: "New York",
    latitude: 42.1497,
    longitude: -74.9384,
    link: "https://dmv.ny.gov/more-info/all-online-transactions",
    state: "valid"
  },
  OH: {
    state: "Ohio",
    latitude: 40.3736,
    longitude: -82.7755,
    link: "http://www.bmv.ohio.gov/online-services.aspx",
    state: "failed, firewall"
  },
  OK: {
    state: "Oklahoma",
    latitude: 35.5376,
    longitude: -96.9247,
    link: "https://www.ok.gov/tax/Online_Services/index.html",
    state: "failed, looks like new service is located at https://oklahoma.gov/dps.html"
  },
  OR: {
    state: "Oregon",
    latitude: 44.5672,
    longitude: -122.1269,
    link: "https://www.oregon.gov/ODOT/DMV/Pages/Online_Services/Online_Index.aspx",
    state: "failed, 401"
  },
  PA: {
    state: "Pennsylvania",
    latitude: 40.5773,
    longitude: -77.264,
    link: "http://www.dmv.pa.gov/ONLINE-SERVICES/Pages/OnlineServicesCenter.aspx",
    state: "valid"
  },
  RI: {
    state: "Rhode Island",
    latitude: 41.6772,
    longitude: -71.5101,
    link: "http://www.dmv.ri.gov/services/",
    state: "valid, but redirection to https://dmv.ri.gov/online-services"
  },
  SC: {
    state: "South Carolina",
    latitude: 33.8191,
    longitude: -80.9066,
    link: "https://www.scdmvonline.com/DMVpublic/",
    state: "failed"
  },
  SD: {
    state: "South Dakota",
    latitude: 44.2853,
    longitude: -99.4632,
    link: "http://dor.sd.gov/Motor_Vehicles/",
    state: "valid, but redirected to https://dor.sd.gov/individuals/motor-vehicle/"
  },
  TN: {
    state: "Tennessee",
    latitude: 35.7449,
    longitude: -86.7489,
    link: "https://www.tn.gov/safety/topic/online",
    state: "failed"
  },
  TX: {
    state: "Texas",
    latitude: 31.106,
    longitude: -97.6475,
    link: "http://www.txdps.state.tx.us/DriverLicense/OnlineServices.htm",
    state: "failed, new link like https://www.txdmv.gov/"
  },
  UT: {
    state: "Utah",
    latitude: 40.1135,
    longitude: -111.8535,
    link: "http://dmv.utah.gov/",
    state: "failed"
  },
  VA: {
    state: "Virginia",
    latitude: 37.768,
    longitude: -78.2057,
    link: "http://www.dmv.virginia.gov/onlineServices/#index.html",
    state: "valid, but redirection to https://www.dmv.virginia.gov/online-services#index.html"
  },
  VT: {
    state: "Vermont",
    latitude: 44.0407,
    longitude: -72.7093,
    link: "http://dmv.vermont.gov/online_services",
    state: "failed, 404"
  },
  WA: {
    state: "Washington",
    latitude: 47.3917,
    longitude: -121.5708,
    link: "http://www.dol.wa.gov/onlinesvcs.html",
    state: "valid, but redirected to https://fortress.wa.gov/dol/extdriveses/NoLogon/_/"
  },
  WI: {
    state: "Wisconsin",
    latitude: 44.2563,
    longitude: -89.6385,
    link: "http://wisconsindot.gov/Pages/online-srvcs/online.aspx",
    state: "valid"
  },
  WV: {
    state: "West Virginia",
    latitude: 38.468,
    longitude: -80.9696,
    link: "https://apps.wv.gov/dmv/selfservice",
    state: "valid"
  },
  WY: {
    state: "Wyoming",
    latitude: 42.7475,
    longitude: -107.2085,
    link: "http://www.dot.state.wy.us/home/driver_license_records.html",
    state: "valid"
  },
};
