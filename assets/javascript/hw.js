
  var config = {
    apiKey: "AIzaSyAGK2ln5AYvzVMyjYAT5bXJfaPG5mkGQds",
    authDomain: "traintimes-46de6.firebaseapp.com",
    databaseURL: "https://traintimes-46de6.firebaseio.com",
    projectId: "traintimes-46de6",
    storageBucket: "traintimes-46de6.appspot.com",
    messagingSenderId: "146296837702"
  };

  firebase.initializeApp(config);


  var trainData = firebase.database();

    // This function will store the user input in firebase
    $("#add-train-btn").on("click", function() {

      var trainName = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var firstTrain = $("#first-train-input").val().trim();
      var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {

     name: trainName,
     destination: destination,
     firstTrain: firstTrain,
     frequency: frequency
   };

   trainData.ref().push(newTrain);

   console.log(newTrain.name);
   console.log(newTrain.destination);
   console.log(newTrain.firstTrain);
   console.log(newTrain.frequency);

   // text boxes will clear after info is submitted
   $("#train-name-input").val("");
   $("#destination-input").val("");
   $("#first-train-input").val("");
   $("#frequency-input").val("");

   return false;
 });


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {

      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);


    // New rows are appended to the table. A remove button will also be added to each row
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
            tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td><td>" + "<input type='submit' value='Remove' class='remove-train btn'>" + "</td></tr>");

            // When the "remove" button is clicked, it will delete/remove that particular row
            $(".remove-train").click(function(){
              $(this).parents('tr').first().remove();
          });

  });
