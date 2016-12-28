IoTCentralControl

A vehicle central admin server using node.js and express.js that displays and updates vehicle safety readings – An IOT Connected Home and Vehicle Project Implementation.

Scenario: 
User has setup IoT devices in their entire family’s car. This IoT device monitors following safety thresholds:
* Tire pressure (Individually measured): All 4 need to be between 30 and 35 PSI
* Speed: Find speed limitations by GPS parameters provided
* Temperature: 
  o Low: 64-70 F
  o Medium:72-90 F
  o High:90-110 F
  o Unsafe: Lesser than 60 F and Greater than110 F
* Carbon Monoxide levels inside the car: Greater than 70 ppm
* Pollen levels for allergy:
  o Low: 0-2.4
  o Low-Medium:  2.5-4.8
  o Medium: 4.9 – 7.2
  o Medium-High:7.3 – 9.6
  o High: 9.7 and above 
* Last Updated Reading: Within 3-minute interval 

User needs an automated system that will remotely monitor the vehicles for various safety parameters in form of request response methodology and receive send alerts to family members if the system detects a failure of these safety parameters. Additionally, the user also needs the system to extract and save this information to create weekly/monthly reports to analyze safety of each vehicle and take actions for servicing those vehicles if required.

Technical Thought:
The requirement needs more concurrent calls and less processing power. All the IoT devices need to transmit and receive information from the central server by making API calls. Also, the processing on the server side is pretty light as all the server does is receive requests, match it against safety parameters, display and send information to all its IOT devices. That is why I selected Node.JS as it is very good in doing the same.
There is good amount of routing involved and Express.JS’s middleware will be helpful to accomplish this. Also, using API calls to filter by, sort by, search by and download files for reporting purposes is something that will be easily done using express framework on top of Node JS

Software Components:
* Node JS
* Express JS
* NPM Packages: fs, path, lodash, consolidate – since using shims for handlebars and JSONStream – for non-blocking read/write streams compared to blocking fs calls

Implementation Details:
• Layout includes 
  o An index.js file which uses express.js to receive http calls from IoT devices or any other API. Initially, it displays all the vehicles in the users configuration. Clicking on any of these vehicles will make an api call to the get information about that vehicle. It also handles error. I am using custom error handling middleware such .
  o 2 types of json files – One to store combined vehicle info and another one is per vehicle for its detailed information. This file will get/set the safety parameters reading mentioned above.
  o A vehicle router file that manages get and put http calls to the server. When an update request is made by the IoT it makes a put call to json
  o Common utilities files that servers as a helper file to achieve the functionality by the index and vehicle router file
  o Handlebar as a view template for index and vehicles rendering.
• User/app/IoT device can
  o Look at the combined stats of all vehicles in the dashboard(index.js)
  o Look at the individual stats of the vehicle’s emission by clicking on the respective vehicle. The server then fetches info about the vehicle by passing its corresponding vehicle id
  o Make API calls 
    * Fetch information about a vehicle by forming a api request (/vehicles/<id>)
    * Filter or search personal vehicles using (/vehicles/my) url call 
    * Filter by an other parameter using http calls like
    *  (/vehicles/dangerousTemperatureVehicles)
    * (/vehicles/lowTirePressureVehicles)
    * (/vehicles/findin/state)….etc

    * Downloading a timestamped json file per vehicle for big data analytics using (/<id>.json)
    * Updating the vehicle reading by making a PUT call and sending the parameters to be updated. Any parameters that is not mentioned in request will retain it previous values, except for the updated time which is auto set when the update is made.

